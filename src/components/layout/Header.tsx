import { Button } from "@/components/ui/enhanced-button"
import { Link } from "react-router-dom"

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <img src="/favicon.png" alt="Servisoo Logo" className="h-8 w-8" />
          <span className="text-xl font-bold text-primary">SERVISOO</span>
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
            to="#contact" 
            className="text-sm font-medium transition-colors hover:text-accent"
          >
            Kontak
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" asChild>
            <Link to="/auth">Masuk</Link>
          </Button>
          <Button variant="hero" asChild>
            <Link to="/auth">Mulai Simulasi</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}

export default Header