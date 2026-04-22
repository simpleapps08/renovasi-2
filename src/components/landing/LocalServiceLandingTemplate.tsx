import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import RouteSEO from "@/components/seo/RouteSEO"
import { Button } from "@/components/ui/enhanced-button"
import { CheckCircle2, MapPin } from "lucide-react"

interface FAQItem {
  question: string
  answer: string
}

interface LocalServiceLandingTemplateProps {
  title: string
  description: string
  canonical: string
  heroTitle: string
  heroDescription: string
  serviceLabel: string
  benefits: string[]
  scopes: string[]
  faqs: FAQItem[]
}

const LocalServiceLandingTemplate = ({
  title,
  description,
  canonical,
  heroTitle,
  heroDescription,
  serviceLabel,
  benefits,
  scopes,
  faqs,
}: LocalServiceLandingTemplateProps) => {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: title,
    description,
    areaServed: {
      '@type': 'AdministrativeArea',
      name: 'Kabupaten Tuban',
    },
    provider: {
      '@type': 'GeneralContractor',
      name: 'Servisoo',
      url: 'https://www.servisoo.com/',
      telephone: '+62 823-3654-8080',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Jl. Pahlawan Gang Selorejo 2, No. 248 B',
        addressLocality: 'Tuban',
        addressRegion: 'Jawa Timur',
        postalCode: '62318',
        addressCountry: 'ID',
      },
    },
    serviceType: serviceLabel,
    url: canonical,
  }

  return (
    <>
      <RouteSEO title={title} description={description} canonical={canonical} jsonLd={jsonLd} />
      <Header />
      <main>
        <section className="bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 py-20 md:py-24">
            <span className="inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-white/90">
              {serviceLabel}
            </span>
            <div className="mt-6 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="max-w-4xl">
                <h1 className="text-4xl font-bold leading-tight text-white md:text-6xl">
                  {heroTitle}
                </h1>
                <p className="mt-6 max-w-3xl text-lg leading-8 text-white/80 md:text-xl">
                  {heroDescription}
                </p>
                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                  <Button variant="cta" size="xl" asChild>
                    <a href="https://wa.me/6285808675233" target="_blank" rel="noopener noreferrer">
                      Konsultasi via WhatsApp
                    </a>
                  </Button>
                  <Button variant="outline" size="xl" className="border-white/30 bg-white/5 text-white hover:bg-white hover:text-primary" asChild>
                    <a href="/">Kembali ke Homepage</a>
                  </Button>
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-white/10 p-6 backdrop-blur-md">
                <div className="mb-5 flex items-start gap-3">
                  <MapPin className="mt-1 h-5 w-5 shrink-0 text-green-300" />
                  <p className="text-sm leading-7 text-white/80">
                    Servisoo melayani kebutuhan {serviceLabel.toLowerCase()} untuk area <strong className="text-white">Kabupaten Tuban</strong> dan sekitarnya.
                  </p>
                </div>
                <div className="space-y-3">
                  {benefits.map((item) => (
                    <div key={item} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-4">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-300" />
                      <span className="text-sm leading-6 text-white/85">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="layanan" className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mb-10">
              <h2 className="text-3xl md:text-5xl font-bold text-primary mb-4">
                Cocok untuk kebutuhan seperti ini
              </h2>
              <p className="text-lg text-muted-foreground leading-8">
                Servisoo membantu pemilik rumah di Tuban yang ingin hasil rapi, proses lebih jelas, dan tidak mau ribet menghadapi pengerjaan yang berantakan.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {scopes.map((scope) => (
                <div key={scope} className="rounded-[2rem] border border-border bg-secondary/25 p-6 shadow-sm">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-accent" />
                    <p className="text-base leading-7 text-foreground">{scope}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="py-24 bg-secondary/35">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mb-10">
              <h2 className="text-3xl md:text-5xl font-bold text-primary mb-4">
                Pertanyaan yang sering ditanyakan
              </h2>
            </div>
            <div className="grid gap-5">
              {faqs.map((faq) => (
                <div key={faq.question} className="rounded-[2rem] border border-border bg-white p-6 shadow-sm">
                  <h3 className="text-xl font-semibold text-primary mb-3">{faq.question}</h3>
                  <p className="text-muted-foreground leading-7">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="konsultasi" className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="rounded-[2rem] bg-primary p-8 text-primary-foreground shadow-primary md:p-12">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                Butuh {serviceLabel.toLowerCase()}? Ceritakan dulu kebutuhan Anda.
              </h2>
              <p className="max-w-3xl text-lg leading-8 text-white/80 mb-8">
                Anda bisa mulai dari kirim foto area rumah lewat WhatsApp. Dari situ Servisoo bantu arahkan langkah awal yang paling masuk akal.
              </p>
              <Button variant="cta" size="xl" asChild>
                <a href="https://wa.me/6285808675233" target="_blank" rel="noopener noreferrer">
                  Chat WhatsApp Sekarang
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

export default LocalServiceLandingTemplate
