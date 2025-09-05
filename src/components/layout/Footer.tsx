import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { supabase } from "@/integrations/supabase/client"

interface SocialMediaLink {
  id: string
  platform: string
  name: string
  url: string
  icon: string
  display_order: number
}

interface ContactInfo {
  id: string
  type: string
  label: string
  value: string
  formatted_value: string | null
}

interface FooterContent {
  id: string
  section: string
  content: string
}

const Footer = () => {
  const [socialLinks, setSocialLinks] = useState<SocialMediaLink[]>([])
  const [contactInfo, setContactInfo] = useState<ContactInfo[]>([])
  const [footerContent, setFooterContent] = useState<FooterContent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFooterData()
  }, [])

  const fetchFooterData = async () => {
    try {
      // Fetch social media links
      const { data: socialData, error: socialError } = await supabase
        .from('social_media_links')
        .select('*')
        .eq('is_active', true)
        .order('display_order')

      // Fetch contact info
      const { data: contactData, error: contactError } = await supabase
        .from('contact_info')
        .select('*')
        .eq('is_active', true)

      // Fetch footer content
      const { data: contentData, error: contentError } = await supabase
        .from('footer_content')
        .select('*')
        .eq('is_active', true)

      // Use fallback data if tables don't exist yet
      if (socialError || !socialData) {
        setSocialLinks([
          { id: '1', platform: 'instagram', name: 'Instagram', url: 'https://www.instagram.com/servisoo.official/', icon: 'instagram', display_order: 1 },
          { id: '2', platform: 'facebook', name: 'Facebook', url: 'https://www.facebook.com/servisoo.official', icon: 'facebook', display_order: 2 },
          { id: '3', platform: 'tiktok', name: 'TikTok', url: 'https://www.tiktok.com/@servisoo.official', icon: 'tiktok', display_order: 3 },
          { id: '4', platform: 'x', name: 'Twitter/X', url: 'https://x.com/servisoo', icon: 'x', display_order: 4 },
          { id: '5', platform: 'youtube', name: 'YouTube', url: '#', icon: 'youtube', display_order: 5 }
        ])
      } else {
        setSocialLinks(socialData)
      }

      if (contactError || !contactData) {
        setContactInfo([
          { id: '1', type: 'email', label: 'Email', value: 'servisoo.dev@gmail.com', formatted_value: null },
          { id: '2', type: 'phone', label: 'Phone', value: '+6282336548080', formatted_value: '+62 823-3654-8080' },
          { id: '3', type: 'whatsapp', label: 'WhatsApp', value: '+6285808675233', formatted_value: '+62 858-0867-5233' },
          { id: '4', type: 'address', label: 'Alamat', value: 'Jl. Pahlawan Gang Selorejo 2, No. 248 B, Kabupaten Tuban, Jawa Timur 62318', formatted_value: null }
        ])
      } else {
        setContactInfo(contactData)
      }

      if (contentError || !contentData) {
        setFooterContent([
          { id: '1', section: 'description', content: 'Servisoo adalah platform terpercaya untuk layanan renovasi dan pembangunan. Kami menghubungkan Anda dengan kontraktor profesional untuk mewujudkan rumah impian Anda.' },
          { id: '2', section: 'services', content: 'Renovasi Rumah,Pembangunan Gedung,Desain & Perencanaan,Konsultasi RAB' }
        ])
      } else {
        setFooterContent(contentData)
      }
    } catch (error) {
      console.error('Error fetching footer data:', error)
      // Set fallback data on error
      setSocialLinks([
        { id: '1', platform: 'instagram', name: 'Instagram', url: 'https://www.instagram.com/servisoo.official/', icon: 'instagram', display_order: 1 },
        { id: '2', platform: 'facebook', name: 'Facebook', url: 'https://www.facebook.com/servisoo.official', icon: 'facebook', display_order: 2 },
        { id: '3', platform: 'tiktok', name: 'TikTok', url: 'https://www.tiktok.com/@servisoo.official', icon: 'tiktok', display_order: 3 },
        { id: '4', platform: 'x', name: 'Twitter/X', url: 'https://x.com/servisoo', icon: 'x', display_order: 4 },
        { id: '5', platform: 'youtube', name: 'YouTube', url: '#', icon: 'youtube', display_order: 5 }
      ])
      setContactInfo([
        { id: '1', type: 'email', label: 'Email', value: 'servisoo.dev@gmail.com', formatted_value: null },
        { id: '2', type: 'phone', label: 'Phone', value: '+6282336548080', formatted_value: '+62 823-3654-8080' },
        { id: '3', type: 'whatsapp', label: 'WhatsApp', value: '+6285808675233', formatted_value: '+62 858-0867-5233' },
        { id: '4', type: 'address', label: 'Alamat', value: 'Jl. Pahlawan Gang Selorejo 2, No. 248 B, Kabupaten Tuban, Jawa Timur 62318', formatted_value: null }
      ])
      setFooterContent([
        { id: '1', section: 'description', content: 'Servisoo adalah platform terpercaya untuk layanan renovasi dan pembangunan. Kami menghubungkan Anda dengan kontraktor profesional untuk mewujudkan rumah impian Anda.' },
        { id: '2', section: 'services', content: 'Renovasi Rumah,Pembangunan Gedung,Desain & Perencanaan,Konsultasi RAB' }
      ])
    } finally {
      setLoading(false)
    }
  }

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        )
      case 'facebook':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        )
      case 'tiktok':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
          </svg>
        )
      case 'youtube':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        )
      case 'twitter':
      case 'x':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        )
      default:
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.374 0 0 5.373 0 12s5.374 12 12 12 12-5.373 12-12S18.626 0 12 0zm5.568 8.16c-.169 1.858-.896 3.433-2.188 4.72C13.882 14.16 12.01 15 10 15c-3.314 0-6-2.686-6-6s2.686-6 6-6c1.657 0 3.155.67 4.243 1.757l-1.414 1.414C12.146 5.488 11.137 5 10 5c-2.209 0-4 1.791-4 4s1.791 4 4 4c1.104 0 2.104-.448 2.829-1.171.451-.45.771-1.019.894-1.659H10V8.16h5.568z"/>
          </svg>
        )
    }
  }

  const formatPhoneLink = (type: string, value: string) => {
    if (type === 'whatsapp') {
      // Remove all non-numeric characters and format for WhatsApp
      const cleanNumber = value.replace(/\D/g, '')
      return `https://wa.me/${cleanNumber}`
    } else if (type === 'phone') {
      // Format for tel: link
      return `tel:${value}`
    }
    return '#'
  }

  const getContactValue = (type: string) => {
    const contact = contactInfo.find(c => c.type === type)
    return contact ? (contact.formatted_value || contact.value) : ''
  }

  const getContactLink = (type: string) => {
    const contact = contactInfo.find(c => c.type === type)
    return contact ? formatPhoneLink(type, contact.value) : '#'
  }

  const getFooterDescription = () => {
    const description = footerContent.find(c => c.section === 'description')
    return description ? description.content : 'Platform digital terdepan untuk renovasi rumah dan gedung. Dapatkan estimasi biaya yang akurat dan transparan untuk proyek impian Anda.'
  }

  const getServices = () => {
    const services = footerContent.find(c => c.section === 'services')
    if (services) {
      try {
        return JSON.parse(services.content)
      } catch {
        return ['Renovasi Rumah', 'Pembangunan Gedung', 'Desain & Perencanaan', 'Konsultasi RAB']
      }
    }
    return ['Renovasi Rumah', 'Pembangunan Gedung', 'Desain & Perencanaan', 'Konsultasi RAB']
  }

  if (loading) {
    return (
      <footer className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <p className="text-primary-foreground/60">Memuat...</p>
          </div>
        </div>
      </footer>
    )
  }

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center mb-4">
              <img src="/logo.svg" alt="Servisoo Logo" className="h-12" />
            </div>
            <p className="text-primary-foreground/80 mb-6 max-w-md">
              {getFooterDescription()}
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a 
                  key={social.id}
                  href={social.url} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center hover:bg-accent transition-colors"
                  title={social.name}
                >
                  {getSocialIcon(social.platform)}
                </a>
              ))}
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Layanan</h3>
            <ul className="space-y-2">
              {getServices().map((service, index) => (
                <li key={index}>
                  <Link to="#" className="text-primary-foreground/80 hover:text-accent transition-colors">
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Kontak</h3>
            <ul className="space-y-2">
              {contactInfo.filter(c => c.type === 'email').map((contact) => (
                <li key={contact.id} className="text-primary-foreground/80">
                  <strong>Email:</strong>{' '}
                  <a 
                    href={`mailto:${contact.value}`}
                    className="hover:text-accent transition-colors"
                  >
                    {contact.value}
                  </a>
                </li>
              ))}
              {contactInfo.filter(c => c.type === 'phone').map((contact) => (
                <li key={contact.id} className="text-primary-foreground/80">
                  <strong>Phone:</strong>{' '}
                  <a 
                    href={getContactLink('phone')}
                    className="hover:text-accent transition-colors"
                  >
                    {getContactValue('phone')}
                  </a>
                </li>
              ))}
              {contactInfo.filter(c => c.type === 'whatsapp').map((contact) => (
                <li key={contact.id} className="text-primary-foreground/80">
                  <strong>WhatsApp:</strong>{' '}
                  <a 
                    href={getContactLink('whatsapp')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-accent transition-colors"
                  >
                    {getContactValue('whatsapp')}
                  </a>
                </li>
              ))}
              {contactInfo.filter(c => c.type === 'address').map((contact) => (
                <li key={contact.id} className="text-primary-foreground/80">
                  <strong>Alamat:</strong> {contact.value}
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-primary-foreground/20 flex flex-col md:flex-row justify-between items-center">
          <p className="text-primary-foreground/60 text-sm">
            © 2024 Servisoo. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="text-primary-foreground/60 hover:text-accent text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-primary-foreground/60 hover:text-accent text-sm transition-colors">
              Terms of Service
            </Link>
            <Link to="/admin/login" className="text-primary-foreground/60 hover:text-accent text-sm transition-colors">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer