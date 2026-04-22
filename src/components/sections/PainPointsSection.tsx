import { AlertTriangle, ShieldCheck, TimerReset } from "lucide-react"

const painPoints = [
  {
    icon: AlertTriangle,
    title: "Takut hasil kerja asal jadi",
    description: "Banyak pemilik rumah trauma karena hasil tukang tidak rapi, detail finishing berantakan, dan ujungnya harus bongkar ulang.",
  },
  {
    icon: TimerReset,
    title: "Tidak punya waktu ngawasin",
    description: "Rumah perlu dibenahi, tapi tidak semua orang sempat mantengin proyek dari pagi sampai sore cuma buat memastikan kerjaan jalan benar.",
  },
  {
    icon: ShieldCheck,
    title: "Butuh partner yang bisa dipercaya",
    description: "Yang dicari bukan sekadar tukang datang lalu kerja, tapi tim yang komunikasinya jelas, prosesnya tertata, dan hasilnya enak dilihat.",
  },
]

const PainPointsSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <span className="inline-flex rounded-full bg-accent/10 px-4 py-2 text-sm font-semibold text-accent mb-4">
            Kenapa banyak orang masih ragu renovasi
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-primary mb-4">
            Masalahnya sering bukan cuma bangunan, tapi rasa was-was saat memilih yang mengerjakan
          </h2>
          <p className="text-lg text-muted-foreground">
            Servisoo harus tampil sebagai partner yang bikin customer merasa aman sejak awal, bukan sekadar jasa yang terdengar teknis.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {painPoints.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.title}
                className="rounded-3xl border border-border bg-secondary/40 p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-accent"
              >
                <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-semibold text-primary mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-7">{item.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default PainPointsSection
