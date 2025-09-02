import { Button } from "@/components/ui/enhanced-button"
import { Link } from "react-router-dom"
import heroImage from "@/assets/hero-construction.jpg"

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="SERVISOO Construction Services"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 hero-bg opacity-85"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-4xl">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Renovasi Rumah & Gedung
              <span className="block text-accent">Profesional</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl leading-relaxed">
              Dapatkan estimasi biaya renovasi yang akurat dengan simulasi RAB digital. 
              Transparan, cepat, dan terpercaya untuk proyek impian Anda.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button variant="cta" size="xl" asChild>
                <Link to="/auth">
                  Simulasi RAB Gratis
                  <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </Button>
              
              <Button variant="outline" size="xl" className="border-white/30 text-white hover:bg-white/10">
                Lihat Portofolio
              </Button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-accent mb-2">500+</div>
                <div className="text-white/80">Proyek Selesai</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent mb-2">50+</div>
                <div className="text-white/80">Kontraktor Mitra</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent mb-2">98%</div>
                <div className="text-white/80">Kepuasan Klien</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent mb-2">24/7</div>
                <div className="text-white/80">Konsultasi</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10"></div>
    </section>
  )
}

export default HeroSection