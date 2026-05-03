import { Button } from "@/components/ui/enhanced-button"
import { Card, CardContent } from "@/components/ui/card"
import { BadgeCheck, MessageCircle } from "lucide-react"

const CTASection = () => {
  return (
    <section id="konsultasi" className="py-20 bg-[linear-gradient(180deg,rgba(247,247,247,0.9)_0%,#ffffff_100%)]">
      <div className="container mx-auto px-4">
        <Card className="overflow-hidden rounded-[2rem] border border-border/60 shadow-xl gradient-card">
          <CardContent className="grid gap-8 p-8 md:p-12 lg:grid-cols-[1.1fr_0.9fr] lg:p-16">
            <div>
              <span className="inline-flex rounded-full bg-accent/10 px-4 py-2 text-sm font-semibold text-accent mb-5">
                Siap mulai?
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-5 leading-tight">
                Jangan tunggu masalah rumah makin besar. 
                <span className="text-accent"> Chat aja dulu, gratis.</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-8 mb-8 max-w-2xl">
                Kirim foto area yang mau dibenahi lewat WhatsApp. Kami analisa, kirim gambaran biaya — 
                tanpa kewajiban, tanpa drama.
              </p>

              <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
                <Button variant="cta" size="xl" asChild>
                  <a href="https://wa.me/6285808675233" target="_blank" rel="noopener noreferrer">
                    Konsultasi Gratis via WhatsApp
                    <MessageCircle className="ml-2 h-5 w-5" />
                  </a>
                </Button>
              </div>

              <p className="mt-3 text-sm text-muted-foreground">
                Cukup kirim foto. Gratis. 2 menit.
              </p>
            </div>

            <div className="rounded-[1.75rem] bg-primary p-8 text-primary-foreground shadow-primary">
              <h3 className="text-xl font-semibold mb-5">Kenapa mulai dari WhatsApp?</h3>
              <div className="space-y-3">
                {[
                  "Nggak perlu janjian — tinggal chat",
                  "Kirim foto langsung. Kami analisa langsung.",
                  "Tau gambaran biaya sebelum mutusin apa-apa",
                  "Nggak setuju? Nggak masalah. No hard feelings.",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-2xl bg-white/5 px-4 py-3">
                    <BadgeCheck className="mt-0.5 h-5 w-5 text-green-400 shrink-0" />
                    <p className="text-sm leading-6 text-white/80">{item}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm text-white/50">Mulai dari yang paling sederhana:</p>
                <p className="mt-2 text-sm leading-7 text-white/75 font-medium">
                  "Siang, mau tanya. Saya punya kamar ukuran 3x4, dindingnya udah kusam. Kira-kira budget cat ulang berapa ya?"
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

export default CTASection
