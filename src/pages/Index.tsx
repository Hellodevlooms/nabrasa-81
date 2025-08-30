import React, { useState } from 'react';
import { CartProvider } from '@/contexts/CartContext';
import Header from '@/components/Header';
import MenuCard from '@/components/MenuCard';
import Cart from '@/components/Cart';
import CheckoutForm from '@/components/CheckoutForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { menuItems } from '@/data/menu';
import heroImage from '@/assets/hero-burger.jpg';

type ViewType = 'menu' | 'cart' | 'checkout';

const Index = () => {
  const [currentView, setCurrentView] = useState<ViewType>('menu');

  return (
    <CartProvider>
      <div className="min-h-screen bg-background">
        <Header onCartClick={() => setCurrentView('cart')} />
        
        {/* Hero Section */}
        {currentView === 'menu' && (
          <section className="relative h-64 md:h-96 overflow-hidden">
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${heroImage})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-burger-dark/80 to-burger-brown/60" />
            </div>
            <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
              <div className="text-center md:text-left max-w-2xl">
                <h1 className="text-4xl md:text-6xl font-bold text-burger-light mb-4">
                  NA BRASA
                  <span className="block text-primary text-3xl md:text-5xl">BURGUER!</span>
                </h1>
                <p className="text-lg md:text-xl text-burger-light/90 mb-6">
                  Os melhores hamburgueres artesanais da cidade
                </p>
                <div className="bg-card/90 backdrop-blur-sm rounded-lg p-4 inline-block">
                  <p className="text-sm text-burger-orange font-semibold">
                    📍 General Glicério, 1388
                  </p>
                  <p className="text-sm text-muted-foreground">
                    🕒 Somente aos Sábados - A partir das 19h00
                  </p>
                  <p className="text-sm text-muted-foreground">
                    📞 (18) 99627-7667
                  </p>
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
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

        {/* Fixed bottom navigation for mobile */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4">
          <div className="flex gap-2">
            {currentView !== 'menu' && (
              <button
                onClick={() => setCurrentView('menu')}
                className="flex-1 bg-muted text-muted-foreground py-3 rounded-lg font-medium"
              >
                Menu
              </button>
            )}
            {currentView !== 'cart' && (
              <button
                onClick={() => setCurrentView('cart')}
                className="flex-1 bg-burger-orange text-burger-dark py-3 rounded-lg font-medium"
              >
                Carrinho
              </button>
            )}
          </div>
        </div>
      </div>
    </CartProvider>
  );
};

export default Index;
