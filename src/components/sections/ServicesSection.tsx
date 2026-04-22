import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/enhanced-button"
import { ArrowRight, Home, Paintbrush2, Wrench } from "lucide-react"

const services = [
  {
    title: "Pengecatan rumah",
    description: "Interior maupun eksterior dengan fokus pada hasil yang bersih, rata, dan enak dilihat.",
    features: ["Finishing lebih rapi", "Pilihan warna lebih terarah", "Cocok untuk rumah yang ingin terlihat fresh"],
    icon: Paintbrush2,
  },
  {
    title: "Pemasangan plafon",
    description: "Bantu benahi tampilan ruang agar terasa lebih proper, rapi, dan nyaman dipakai sehari-hari.",
    features: ["Plafon gypsum atau area sejenis", "Lebih rapi secara visual", "Pengerjaan lebih tertata"],
    icon: Wrench,
  },
  {
    title: "Renovasi finishing rumah",
    description: "Untuk area rumah yang perlu dibenahi tampilannya tanpa harus terasa seperti proyek besar yang melelahkan.",
    features: ["Fokus pada estetika dan fungsi", "Scope kerja lebih jelas", "Lebih nyaman untuk homeowner sibuk"],
    icon: Home,
  },
]

const ServicesSection = () => {
  return (
    <section id="layanan" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mb-12">
          <span className="inline-flex rounded-full bg-accent/10 px-4 py-2 text-sm font-semibold text-accent mb-4">
            Layanan utama yang harus lebih menonjol
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-primary mb-4">
            Landing page harus bicara soal kebutuhan rumah yang nyata, bukan terlalu sibuk jual fitur sampingan
          </h2>
          <p className="text-lg text-muted-foreground leading-8">
            Fokus utama diarahkan ke layanan yang paling dekat dengan rasa sakit customer. Toko, AI, atau fitur tambahan sebaiknya jadi pendukung, bukan pemeran utama.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = service.icon
            return (
              <Card key={service.title} className="h-full rounded-[2rem] border border-border bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-accent">
                <CardHeader className="pb-4">
                  <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                    <Icon className="h-7 w-7" />
                  </div>
                  <CardTitle className="text-2xl text-primary">{service.title}</CardTitle>
                </CardHeader>

                <CardContent>
                  <p className="text-muted-foreground leading-7 mb-6">{service.description}</p>
                  <ul className="space-y-3 mb-8">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-sm text-foreground">
                        <span className="mt-2 h-2 w-2 rounded-full bg-accent shrink-0"></span>
                        <span className="leading-6">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button variant="service" className="w-full justify-between rounded-xl border border-accent/15 bg-secondary/40 px-5 py-6 text-left text-primary hover:bg-accent hover:text-white" asChild>
                    <a href="https://wa.me/6285808675233" target="_blank" rel="noopener noreferrer">
                      Konsultasikan kebutuhan ini
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default ServicesSection
