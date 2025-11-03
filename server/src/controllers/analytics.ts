import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import AnalyticsSyncService from "../scripts/analyticsSyncService";

const prisma = new PrismaClient();

interface Metrics {
  likes?: number;
  shares?: number;
  comments?: number;
  views?: number;
  engagement_rate?: number | null;
  likeCount?: number;
  shareCount?: number;
  commentCount?: number;
  viewCount?: number;
}

interface AnalyticsData {
  likes: number;
  shares: number;
  comments: number;
  views: number;
  engagement_rate: number | null;
}

interface PostWithAnalytics {
  id: string;
  content: string;
  created_date: Date;
  analytics: AnalyticsData;
  published_data: any;
}

interface TimeseriesData {
  date: string;
  likes: number;
  shares: number;
  comments: number;
}

interface TotalsData {
  likes: number;
  shares: number;
  comments: number;
  views: number;
  engagement_rate: number | null;
}

function safeNumber(v: any): number {
  if (v === undefined || v === null) return 0;
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function extractMetrics(metrics: any): AnalyticsData {
  if (!metrics || typeof metrics !== "object") {
    return {
      likes: 0,
      shares: 0,
      comments: 0,
      views: 0,
      engagement_rate: null,
    };
  }

  const likes = safeNumber(
    metrics.likeCount ||
      metrics.likes ||
      metrics.like_count ||
      (metrics.likes && metrics.likes.total) ||
      0
  );
  const shares = safeNumber(
    metrics.shareCount || metrics.shares || metrics.share_count || 0
  );
  const comments = safeNumber(
    metrics.commentCount || metrics.comments || metrics.comment_count || 0
  );
  const views = safeNumber(metrics.viewCount || metrics.views || 0);
  const engagement_rate =
    views > 0
      ? ((likes + shares + comments) / views) * 100
      : metrics.engagement_rate || null;

  return { likes, shares, comments, views, engagement_rate };
}

class AnalyticsController {
  // GET /api/analytics?platform=linkedin
  list = async (req: Request, res: Response): Promise<void> => {
    try {
      const platform = ((req.query.platform as string) || "all").toLowerCase();

      const now = new Date();
      const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

      // Fetch posts created within last 30 days
      const posts = await prisma.socialPost.findMany({
        where: {
          created_date: { gte: startDate },
          status: "published", // Only include published posts since only they get analytics
        },
        orderBy: { created_date: "desc" },
      });

      // Filter by platform if requested
      const filtered = posts.filter((post) => {
        if (platform === "all") return true;

        try {
          const published = post.published_data as any;
          if (published && published[platform]) return true;
        } catch (e) {
          // Log error but continue
          console.warn("Error checking published_data:", e);
        }

        try {
          const plats = Array.isArray(post.platforms)
            ? post.platforms
            : post.platforms
            ? JSON.parse(post.platforms as string)
            : [];
          if (Array.isArray(plats) && plats.includes(platform)) return true;
        } catch (e) {
          console.warn("Error parsing platforms:", e);
        }

        try {
          const engagement = post.engagement_data as any;
          if (engagement && engagement[platform]) return true;
        } catch (e) {
          console.warn("Error checking engagement_data:", e);
        }

        return false;
      });

      // Build per-post analytics and totals
      const postsWithAnalytics: PostWithAnalytics[] = filtered.map((post) => {
        // Try engagement_data for the platform first
        let metrics: any = {};
        try {
          if (platform === "all") {
            // For 'all' platform, aggregate metrics from all platforms
            if (
              post.engagement_data &&
              typeof post.engagement_data === "object"
            ) {
              const allMetrics = { likes: 0, shares: 0, comments: 0, views: 0 };
              Object.values(post.engagement_data as any).forEach(
                (platformData: any) => {
                  if (platformData && typeof platformData === "object") {
                    allMetrics.likes += safeNumber(platformData.likes || 0);
                    allMetrics.shares += safeNumber(platformData.shares || 0);
                    allMetrics.comments += safeNumber(
                      platformData.comments || 0
                    );
                    allMetrics.views += safeNumber(platformData.views || 0);
                  }
                }
              );
              metrics = allMetrics;
            }
          } else if (
            post.engagement_data &&
            typeof post.engagement_data === "object" &&
            (post.engagement_data as any)[platform]
          ) {
            metrics = (post.engagement_data as any)[platform];
          } else if (
            post.engagement_data &&
            typeof post.engagement_data === "object" &&
            Object.keys(post.engagement_data).length > 0
          ) {
            // fallback: use top-level engagement_data if it already holds flattened metrics
            metrics = post.engagement_data;
          }
        } catch (e) {
          console.warn("Error extracting metrics:", e);
          metrics = {};
        }

        // Also accept a legacy `analytics` object on the record
        if (
          (!metrics || Object.keys(metrics).length === 0) &&
          post.analytics &&
          typeof post.analytics === "object"
        ) {
          metrics = post.analytics;
        }

        const extracted = extractMetrics(metrics);

        return {
          id: post.id,
          content: post.content,
          created_date: post.created_date,
          analytics: extracted,
          published_data: post.published_data || null,
        };
      });

      const totals: TotalsData = postsWithAnalytics.reduce(
        (acc, p) => {
          acc.likes += p.analytics.likes || 0;
          acc.shares += p.analytics.shares || 0;
          acc.comments += p.analytics.comments || 0;
          acc.views += p.analytics.views || 0;
          return acc;
        },
        { likes: 0, shares: 0, comments: 0, views: 0, engagement_rate: null }
      );

      totals.engagement_rate =
        totals.views > 0
          ? ((totals.likes + totals.shares + totals.comments) / totals.views) *
            100
          : null;

      // Build timeseries array for last 30 days
      const timeseriesMap: Record<string, TimeseriesData> = {};
      for (let i = 0; i < 30; i++) {
        const d = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
        const key = d.toISOString().slice(0, 10);
        timeseriesMap[key] = { date: key, likes: 0, shares: 0, comments: 0 };
      }

      for (const p of postsWithAnalytics) {
        const key = new Date(p.created_date).toISOString().slice(0, 10);
        if (timeseriesMap[key]) {
          timeseriesMap[key].likes += p.analytics.likes || 0;
          timeseriesMap[key].shares += p.analytics.shares || 0;
          timeseriesMap[key].comments += p.analytics.comments || 0;
        }
      }

      const timeseries = Object.values(timeseriesMap);

      res.json({
        success: true,
        platform,
        startDate: startDate.toISOString(),
        endDate: now.toISOString(),
        totals,
        posts: postsWithAnalytics,
        timeseries,
      });
    } catch (err: any) {
      console.error("Analytics error:", err);
      res.status(500).json({
        success: false,
        error: err.message || "An error occurred while fetching analytics",
      });
    }
  };

  // POST /api/analytics/sync - Manual analytics sync
  manualSync = async (req: Request, res: Response): Promise<void> => {
    try {
      // Start the sync process asynchronously with force=true to sync all posts
      AnalyticsSyncService.syncAnalytics(true).catch((error: any) => {
        console.error("Manual analytics sync failed:", error);
      });

      res.json({
        success: true,
        message:
          "Analytics sync started successfully. This may take a few minutes to complete.",
      });
    } catch (err: any) {
      console.error("Manual analytics sync error:", err);
      res.status(500).json({
        success: false,
        error: err.message || "Failed to start analytics sync",
      });
    }
  };
}

export default new AnalyticsController();
