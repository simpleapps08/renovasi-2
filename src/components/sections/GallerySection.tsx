import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/enhanced-button"

const galleryItems = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80",
    title: "Pengecatan rumah tinggal",
    category: "Finishing rapi",
    description: "Untuk calon customer, tampilan seperti ini lebih relevan karena menunjukkan rumah tinggal yang memang dekat dengan kebutuhan mereka.",
    result: "Rumah terasa lebih fresh dan proper"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1575517111839-3a3843ee7f1d?w=1200&q=80",
    title: "Area plafon dan interior",
    category: "Plafon",
    description: "Visual pekerjaan rumah jauh lebih menjual daripada terlalu banyak foto proyek yang terasa komersial atau terlalu luas skopnya.",
    result: "Area dalam rumah lebih rapi dan nyaman"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&q=80",
    title: "Renovasi finishing ruang",
    category: "Renovasi ringan",
    description: "Gunakan portofolio yang berbicara soal rasa aman dan hasil akhir, bukan sekadar pamer proyek besar supaya kelihatan keren.",
    result: "Tampilan ruangan lebih enak dilihat"
  }
]

const GallerySection = () => {
  return (
    <section id="portfolio" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-end mb-12">
          <div>
            <span className="inline-flex rounded-full bg-accent/10 px-4 py-2 text-sm font-semibold text-accent mb-4">
              Portofolio yang lebih meyakinkan
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-primary mb-4">
              Untuk jasa rumah, bukti visual jauh lebih kuat daripada klaim manis yang kebanyakan
            </h2>
          </div>
          <p className="text-lg text-muted-foreground leading-8">
            Section portofolio sebaiknya menampilkan pekerjaan yang dekat dengan kebutuhan homeowner, lengkap dengan hasil akhir yang rapi dan manfaat yang terasa. Kalau bisa nanti ditambah before-after dan testimoni per proyek, itu akan lebih gila konversinya.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {galleryItems.map((item) => (
            <Card key={item.id} className="overflow-hidden rounded-[2rem] border border-border shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="relative overflow-hidden">
                <img src={item.image} alt={item.title} className="h-72 w-full object-cover transition-transform duration-500 hover:scale-105" />
                <div className="absolute left-5 top-5 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold text-primary shadow-sm">
                  {item.category}
                </div>
              </div>

              <CardContent className="p-6">
                <h3 className="text-2xl font-semibold text-primary mb-3">{item.title}</h3>
                <p className="text-sm leading-7 text-muted-foreground mb-5">{item.description}</p>
                <div className="rounded-2xl bg-secondary/40 px-4 py-4 text-sm font-medium text-primary">
                  Hasil yang dijual: <span className="text-accent">{item.result}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center gap-4 text-center">
          <p className="max-w-2xl text-muted-foreground">
            Setelah ini, section ini idealnya dikembangkan lagi dengan before-after, lokasi proyek, dan testimoni singkat biar trust makin tebal.
          </p>
          <Button variant="outline" size="lg" asChild>
            <a href="https://wa.me/6285808675233" target="_blank" rel="noopener noreferrer">Minta contoh pekerjaan yang relevan</a>
          </Button>
        </div>
      </div>
    </section>
  )
}

export default GallerySection
