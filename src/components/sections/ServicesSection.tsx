import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/enhanced-button"

const services = [
  {
    title: "Renovasi Rumah",
    description: "Renovasi total atau parsial rumah tinggal dengan desain modern dan fungsional",
    features: ["Desain Interior", "Renovasi Kamar Mandi", "Renovasi Dapur", "Renovasi Taman"],
    icon: "🏠"
  },
  {
    title: "Pembangunan Gedung",
    description: "Konstruksi gedung komersial dan perkantoran dengan standar internasional",
    features: ["Gedung Perkantoran", "Ruko & Toko", "Warehouse", "Fasilitas Umum"],
    icon: "🏢"
  },
  {
    title: "Desain & Perencanaan",
    description: "Layanan arsitektur dan perencanaan dengan teknologi BIM terkini",
    features: ["Desain Arsitektur", "Gambar Teknik", "3D Visualization", "IMB & Perizinan"],
    icon: "📐"
  },
  {
    title: "Konsultasi RAB",
    description: "Estimasi biaya yang akurat dan transparan untuk semua jenis proyek",
    features: ["Analisa Harga", "BOQ Detail", "Time Schedule", "Risk Assessment"],
    icon: "💰"
  }
]

const ServicesSection = () => {
  return (
    <section id="services" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            Layanan Kami
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Solusi lengkap untuk kebutuhan renovasi dan konstruksi Anda dengan teknologi terdepan
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="service-card h-full">
              <CardHeader className="text-center pb-4">
                <div className="text-5xl mb-4">{service.icon}</div>
                <CardTitle className="text-xl mb-2">{service.title}</CardTitle>
                <CardDescription className="text-muted-foreground">
                  {service.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-0">
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-accent rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <Button variant="service" className="w-full">
                  Pelajari Lebih Lanjut
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-16">
          <Button variant="cta" size="xl">
            Mulai Konsultasi Gratis
          </Button>
        </div>
      </div>
    </section>
  )
}

export default ServicesSection