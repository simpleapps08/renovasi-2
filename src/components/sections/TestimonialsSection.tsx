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
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-flex rounded-full bg-accent/10 px-4 py-2 text-sm font-semibold text-accent mb-4">
            Testimoni dari homeowner
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-primary mb-4">
            Hasil yang rapi memang penting, tapi rasa tenang selama proses juga tidak kalah penting
          </h2>
          <p className="text-lg text-muted-foreground leading-8">
            Banyak customer akhirnya lanjut bukan cuma karena butuh diperbaiki, tapi karena merasa lebih nyaman dengan cara kami menjelaskan dan mengerjakan.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div key={testimonial.name} className={`rounded-[2rem] border p-8 shadow-sm ${index === 1 ? 'border-accent/30 bg-primary text-primary-foreground shadow-accent' : 'border-border bg-secondary/30'}`}>
              <div className={`flex gap-1 mb-5 ${index === 1 ? 'text-green-300' : 'text-warning'}`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-current" />
                ))}
              </div>
              <p className={`text-lg leading-8 mb-6 ${index === 1 ? 'text-white' : 'text-foreground'}`}>“{testimonial.quote}”</p>
              <div>
                <div className={`font-semibold ${index === 1 ? 'text-white' : 'text-primary'}`}>{testimonial.name}</div>
                <div className={`text-sm ${index === 1 ? 'text-white/65' : 'text-muted-foreground'}`}>{testimonial.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TestimonialsSection
