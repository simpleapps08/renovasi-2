import Header from "@/components/layout/Header";
import HeroSection from "@/components/sections/HeroSection";
import PainPointsSection from "@/components/sections/PainPointsSection";
import WhyChooseSection from "@/components/sections/WhyChooseSection";
import ServicesSection from "@/components/sections/ServicesSection";
import ProcessSection from "@/components/sections/ProcessSection";
import GallerySection from "@/components/sections/GallerySection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import FAQSection from "@/components/sections/FAQSection";
import CTASection from "@/components/sections/CTASection";
import Footer from "@/components/layout/Footer";

const Index = () => {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <PainPointsSection />
        <WhyChooseSection />
        <ServicesSection />
        <ProcessSection />
        <GallerySection />
        <TestimonialsSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
};

export default Index;
