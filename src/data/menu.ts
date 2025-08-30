import { MenuItem, Additional } from '@/types/order';

export const menuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Na Brasa Clássico',
    description: 'Pão brioche, blend de 160g e duas fatias de queijo cheddar Polenghi',
    price: 25.00,
  },
  {
    id: '2',
    name: 'Na Brasa Especial',
    description: 'Pão brioche, blend de 160g, duas fatias de queijo cheddar Polenghi, cebola caramelizada e bacon premium',
    price: 30.00,
  },
];

export const additionals: Additional[] = [
  { id: 'hamburger', name: 'Hambúrguer', price: 9.00 },
  { id: 'ovo', name: 'Ovo', price: 3.00 },
  { id: 'bacon', name: 'Bacon', price: 5.00 },
  { id: 'cebola', name: 'Cebola', price: 3.00 },
  { id: 'baconese', name: 'Baconese', price: 3.00 },
  { id: 'rucula', name: 'Rúcula', price: 3.00 },
];