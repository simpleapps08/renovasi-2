import { Button } from "@/components/ui/enhanced-button"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import { Link, useLocation } from "react-router-dom"

const homeNavItems = [
  { label: "Layanan", href: "#layanan" },
  { label: "Keunggulan", href: "#keunggulan" },
  { label: "Proses", href: "#proses" },
  { label: "Portofolio", href: "#portfolio" },
  { label: "Konsultasi", href: "#konsultasi" },
]

const localNavItems = [
  { label: "Layanan", href: "#layanan" },
  { label: "FAQ", href: "#faq" },
  { label: "Konsultasi", href: "#konsultasi" },
  { label: "Homepage", href: "/" },
]

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()
  const navItems = location.pathname === '/' ? homeNavItems : localNavItems

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#10241a]/92 text-white backdrop-blur supports-[backdrop-filter]:bg-[#10241a]/80">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center space-x-2 shrink-0">
          <img src="/logo.svg" alt="Servisoo Logo" className="h-10" />
        </Link>

        <nav className="hidden lg:flex items-center space-x-6">
          {navItems.map((item) => (
            <a key={item.label} href={item.href} className="text-sm font-medium text-white/80 transition-colors hover:text-green-300">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <a href="https://wa.me/6285808675233" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-white/75 transition-colors hover:text-green-300">
            WhatsApp
          </a>
          <Button variant="hero" asChild>
            <a href="#konsultasi">Konsultasi Gratis</a>
          </Button>
        </div>

        <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 hover:text-white md:hidden" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {isMobileMenuOpen && (
        <div className="border-t border-white/10 bg-[#10241a]/95 backdrop-blur md:hidden">
          <nav className="container py-4 space-y-4">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="block py-2 text-sm font-medium text-white/80 transition-colors hover:text-green-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}

            <div className="pt-4 border-t space-y-2">
              <Button variant="hero" className="w-full" asChild>
                <a href="#konsultasi" onClick={() => setIsMobileMenuOpen(false)}>
                  Konsultasi Gratis
                </a>
              </Button>
              <Button variant="outline" className="w-full border-white/20 bg-white/5 text-white hover:bg-white hover:text-primary" asChild>
                <a href="https://wa.me/6285808675233" target="_blank" rel="noopener noreferrer">
                  Chat WhatsApp
                </a>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

export default Header
