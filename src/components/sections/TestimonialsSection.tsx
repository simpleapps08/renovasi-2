import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Ibu Rina",
    role: "Pemilik rumah, Surabaya",
    quote: "Yang paling saya suka itu komunikasinya enak. Dari awal dijelaskan pelan-pelan, hasil cat juga rapi dan rumah tidak terasa seperti habis dikerjain asal-asalan.",
  },
  {
    name: "Pak Dimas",
    role: "Pemilik rumah, Sidoarjo",
    quote: "Biasanya saya malas urus renovasi kecil karena capek ngawasin. Di sini rasanya lebih tenang karena progres dan kebutuhannya jelas dari awal.",
  },
  {
    name: "Ibu Maya",
    role: "Pemilik rumah, Gresik",
    quote: "Servisoo terasa bukan seperti tukang biasa. Lebih rapi, lebih proper, dan hasil finishing-nya kelihatan niat.",
  },
]

const TestimonialsSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-flex rounded-full bg-accent/10 px-4 py-2 text-sm font-semibold text-accent mb-4">
            Bukti sosial yang bikin lebih yakin
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-primary mb-4">
            Orang tidak cukup diyakinkan dengan janji. Mereka butuh rasa percaya.
          </h2>
          <p className="text-lg text-muted-foreground leading-8">
            Section testimonial perlu hadir untuk menjawab kekhawatiran paling umum, apakah hasilnya rapi, apakah orangnya enak diajak komunikasi, dan apakah prosesnya bikin ribet atau tidak.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div key={testimonial.name} className="rounded-3xl border border-border bg-secondary/30 p-8 shadow-sm">
              <div className="flex gap-1 text-warning mb-5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-current" />
                ))}
              </div>
              <p className="text-lg leading-8 text-foreground mb-6">“{testimonial.quote}”</p>
              <div>
                <div className="font-semibold text-primary">{testimonial.name}</div>
                <div className="text-sm text-muted-foreground">{testimonial.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TestimonialsSection
