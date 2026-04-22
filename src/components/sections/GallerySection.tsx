import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/enhanced-button"

const galleryItems = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80",
    title: "Pengecatan rumah tinggal",
    category: "Finishing rapi",
    description: "Pengecatan rumah yang fokus pada hasil akhir yang lebih bersih, lebih segar, dan enak dilihat setiap hari.",
    result: "Rumah terasa lebih fresh dan proper"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1575517111839-3a3843ee7f1d?w=1200&q=80",
    title: "Area plafon dan interior",
    category: "Plafon",
    description: "Perapian plafon dan area interior untuk membuat ruangan terasa lebih nyaman, lebih terang, dan lebih tertata.",
    result: "Area dalam rumah lebih rapi dan nyaman"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&q=80",
    title: "Renovasi finishing ruang",
    category: "Renovasi ringan",
    description: "Cocok untuk area rumah yang perlu dibenahi tampilannya tanpa harus terasa seperti proyek besar yang melelahkan.",
    result: "Tampilan ruangan lebih enak dilihat"
  }
]

const GallerySection = () => {
  return (
    <section id="portfolio" className="py-24 bg-secondary/35">
      <div className="container mx-auto px-4">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-end mb-12">
          <div>
            <span className="inline-flex rounded-full bg-accent/10 px-4 py-2 text-sm font-semibold text-accent mb-4">
              Beberapa contoh hasil pekerjaan
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-primary mb-4">
              Untuk urusan rumah, bukti visual jauh lebih meyakinkan daripada janji manis
            </h2>
          </div>
          <p className="text-lg text-muted-foreground leading-8">
            Kami ingin Anda bisa langsung membayangkan hasil akhirnya. Karena itu, contoh pekerjaan yang ditampilkan dibuat dekat dengan kebutuhan rumah tinggal, bukan sekadar proyek yang kelihatan besar tapi terasa jauh dari kebutuhan sehari-hari.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {galleryItems.map((item, index) => (
            <Card key={item.id} className={`overflow-hidden rounded-[2rem] border border-border shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${index === 0 ? 'lg:col-span-2' : ''}`}>
              <div className={`relative overflow-hidden ${index === 0 ? 'lg:grid lg:grid-cols-[1.15fr_0.85fr]' : ''}`}>
                <img src={item.image} alt={item.title} className={`w-full object-cover transition-transform duration-500 hover:scale-105 ${index === 0 ? 'h-full min-h-[320px]' : 'h-72'}`} />
                <div className="absolute left-5 top-5 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold text-primary shadow-sm">
                  {item.category}
                </div>

                <CardContent className={`p-6 ${index === 0 ? 'flex flex-col justify-center lg:p-8' : ''}`}>
                  <h3 className="text-2xl font-semibold text-primary mb-3">{item.title}</h3>
                  <p className="text-sm leading-7 text-muted-foreground mb-5">{item.description}</p>
                  <div className="rounded-2xl bg-white px-4 py-4 text-sm font-medium text-primary shadow-sm">
                    Hasil utama: <span className="text-accent">{item.result}</span>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center gap-4 text-center">
          <p className="max-w-2xl text-muted-foreground">
            Punya area rumah yang kondisinya mirip? Ceritakan dulu kebutuhannya, nanti kami bantu arahkan solusi yang paling masuk akal.
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
