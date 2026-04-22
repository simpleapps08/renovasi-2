import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "Servisoo cocok untuk pekerjaan apa saja?",
    answer: "Fokus utamanya untuk kebutuhan renovasi rumah, pengecatan, plafon, dan pekerjaan finishing yang menuntut hasil rapi dan enak dilihat.",
  },
  {
    question: "Kalau saya belum tahu scope pekerjaannya, apakah tetap bisa konsultasi?",
    answer: "Bisa. Justru banyak customer datang dalam kondisi belum yakin harus mulai dari mana. Landing page perlu mendorong konsultasi awal, bukan memaksa orang sudah siap penuh dulu.",
  },
  {
    question: "Apakah harus langsung deal setelah konsultasi?",
    answer: "Tidak. CTA sebaiknya terasa ringan dan aman. Fokusnya adalah membantu orang memahami kondisi rumahnya lebih dulu, lalu memutuskan langkah berikutnya dengan lebih tenang.",
  },
  {
    question: "Apa yang bikin Servisoo beda dari tukang biasa?",
    answer: "Servisoo perlu menekankan kualitas finishing, komunikasi yang jelas, proses yang tertata, dan rasa aman selama pengerjaan. Itu pembeda utamanya.",
  },
]

const FAQSection = () => {
  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <span className="inline-flex rounded-full bg-accent/10 px-4 py-2 text-sm font-semibold text-accent mb-4">
              FAQ yang menjawab keraguan utama
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-primary mb-4">
              Orang belum tentu butuh harga dulu. Kadang mereka cuma ingin diyakinkan bahwa urusannya aman.
            </h2>
            <p className="text-lg text-muted-foreground leading-8">
              FAQ di landing page ini bukan tempelan. Fungsinya untuk menurunkan keraguan sebelum orang klik WhatsApp atau minta konsultasi.
            </p>
          </div>

          <div className="rounded-3xl bg-white border border-border px-6 py-3 shadow-sm">
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
