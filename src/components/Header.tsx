import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Instagram, MessageCircle, ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import burgerIcon from '@/assets/burger-icon.png';

interface HeaderProps {
  onCartClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onCartClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { getTotalItems } = useCart();

  const handleSocialClick = (platform: 'instagram' | 'whatsapp') => {
    const links = {
      instagram: 'https://www.instagram.com/nabrasabuurguer/',
      whatsapp: 'https://wa.me/5518996277667'
    };
    window.open(links[platform], '_blank');
  };

  const totalItems = getTotalItems();

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-card/80">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img src={burgerIcon} alt="Na Brasa" className="w-10 h-10" />
          <div>
            <h1 className="text-xl font-bold text-primary">NA BRASA</h1>
            <p className="text-xs text-burger-orange font-semibold">BURGUER!</p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-4">
          <Button 
            variant="social" 
            size="sm"
            onClick={() => handleSocialClick('instagram')}
          >
            <Instagram className="w-4 h-4" />
            Instagram
          </Button>
          <Button 
            variant="social" 
            size="sm"
            onClick={() => handleSocialClick('whatsapp')}
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp
          </Button>
          <Button 
            variant="cart" 
            onClick={onCartClick}
            className="relative"
          >
            <ShoppingCart className="w-4 h-4" />
            Carrinho
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Button>
        </nav>

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80">
            <div className="flex flex-col gap-4 pt-8">
              <h2 className="text-lg font-bold text-primary mb-4">Menu</h2>
              
              <Button 
                variant="cart" 
                onClick={() => {
                  onCartClick();
                  setIsOpen(false);
                }}
                className="relative w-full"
              >
                <ShoppingCart className="w-4 h-4" />
                Carrinho ({totalItems})
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Button>

              <div className="border-t border-border pt-4 mt-4">
                <p className="text-sm text-muted-foreground mb-3">Nos siga nas redes sociais:</p>
                <div className="flex flex-col gap-2">
                  <Button 
                    variant="social" 
                    onClick={() => {
                      handleSocialClick('instagram');
                      setIsOpen(false);
                    }}
                    className="w-full"
                  >
                    <Instagram className="w-4 h-4" />
                    Instagram
                  </Button>
                  <Button 
                    variant="social" 
                    onClick={() => {
                      handleSocialClick('whatsapp');
                      setIsOpen(false);
                    }}
                    className="w-full"
                  >
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp
                  </Button>
                </div>
              </div>

              <div className="border-t border-border pt-4 mt-4">
                <p className="text-xs text-muted-foreground">
                  📍 General Glicério, 1388
                </p>
                <p className="text-xs text-muted-foreground">
                  📞 (18) 99627-7667
                </p>
                <p className="text-xs text-muted-foreground">
                  🕒 Somente aos Sábados - A partir das 19h00
                </p>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Header;