import LocalServiceLandingTemplate from "@/components/landing/LocalServiceLandingTemplate"

const JasaCatRumahTuban = () => {
  return (
    <LocalServiceLandingTemplate
      title="Jasa Cat Rumah Tuban | Servisoo"
      description="Cari jasa cat rumah di Tuban? Servisoo siap bantu pengecatan rumah interior dan eksterior dengan hasil lebih rapi, bersih, dan enak dilihat untuk area Kabupaten Tuban."
      canonical="https://www.servisoo.com/jasa-cat-rumah-tuban"
      serviceLabel="Jasa cat rumah Tuban"
      heroTitle="Jasa cat rumah di Tuban yang hasilnya lebih rapi dan tidak bikin rumah terasa dikerjakan asal-asalan"
      heroDescription="Servisoo membantu kebutuhan cat rumah di Kabupaten Tuban untuk rumah yang terlihat kusam, ingin tampilan lebih fresh, dan butuh hasil pengecatan yang lebih bersih serta enak dipandang."
      benefits={[
        "Fokus pada hasil cat yang rapi dan enak dilihat",
        "Cocok untuk rumah yang ingin terlihat lebih fresh",
        "Koordinasi kerja lebih jelas dari awal",
      ]}
      scopes={[
        "Pengecatan interior rumah agar ruangan terasa lebih bersih dan nyaman",
        "Pengecatan eksterior rumah untuk tampilan yang lebih proper",
        "Perapian finishing cat untuk rumah yang butuh sentuhan lebih rapi",
        "Kebutuhan cat rumah di Tuban untuk pemilik rumah yang tidak mau hasil berantakan",
        "Pengecatan rumah dengan proses yang lebih jelas dan enak diikuti",
        "Pembenahan tampilan rumah tanpa harus terasa seperti proyek besar yang melelahkan",
      ]}
      faqs={[
        {
          question: "Apakah Servisoo melayani jasa cat rumah di Tuban?",
          answer: "Ya. Servisoo melayani jasa cat rumah untuk area Kabupaten Tuban dan sekitarnya.",
        },
        {
          question: "Apakah bisa untuk cat rumah interior maupun eksterior?",
          answer: "Bisa. Kebutuhan pengecatan bisa disesuaikan dengan kondisi rumah dan area yang ingin dibenahi.",
        },
        {
          question: "Bagaimana cara mulai konsultasi cat rumah?",
          answer: "Anda bisa mulai dari kirim foto area rumah lewat WhatsApp, lalu kami bantu arahkan kebutuhan awalnya.",
        },
      ]}
    />
  )
}

export default JasaCatRumahTuban
