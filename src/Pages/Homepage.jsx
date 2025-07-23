import Header from "../Components/Header";
import Banner from "../Components/Homepage/banner";
import AboutSection from "../Components/Homepage/about_us"
import FeatureSection from "../Components/Homepage/features"

export default function Homepage() {
  return (
    <>
      <Header />
      <Banner />
      <AboutSection /> 
      <FeatureSection />
    </>
  );
}
