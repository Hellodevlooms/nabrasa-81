import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CartProvider, useCart } from '@/contexts/CartContext';
import Header from '@/components/Header';
import MenuCard from '@/components/MenuCard';
import Cart from '@/components/Cart';
import CheckoutForm from '@/components/CheckoutForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { menuItems } from '@/data/menu';
import heroImage from '@/assets/hero-burger-4k.jpg';
import { Instagram, ShoppingCart } from 'lucide-react';

type ViewType = 'menu' | 'cart' | 'checkout';

const FloatingCartButton = ({ onCartClick }: { onCartClick: () => void }) => {
  const { getTotalItems } = useCart();
  const itemCount = getTotalItems();

  if (itemCount === 0) return null;

  return (
    <Button
      variant="cart"
      size="icon"
      className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-2xl"
      onClick={onCartClick}
    >
      <ShoppingCart className="h-6 w-6" />
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
          {itemCount}
        </span>
      )}
    </Button>
  );
};

const Index = () => {
  const [currentView, setCurrentView] = useState<ViewType>('menu');

  return (
    <CartProvider>
      <div className="min-h-screen bg-background">
        <Header 
          onCartClick={() => setCurrentView('cart')} 
          onLogoClick={() => setCurrentView('menu')}
        />
        
        {/* Hero Section */}
        {currentView === 'menu' && (
          <section className="relative h-48 md:h-80 lg:h-96 overflow-hidden">
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${heroImage})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-burger-dark/80 to-burger-brown/60" />
            </div>
            <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
              <div className="text-center md:text-left max-w-2xl">
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-burger-light mb-3 md:mb-4">
                  NA BRASA
                  <span className="block text-primary text-2xl md:text-4xl lg:text-5xl">BURGUER!</span>
                </h1>
                <p className="text-base md:text-lg lg:text-xl text-burger-light/90 mb-4 md:mb-6">
                  Os melhores hamburgueres artesanais da cidade
                </p>
                <div className="bg-card/90 backdrop-blur-sm rounded-lg p-3 md:p-4 inline-block">
                  <p className="text-xs md:text-sm text-burger-orange font-semibold">
                    📍 General Glicério, 1388
                  </p>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    🕒 Somente aos Sábados - A partir das 19h00
                  </p>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    📞 (18) 99627-7667
                  </p>
                  <div className="mt-3">
                    <Button asChild variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                      <Link to="/auth">
                        Acessar Dashboard
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        <main className="container mx-auto px-4 py-8">
          {currentView === 'menu' && (
            <div>
              {/* Menu Section */}
              <section className="mb-12">
                <Card className="mb-8">
                  <CardHeader className="text-center">
                    <CardTitle className="text-3xl text-primary">NOSSO CARDÁPIO</CardTitle>
                  </CardHeader>
                </Card>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {menuItems.map((item) => (
                    <MenuCard key={item.id} item={item} />
                  ))}
                </div>
              </section>

              {/* Info Section */}
              <section>
                <Card className="bg-gradient-primary text-burger-dark">
                  <CardContent className="p-6 text-center">
                    <h3 className="text-2xl font-bold mb-4">Delivery e Retirada</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="font-semibold">📍 Endereço</p>
                        <p>General Glicério, 1388</p>
                      </div>
                      <div>
                        <p className="font-semibold">🕒 Horário</p>
                        <p>Somente aos Sábados</p>
                        <p>A partir das 19h00</p>
                      </div>
                      <div>
                        <p className="font-semibold">📞 Contato</p>
                        <p>(18) 99627-7667</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>
            </div>
          )}

          {currentView === 'cart' && (
            <Cart onCheckout={() => setCurrentView('checkout')} />
          )}

          {currentView === 'checkout' && (
            <CheckoutForm onBack={() => setCurrentView('cart')} />
          )}
        </main>

        {/* Floating Cart Button - Only show on menu view */}
        {currentView === 'menu' && (
          <FloatingCartButton onCartClick={() => setCurrentView('cart')} />
        )}

        <footer className="py-8 mt-8 border-t border-border/40">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            <p>
              Desenvolvido por{" "}
              <a
                href="https://www.instagram.com/caiozinsly/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
              >
                <Instagram className="h-4 w-4" />
                Delinx - co.
              </a>
            </p>
          </div>
        </footer>
      </div>
    </CartProvider>
  );
};

export default Index;
