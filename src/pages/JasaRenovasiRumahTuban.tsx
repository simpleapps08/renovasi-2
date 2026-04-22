import LocalServiceLandingTemplate from "@/components/landing/LocalServiceLandingTemplate"

const JasaRenovasiRumahTuban = () => {
  return (
    <LocalServiceLandingTemplate
      title="Jasa Renovasi Rumah Tuban | Servisoo"
      description="Butuh jasa renovasi rumah di Tuban? Servisoo bantu renovasi rumah dengan proses jelas, pengerjaan rapi, dan konsultasi cepat via WhatsApp untuk area Kabupaten Tuban."
      canonical="https://www.servisoo.com/jasa-renovasi-rumah-tuban"
      serviceLabel="Jasa renovasi rumah Tuban"
      heroTitle="Jasa renovasi rumah di Tuban yang lebih rapi, jelas, dan enak diajak koordinasi"
      heroDescription="Servisoo membantu pemilik rumah di Kabupaten Tuban yang ingin membenahi rumah tanpa proses yang bikin capek. Cocok untuk renovasi ringan sampai finishing rumah, dengan arahan kerja yang lebih jelas dan hasil yang fokus pada kerapian."
      benefits={[
        "Estimasi lebih transparan sebelum mulai",
        "Proses koordinasi lebih jelas dan tidak muter",
        "Fokus pada hasil akhir yang enak dilihat",
      ]}
      scopes={[
        "Renovasi ringan area rumah yang sudah kusam atau butuh dibenahi",
        "Perapian finishing ruang agar rumah terasa lebih proper",
        "Perbaikan area rumah yang tampilannya mulai mengganggu kenyamanan",
        "Pembenahan rumah untuk pemilik rumah yang tidak mau ribet ngawasin terus",
        "Renovasi rumah di Tuban dengan pendekatan yang lebih rapi dan komunikatif",
        "Pengerjaan yang fokus ke hasil, bukan sekadar cepat selesai",
      ]}
      faqs={[
        {
          question: "Apakah Servisoo melayani renovasi rumah di Kabupaten Tuban?",
          answer: "Ya. Servisoo fokus melayani kebutuhan renovasi rumah untuk area Kabupaten Tuban dan sekitarnya.",
        },
        {
          question: "Kalau saya belum tahu scope renovasinya, apakah bisa konsultasi dulu?",
          answer: "Bisa. Anda bisa mulai dari cerita singkat atau kirim foto area rumah, lalu kami bantu arahkan langkah awal yang paling masuk akal.",
        },
        {
          question: "Apakah bisa untuk renovasi rumah yang tidak terlalu besar?",
          answer: "Bisa. Servisoo cocok untuk kebutuhan renovasi rumah ringan sampai pembenahan finishing yang butuh hasil lebih rapi.",
        },
      ]}
    />
  )
}

export default JasaRenovasiRumahTuban
