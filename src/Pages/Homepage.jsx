import Banner from "../Components/Homepage/banner";
import AboutSection from "../Components/Homepage/about_us"
import FeatureSection from "../Components/Homepage/features"
import PowerfulFeature from "../Components/Homepage/powerful_feature";
import Templates from "../Components/Homepage/templates";
import WhySimba from "../Components/Homepage/whysimba";
import FAQs from "../Components/Homepage/faqs";
import ServiceSection from "../Components/Homepage/service_section";
import ReviewsSection from "../Components/Homepage/reviews";
import Team from "../Components/Homepage/team";
import PricingPlan from "../Components/Homepage/pricingplan";

export default function Homepage() {
  return (
    <>
      <Banner />
      <AboutSection /> 
      <FeatureSection />
      <ServiceSection />
      <PowerfulFeature />
      <Templates /> 
      <WhySimba />
      <FAQs />
      <Team />
      <PricingPlan />
      <ReviewsSection />
    </>
  );
}
