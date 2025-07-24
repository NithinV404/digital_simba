import Banner from "../Components/Homepage/banner";
import AboutSection from "../Components/Homepage/about_us"
import FeatureSection from "../Components/Homepage/features"
import PowerfulFeature from "../Components/Homepage/powerful_feature";
import Templates from "../Components/Homepage/templates";
import WhySimba from "../Components/Homepage/whysimba";
import FAQs from "../Components/Homepage/faqs";

export default function Homepage() {
  return (
    <>
      <Header />
      <Banner />
      <AboutSection /> 
      <FeatureSection />
      <PowerfulFeature />
      <Templates /> 
      <WhySimba />
      <FAQs />
    </>
  );
}
