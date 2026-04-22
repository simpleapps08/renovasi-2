import { ClipboardList, MessagesSquare, Paintbrush, Shield } from "lucide-react"

const reasons = [
  {
    icon: Paintbrush,
    title: "Fokus pada hasil rapi dan finishing",
    description: "Bukan cuma selesai. Detail akhir harus enak dilihat, presisi, dan terasa lebih proper dari tukang biasa.",
  },
  {
    icon: MessagesSquare,
    title: "Komunikasi jelas, tidak bikin bingung",
    description: "Customer butuh kepastian, bukan jawaban muter. Alur kerja, kebutuhan, dan progres harus mudah dipahami.",
  },
  {
    icon: ClipboardList,
    title: "Proses lebih tertata",
    description: "Mulai dari cek kebutuhan, estimasi, sampai pengerjaan, semuanya dibuat lebih rapi supaya customer tidak ribet mengawal.",
  },
  {
    icon: Shield,
    title: "Lebih terasa aman dan profesional",
    description: "Cocok untuk Anda yang ingin urusan rumah ditangani dengan lebih serius, lebih rapi, dan lebih bisa diandalkan.",
  },
]

const WhyChooseSection = () => {
  return (
    <section id="keunggulan" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <span className="inline-flex rounded-full bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold mb-5">
              Kenapa banyak homeowner lebih tenang dengan Servisoo
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-primary mb-5 leading-tight">
              Bukan sekadar cari tukang, Anda butuh partner kerja yang rapi dan enak diajak komunikasi
            </h2>
            <p className="text-lg text-muted-foreground leading-8">
              Kami bantu urusan rumah terasa lebih ringan lewat proses yang jelas, hasil yang lebih rapi, dan komunikasi yang tidak bikin Anda menebak-nebak.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {reasons.map((reason) => {
              const Icon = reason.icon
              return (
                <div key={reason.title} className="rounded-3xl bg-white border border-border p-7 shadow-sm hover:shadow-accent transition-all duration-300">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-primary mb-2">{reason.title}</h3>
                  <p className="text-muted-foreground leading-7 text-sm">{reason.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

export default WhyChooseSection
