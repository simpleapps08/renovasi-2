import { Button } from "@/components/ui/enhanced-button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, BadgeCheck, MessageCircle, PhoneCall } from "lucide-react"

const CTASection = () => {
  return (
    <section id="konsultasi" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <Card className="overflow-hidden rounded-[2rem] border-0 shadow-xl gradient-card">
          <CardContent className="grid gap-8 p-8 md:p-12 lg:grid-cols-[1.1fr_0.9fr] lg:p-16">
            <div>
              <span className="inline-flex rounded-full bg-accent/10 px-4 py-2 text-sm font-semibold text-accent mb-5">
                Final CTA yang lebih proper untuk jasa rumah
              </span>
              <h2 className="text-3xl md:text-5xl font-bold text-primary mb-5 leading-tight">
                Jangan tunggu masalah rumah makin bikin capek. Ceritakan dulu, nanti Servisoo bantu analisa.
              </h2>
              <p className="text-lg text-muted-foreground leading-8 mb-8 max-w-2xl">
                Untuk tahap awal, landing page harus menurunkan risiko dan mengajak ngobrol. CTA terbaik bukan terasa memaksa deal, tapi terasa aman untuk mulai konsultasi.
              </p>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Button variant="cta" size="xl" asChild>
                  <a href="https://wa.me/6285808675233" target="_blank" rel="noopener noreferrer">
                    Konsultasi Gratis via WhatsApp
                    <MessageCircle className="ml-2 h-5 w-5" />
                  </a>
                </Button>
                <Button variant="outline" size="xl" asChild>
                  <a href="tel:+6282336548080">
                    Hubungi Sekarang
                    <PhoneCall className="ml-2 h-5 w-5" />
                  </a>
                </Button>
              </div>
            </div>

            <div className="rounded-[1.75rem] bg-primary p-8 text-primary-foreground">
              <h3 className="text-2xl font-semibold mb-6">Apa yang perlu langsung terasa di akhir landing page</h3>
              <div className="space-y-4">
                {[
                  "Bisa konsultasi dulu tanpa harus langsung deal",
                  "Lebih terasa aman karena komunikasi dibuat jelas",
                  "Fokus hasil rapi, bukan janji kosong yang kelewatan",
                  "Cocok untuk pemilik rumah yang tidak mau ribet",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-2xl bg-white/5 px-4 py-4">
                    <BadgeCheck className="mt-0.5 h-5 w-5 text-green-400 shrink-0" />
                    <p className="text-sm leading-7 text-white/80">{item}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm font-medium uppercase tracking-[0.18em] text-green-300">CTA logic</p>
                <p className="mt-3 text-sm leading-7 text-white/75">
                  Primary CTA diarahkan ke konsultasi WhatsApp. Itu paling masuk akal untuk jasa rumah yang butuh ngobrol, foto kondisi, dan penjelasan singkat sebelum lanjut.
                </p>
                <div className="mt-4 inline-flex items-center text-sm font-semibold text-green-300">
                  Conversion flow yang lebih natural <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

export default CTASection
