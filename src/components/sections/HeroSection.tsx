import { Button } from "@/components/ui/enhanced-button"
import heroImage from "@/assets/hero-construction.jpg"
import { CheckCircle2, Clock3, FileText, MessageCircle, ShieldCheck } from "lucide-react"

const trustPoints = [
  "Estimasi jelas sebelum mulai",
  "Pengerjaan rapi dan bersih",
  "Cocok untuk cat, plafon, dan renovasi rumah",
  "Melayani area Kabupaten Tuban dan sekitarnya",
]

const proofItems = [
  {
    icon: Clock3,
    title: "Respon cepat",
    description: "Mulai dari konsultasi awal sampai penjadwalan survey, arahnya dibuat cepat dan jelas.",
  },
  {
    icon: FileText,
    title: "Estimasi lebih transparan",
    description: "Anda tidak dibiarkan menebak-nebak. Scope kerja dan gambaran biaya dibahas lebih terang.",
  },
  {
    icon: ShieldCheck,
    title: "Fokus hasil rapi",
    description: "Targetnya bukan cuma selesai, tapi rumah terasa lebih proper dan enak dilihat setelah dikerjakan.",
  },
]

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-primary text-primary-foreground">
      <div className="absolute inset-0 z-0">
        <img src={heroImage} alt="Servisoo home renovation service" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/72"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.28),transparent_30%)]"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-20 md:py-24 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="max-w-4xl">
            <span className="mb-5 inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-white/90 backdrop-blur">
              Home repair, painting, plafon, dan renovasi rumah
            </span>

            <h1 className="text-4xl font-bold leading-tight text-white md:text-6xl xl:text-7xl">
              Rumah kusam, plafon rusak, atau area rumah mulai bikin was-was? <span className="text-green-400">Kami bantu rapikan cepat dan jelas biayanya.</span>
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-white/80 md:text-xl">
              Servisoo bantu pemilik rumah yang ingin hasil rapi tanpa proses yang bikin capek. Cocok untuk pengecatan, plafon, dan renovasi rumah, dengan konsultasi awal, estimasi yang lebih transparan, dan pengerjaan yang tetap enak diajak koordinasi.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Button variant="cta" size="xl" asChild>
                <a href="https://wa.me/6285808675233" target="_blank" rel="noopener noreferrer">
                  Minta Survei & Estimasi
                  <MessageCircle className="ml-2 h-5 w-5" />
                </a>
              </Button>
              <Button variant="outline" size="xl" className="border-white/30 bg-white/5 text-white hover:bg-white hover:text-primary" asChild>
                <a href="#portfolio">Lihat Hasil Pekerjaan</a>
              </Button>
            </div>

            <p className="mt-4 text-sm text-white/65">
              Bisa mulai dari kirim foto area rumah yang ingin dibenahi lewat WhatsApp.
            </p>

            <div className="mt-10 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {trustPoints.map((point) => (
                <div key={point} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 backdrop-blur-sm">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-400" />
                  <span className="text-sm leading-6 text-white/85">{point}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-md lg:p-8">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-green-300">Mulai dari yang paling gampang</p>
                <h2 className="mt-2 text-2xl font-bold text-white">Kirim foto area rumah, lalu kami bantu arahkan langkah awalnya</h2>
              </div>
              <div className="rounded-2xl bg-green-400/15 px-4 py-2 text-sm font-semibold text-green-300">
                WhatsApp-first
              </div>
            </div>

            <div className="space-y-4">
              {proofItems.map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.title} className="rounded-3xl border border-white/10 bg-black/20 p-5">
                    <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-green-400/15 text-green-300">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-white/75">{item.description}</p>
                  </div>
                )
              })}
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3 text-center">
              <div className="rounded-2xl bg-black/20 px-3 py-4">
                <div className="text-2xl font-bold text-green-300">500+</div>
                <div className="mt-1 text-xs text-white/70">Proyek ditangani</div>
              </div>
              <div className="rounded-2xl bg-black/20 px-3 py-4">
                <div className="text-2xl font-bold text-green-300">98%</div>
                <div className="mt-1 text-xs text-white/70">Kepuasan klien</div>
              </div>
              <div className="rounded-2xl bg-black/20 px-3 py-4">
                <div className="text-2xl font-bold text-green-300">Jelas</div>
                <div className="mt-1 text-xs text-white/70">Arah kerjanya</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
