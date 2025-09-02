import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/enhanced-button"

// Mock gallery data - will be managed by admin later
const galleryItems = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&h=400&fit=crop",
    title: "Renovasi Rumah Modern",
    category: "Residensial",
    description: "Transformasi rumah klasik menjadi hunian modern minimalis"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1460472178825-e5240623afd5?w=600&h=400&fit=crop",
    title: "Gedung Perkantoran",
    category: "Komersial",
    description: "Pembangunan gedung perkantoran 5 lantai dengan desain kontemporer"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=400&fit=crop",
    title: "Renovasi Dapur Modern",
    category: "Interior",
    description: "Desain dapur terbuka dengan island counter dan pencahayaan optimal"
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&h=400&fit=crop",
    title: "Kamar Mandi Mewah",
    category: "Interior",
    description: "Renovasi kamar mandi dengan konsep spa minimalis"
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1448630360428-65456885c650?w=600&h=400&fit=crop",
    title: "Taman Rumah Modern",
    category: "Landscape",
    description: "Desain taman dengan konsep vertikal garden dan water feature"
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop",
    title: "Fasad Gedung Modern",
    category: "Komersial",
    description: "Renovasi fasad gedung dengan material composite panel"
  }
]

const GallerySection = () => {
  return (
    <section id="gallery" className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            Portofolio Proyek
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Lihat hasil karya terbaik kami dalam berbagai kategori renovasi dan konstruksi
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {galleryItems.map((item) => (
            <Card key={item.id} className="project-card overflow-hidden border-0 shadow-md">
              <div className="relative overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-64 object-cover transition-transform duration-300 hover:scale-110"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-medium">
                    {item.category}
                  </span>
                </div>
              </div>
              
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-primary mb-2">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {item.description}
                </p>
                <Button variant="ghost" className="p-0 h-auto text-accent hover:text-accent-dark">
                  Lihat Detail →
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-16">
          <Button variant="outline" size="lg">
            Lihat Semua Proyek
          </Button>
        </div>
      </div>
    </section>
  )
}

export default GallerySection