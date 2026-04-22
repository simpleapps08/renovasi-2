import { MapPin, Paintbrush2, Home, Wrench } from "lucide-react"

const localServices = [
  {
    icon: Home,
    title: "Jasa renovasi rumah Tuban",
    description: "Untuk pemilik rumah di Kabupaten Tuban yang ingin membenahi area rumah dengan proses yang lebih jelas dan hasil yang rapi.",
    href: "/jasa-renovasi-rumah-tuban",
  },
  {
    icon: Paintbrush2,
    title: "Jasa cat rumah Tuban",
    description: "Cocok untuk rumah yang terlihat kusam, butuh tampilan lebih segar, dan ingin hasil pengecatan yang lebih bersih serta enak dilihat.",
    href: "/jasa-cat-rumah-tuban",
  },
  {
    icon: Wrench,
    title: "Jasa plafon Tuban",
    description: "Untuk area rumah yang butuh perapian plafon dan finishing agar ruangan terasa lebih proper, lebih nyaman, dan lebih tertata.",
    href: "/jasa-plafon-tuban",
  },
]

const TubanAreaSection = () => {
  return (
    <section className="py-24 bg-secondary/35">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mb-12">
          <span className="inline-flex rounded-full bg-accent/10 px-4 py-2 text-sm font-semibold text-accent mb-4">
            Area layanan lokal Servisoo
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-primary mb-4 leading-tight">
            Servisoo melayani jasa renovasi rumah, cat rumah, dan plafon untuk area Kabupaten Tuban
          </h2>
          <p className="text-lg text-muted-foreground leading-8 max-w-3xl">
            Kalau Anda sedang mencari jasa renovasi rumah di Tuban, jasa cat rumah Tuban, atau jasa plafon Tuban, Servisoo siap bantu dengan proses yang lebih jelas, komunikasi yang enak diikuti, dan hasil kerja yang fokus pada kerapian finishing.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {localServices.map((service) => {
            const Icon = service.icon
            return (
              <div key={service.title} className="rounded-[2rem] border border-border bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-accent">
                <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-semibold text-primary mb-3">{service.title}</h3>
                <p className="text-muted-foreground leading-7">{service.description}</p>
                <a href={service.href} className="mt-5 inline-flex text-sm font-semibold text-accent hover:text-accent-dark">
                  Lihat halaman layanan →
                </a>
              </div>
            )
          })}
        </div>

        <div className="mt-10 rounded-[2rem] bg-primary px-6 py-6 text-primary-foreground shadow-primary md:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-3 max-w-3xl">
              <MapPin className="mt-1 h-5 w-5 shrink-0 text-green-300" />
              <p className="text-sm leading-7 text-white/80">
                Basis operasional Servisoo berada di <strong className="text-white">Kabupaten Tuban, Jawa Timur</strong>. Jadi kalau Anda berada di area Tuban dan butuh renovasi rumah, cat rumah, atau plafon, kami bisa bantu arahkan kebutuhan Anda dengan lebih cepat.
              </p>
            </div>
            <a
              href="https://wa.me/6285808675233"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-xl bg-white px-5 py-3 text-sm font-semibold text-primary transition hover:bg-green-50"
            >
              Konsultasi Area Tuban
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TubanAreaSection
