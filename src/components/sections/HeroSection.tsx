import { Button } from "@/components/ui/enhanced-button"
import heroImage from "@/assets/hero-construction.jpg"
import { CheckCircle2, MessageCircle, Star, Users, Clock } from "lucide-react"

const trustPoints = [
  "Estimasi jelas sebelum mulai — nggak ada biaya sembunyi",
  "Pengerjaan rapi dan bersih — finishing diperhatikan",
  "Cocok untuk cat, plafon, dan renovasi rumah di Tuban",
]

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-primary text-primary-foreground">
      <div className="absolute inset-0 z-0">
        <img src={heroImage} alt="Servisoo home renovation service" className="h-full w-full scale-105 object-cover opacity-35" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,11,8,0.95)_0%,rgba(5,11,8,0.85)_50%,rgba(5,11,8,0.75)_100%)]"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col lg:flex-row lg:items-center lg:gap-16">

          {/* Left Column — Main Content */}
          <div className="flex-1 max-w-3xl">
            {/* Social Proof Bar — moved up */}
            <div className="mb-6 flex flex-wrap items-center gap-5">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-sm text-white/70">4.9 — 120+ ulasan</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-white/70">
                <Users className="h-4 w-4" />
                <span>500+ proyek sejak 2022</span>
              </div>
            </div>

            {/* Badge */}
            <span className="mb-5 inline-flex rounded-full border border-green-400/20 bg-green-400/10 px-4 py-2 text-sm font-semibold text-green-300 backdrop-blur">
              Jasa renovasi, cat & plafon — Kabupaten Tuban
            </span>

            {/* Headline — Now a Statement */}
            <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl xl:text-6xl">
              Renovasi Rumah di Tuban — 
              <span className="text-green-400"> Rapi, Jelas Biayanya, Tanpa Drama</span>
            </h1>

            {/* Subheadline — Tightened */}
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/75">
              500+ pemilik rumah di Tuban udah percayain cat, plafon, dan renovasi rumahnya ke Servisoo. 
              Konsultasi gratis lewat WhatsApp — kirim foto, kami analisa, kamu tau gambaran biaya tanpa drama.
            </p>

            {/* CTA Row */}
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Button variant="cta" size="xl" asChild>
                <a href="https://wa.me/6285808675233" target="_blank" rel="noopener noreferrer">
                  Konsultasi Gratis via WA
                  <MessageCircle className="ml-2 h-5 w-5" />
                </a>
              </Button>
              <Button variant="outline" size="xl" className="border-white/20 bg-white/5 text-white hover:bg-white hover:text-primary" asChild>
                <a href="#portfolio">Lihat Hasil Pekerjaan →</a>
              </Button>
            </div>

            {/* Low Friction Note */}
            <p className="mt-3 text-sm text-white/50">
              Bisa mulai dari kirim foto area rumah — nggak perlu janjian dulu.
            </p>

            {/* Trust Points — Simplified */}
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
              {trustPoints.map((point) => (
                <div key={point} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-400" />
                  <span className="text-sm leading-6 text-white/80">{point}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column — Trust Bar with Process */}
          <div className="mt-12 lg:mt-0 lg:w-[380px] shrink-0">
            <div className="rounded-[2rem] border border-white/10 bg-[#0f1f18]/90 p-6 shadow-2xl backdrop-blur-md">
              <h3 className="text-lg font-bold text-white mb-5">
                Cara Mulai — Selesai dalam 3 Langkah
              </h3>

              <div className="space-y-4">
                {[
                  {
                    step: "1",
                    title: "Kirim Foto",
                    desc: "Foto area yang mau dibenahi lewat WhatsApp — gratis, nggak ada kewajiban.",
                  },
                  {
                    step: "2",
                    title: "Dapat Estimasi",
                    desc: "Kami analisa dan kirim gambaran biaya + timeline pengerjaan.",
                  },
                  {
                    step: "3",
                    title: "Hasil Rapi",
                    desc: "Setuju? Kami kerja. Nggak setuju? Nggak masalah. Tanpa drama.",
                  },
                ].map((item) => (
                  <div key={item.step} className="flex gap-4 rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-400/20 text-sm font-bold text-green-300">
                      {item.step}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{item.title}</p>
                      <p className="mt-1 text-xs leading-6 text-white/60">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Stats Footer */}
              <div className="mt-5 grid grid-cols-3 gap-3 rounded-2xl bg-black/20 p-4 text-center">
                <div>
                  <div className="text-xl font-bold text-green-300">500+</div>
                  <div className="text-xs text-white/50">proyek selesai</div>
                </div>
                <div className="border-x border-white/10">
                  <div className="text-xl font-bold text-green-300">98%</div>
                  <div className="text-xs text-white/50">puas</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-green-300">1-3</div>
                  <div className="text-xs text-white/50">hari respon</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default HeroSection
