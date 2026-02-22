import { Button } from "@/components/ui/enhanced-button"
import { Link } from "react-router-dom"
import { useState } from "react"
import { Menu, X } from "lucide-react"

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <img src="/logo.svg" alt="Servisoo Logo" className="h-10" />
        </Link>
        
        <nav className="hidden md:flex items-center space-x-8">
          <Link 
            to="/" 
            className="text-sm font-medium transition-colors hover:text-accent"
          >
            Beranda
          </Link>
          <Link 
            to="#services" 
            className="text-sm font-medium transition-colors hover:text-accent"
          >
            Layanan
          </Link>
          <Link 
            to="#gallery" 
            className="text-sm font-medium transition-colors hover:text-accent"
          >
            Galeri
          </Link>
          <Link 
            to="/toko" 
            className="text-sm font-medium transition-colors hover:text-accent"
          >
            Toko
          </Link>
          <Link 
            to="#contact" 
            className="text-sm font-medium transition-colors hover:text-accent"
          >
            Kontak
          </Link>
          <Link 
            to="/admin/login" 
            className="text-sm font-medium transition-colors hover:text-accent"
          >
            Login Admin Toko
          </Link>
          <Link 
            to="/auth" 
            className="text-sm font-medium transition-colors hover:text-accent"
          >
            Login User
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="hero" asChild>
              <Link to="/auth">Mulai Simulasi</Link>
            </Button>
            <Button 
              className="bg-green-400 hover:bg-green-500 text-black font-semibold shadow-lg hover:shadow-green-400/25 transition-all duration-300"
              asChild
            >
              <Link to="/room-enhancer">Desain dengan AI</Link>
            </Button>
          </div>
          
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-background/95 backdrop-blur">
          <nav className="container py-4 space-y-4">
            <Link 
              to="/" 
              className="block text-sm font-medium transition-colors hover:text-accent py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Beranda
            </Link>
            <Link 
              to="#services" 
              className="block text-sm font-medium transition-colors hover:text-accent py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Layanan
            </Link>
            <Link 
              to="#gallery" 
              className="block text-sm font-medium transition-colors hover:text-accent py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Galeri
            </Link>
            <Link 
              to="/toko" 
              className="block text-sm font-medium transition-colors hover:text-accent py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Toko
            </Link>
            <Link 
              to="#contact" 
              className="block text-sm font-medium transition-colors hover:text-accent py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Kontak
            </Link>
            <Link 
              to="/admin/login" 
              className="block text-sm font-medium transition-colors hover:text-accent py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Login Admin Toko
            </Link>
            <Link 
              to="/auth" 
              className="block text-sm font-medium transition-colors hover:text-accent py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Login User
            </Link>
            
            {/* Mobile Action Buttons */}
            <div className="pt-4 border-t space-y-2">
              <Button variant="hero" className="w-full" asChild>
                <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)}>Mulai Simulasi</Link>
              </Button>
              <Button 
                className="w-full bg-green-400 hover:bg-green-500 text-black font-semibold shadow-lg hover:shadow-green-400/25 transition-all duration-300"
                asChild
              >
                <Link to="/room-enhancer" onClick={() => setIsMobileMenuOpen(false)}>Desain dengan AI</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

export default Header