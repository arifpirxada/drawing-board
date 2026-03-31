import Navbar from "../components/home/Navbar";
import HeroSection from "../components/home/HeroSection";
import FeaturesSection from "../components/home/FeaturesSection";
import HowItWorksSection from "../components/home/HowItWorksSection";
import CtaSection from "../components/home/CtaSection";
import Footer from "../components/home/Footer";

const Home = () => {
  return (
    <div className="home-page">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
};

export default Home;