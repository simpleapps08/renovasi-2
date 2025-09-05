import Header from "@/components/layout/Header";
import HeroSection from "@/components/sections/HeroSection";
import ServicesSection from "@/components/sections/ServicesSection";
import GallerySection from "@/components/sections/GallerySection";
import CTASection from "@/components/sections/CTASection";
import Footer from "@/components/layout/Footer";
import FloatingChat from "@/components/ui/FloatingChat";
import FloatingChatLeft from "@/components/ui/FloatingChatLeft";

const Index = () => {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <ServicesSection />
        <GallerySection />
        <CTASection />
      </main>
      <Footer />
      <FloatingChat />
      <FloatingChatLeft />
    </>
  );
};

export default Index;
