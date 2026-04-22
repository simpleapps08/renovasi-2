import { ClipboardCheck, Hammer, MessageCircleMore, SearchCheck } from "lucide-react"

const steps = [
  {
    icon: MessageCircleMore,
    title: "Cerita masalah rumah Anda",
    description: "Mulai dari keluhan yang paling terasa. Tim Servisoo bantu dengarkan dan arahkan, bukan langsung asal jual.",
  },
  {
    icon: SearchCheck,
    title: "Analisa kebutuhan dan estimasi",
    description: "Kami bantu cek kebutuhan pekerjaan, ruang lingkup, dan estimasi awal supaya semuanya lebih jelas sejak awal.",
  },
  {
    icon: Hammer,
    title: "Pengerjaan yang rapi dan terarah",
    description: "Tim fokus ke kualitas finishing, kerapian area kerja, dan hasil yang enak dilihat, bukan cuma cepat selesai.",
  },
  {
    icon: ClipboardCheck,
    title: "Final check dan serah terima",
    description: "Sebelum selesai, pekerjaan dicek lagi supaya hasil akhir benar-benar sesuai ekspektasi dan tidak bikin bolak-balik.",
  },
]

const ProcessSection = () => {
  return (
    <section id="proses" className="py-20 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mb-12">
          <span className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white mb-5">
            Proses yang dibuat gampang diikuti
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-5">
            Customer tidak harus jadi mandor dulu untuk dapat hasil yang rapi
          </h2>
          <p className="text-lg text-white/75 leading-8">
            Landing page perlu menunjukkan bahwa Servisoo punya alur kerja yang tertata. Ini yang bikin orang merasa lebih aman untuk mulai konsultasi.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div key={step.title} className="rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur-sm">
                <div className="mb-5 flex items-center justify-between">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/20 text-accent">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-sm font-semibold text-white/50">0{index + 1}</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-sm leading-7 text-white/75">{step.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default ProcessSection
