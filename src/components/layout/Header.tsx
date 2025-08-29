import { Button } from "@/components/ui/enhanced-button"
import { Link } from "react-router-dom"

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-primary">SERVISOO</span>
            <div className="ml-2 h-2 w-2 rounded-full bg-accent"></div>
          </div>
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