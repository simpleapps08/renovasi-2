import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "Servisoo cocok untuk pekerjaan apa saja?",
    answer: "Fokus utamanya untuk kebutuhan renovasi rumah, pengecatan, plafon, dan pekerjaan finishing yang menuntut hasil rapi dan enak dilihat.",
  },
  {
    question: "Kalau saya belum tahu scope pekerjaannya, apakah tetap bisa konsultasi?",
    answer: "Bisa. Banyak customer memang datang saat masih bingung harus mulai dari mana. Ceritakan dulu kebutuhannya, nanti kami bantu arahkan langkah awal yang paling masuk akal.",
  },
  {
    question: "Apakah harus langsung deal setelah konsultasi?",
    answer: "Tidak. Tujuan konsultasi awal adalah membantu Anda memahami kondisi rumah lebih dulu, lalu memutuskan langkah berikutnya dengan lebih tenang.",
  },
  {
    question: "Apa yang bikin Servisoo beda dari tukang biasa?",
    answer: "Kami fokus pada hasil finishing yang rapi, komunikasi yang jelas, proses yang lebih tertata, dan rasa aman selama pengerjaan. Itu yang paling sering dirasakan beda oleh customer kami.",
  },
  {
    question: "Apakah Servisoo melayani area Kabupaten Tuban?",
    answer: "Ya. Servisoo fokus melayani kebutuhan renovasi rumah, pengecatan, plafon, dan perbaikan rumah untuk area Kabupaten Tuban dan sekitarnya.",
  },
]

const FAQSection = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <span className="inline-flex rounded-full bg-accent/10 px-4 py-2 text-sm font-semibold text-accent mb-4">
              Pertanyaan yang sering ditanyakan
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-primary mb-4">
              Sering kali orang bukan langsung cari harga, tapi ingin tahu dulu apakah urusannya aman ditangani
            </h2>
            <p className="text-lg text-muted-foreground leading-8">
              Kalau masih ada yang mengganjal, mulai dari sini. Setelah itu Anda bisa lanjut konsultasi dengan gambaran yang lebih jelas.
            </p>
          </div>

          <div className="rounded-[2rem] bg-secondary/30 border border-border px-6 py-3 shadow-sm shadow-primary/5">
            <Accordion type="single" collapsible>
              {faqs.map((faq, index) => (
                <AccordionItem key={faq.question} value={`item-${index}`}>
                  <AccordionTrigger className="text-left text-lg text-primary hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-base leading-7 text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FAQSection
