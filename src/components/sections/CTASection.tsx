import { Button } from "@/components/ui/enhanced-button"
import { Card, CardContent } from "@/components/ui/card"
import { Link } from "react-router-dom"

const CTASection = () => {
  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <Card className="gradient-card border-0 shadow-xl overflow-hidden">
          <div className="relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 25% 25%, hsl(var(--accent)) 2px, transparent 2px),
                                 radial-gradient(circle at 75% 75%, hsl(var(--accent)) 2px, transparent 2px)`,
                backgroundSize: '50px 50px'
              }}></div>
            </div>
            
            <CardContent className="relative p-12 md:p-16 text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
                Siap Memulai Proyek
                <span className="block text-accent">Renovasi Anda?</span>
              </h2>
              
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Dapatkan estimasi biaya yang akurat dengan simulasi RAB digital kami. 
                Gratis, cepat, dan tanpa komitmen.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                <Button variant="cta" size="xl" asChild>
                  <Link to="/auth">
                    Mulai Simulasi RAB
                    <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </Button>
                
                <Button variant="outline" size="xl">
                  Konsultasi Gratis
                </Button>
              </div>
              
              {/* Trust Indicators */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 pt-8 border-t border-border">
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                    <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-primary">100% Gratis</div>
                    <div className="text-sm text-muted-foreground">Tanpa biaya tersembunyi</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                    <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-primary">Hasil Instan</div>
                    <div className="text-sm text-muted-foreground">Estimasi dalam hitungan menit</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-primary">Export PDF</div>
                    <div className="text-sm text-muted-foreground">Laporan detail siap cetak</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </div>
        </Card>
      </div>
    </section>
  )
}

export default CTASection