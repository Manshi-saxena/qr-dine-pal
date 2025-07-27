import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Minus, Star, Leaf } from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  isVeg: boolean;
  isBestseller?: boolean;
  image?: string;
}

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
  category: string;
  isVeg: boolean;
}

interface MenuPanelProps {
  onAddToCart: (item: OrderItem) => void;
  language: 'en' | 'hi';
}

const menuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Butter Chicken',
    price: 320,
    description: 'Creamy tomato-based curry with tender chicken',
    category: 'main',
    isVeg: false,
    isBestseller: true
  },
  {
    id: '2', 
    name: 'Paneer Butter Masala',
    price: 280,
    description: 'Rich cottage cheese curry in tomato gravy',
    category: 'main',
    isVeg: true,
    isBestseller: true
  },
  {
    id: '3',
    name: 'Chicken Biryani',
    price: 380,
    description: 'Aromatic basmati rice with spiced chicken',
    category: 'main',
    isVeg: false,
    isBestseller: true
  },
  {
    id: '4',
    name: 'Samosa',
    price: 60,
    description: 'Crispy pastry with spiced potato filling',
    category: 'starter',
    isVeg: true
  },
  {
    id: '5',
    name: 'Chicken Tikka',
    price: 240,
    description: 'Grilled marinated chicken pieces',
    category: 'starter',
    isVeg: false
  },
  {
    id: '6',
    name: 'Masala Chai',
    price: 40,
    description: 'Traditional spiced tea',
    category: 'drinks',
    isVeg: true
  },
  {
    id: '7',
    name: 'Fresh Lime Soda',
    price: 80,
    description: 'Refreshing lime with soda water',
    category: 'drinks',
    isVeg: true
  },
  {
    id: '8',
    name: 'Gulab Jamun',
    price: 120,
    description: 'Sweet milk dumplings in sugar syrup',
    category: 'desserts',
    isVeg: true
  }
];

export const MenuPanel: React.FC<MenuPanelProps> = ({ onAddToCart, language }) => {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});

  const translations = {
    en: {
      starters: 'Starters',
      main: 'Main Course', 
      drinks: 'Drinks',
      desserts: 'Desserts',
      bestseller: 'Bestseller',
      veg: 'Veg',
      nonVeg: 'Non-Veg',
      addToCart: 'Add to Cart',
      quantity: 'Quantity',
      specialNotes: 'Special Notes (Optional)',
      placeholder: 'e.g., no onions, extra spicy'
    },
    hi: {
      starters: 'स्टार्टर',
      main: 'मुख्य पकवान',
      drinks: 'पेय',
      desserts: 'मिठाई',
      bestseller: 'बेस्टसेलर',
      veg: 'शाकाहारी',
      nonVeg: 'मांसाहारी', 
      addToCart: 'कार्ट में जोड़ें',
      quantity: 'मात्रा',
      specialNotes: 'विशेष टिप्पणी (वैकल्पिक)',
      placeholder: 'जैसे: बिना प्याज, अतिरिक्त तीखा'
    }
  };

  const t = translations[language];

  const categories = [
    { id: 'starter', label: t.starters },
    { id: 'main', label: t.main },
    { id: 'drinks', label: t.drinks },
    { id: 'desserts', label: t.desserts }
  ];

  const updateQuantity = (itemId: string, delta: number) => {
    setQuantities(prev => ({
      ...prev,
      [itemId]: Math.max(0, (prev[itemId] || 0) + delta)
    }));
  };

  const handleAddToCart = (item: MenuItem) => {
    const quantity = quantities[item.id] || 1;
    const orderItem: OrderItem = {
      id: item.id,
      name: item.name,
      price: item.price,
      quantity,
      notes: notes[item.id],
      category: item.category,
      isVeg: item.isVeg
    };
    
    onAddToCart(orderItem);
    setQuantities(prev => ({ ...prev, [item.id]: 0 }));
    setNotes(prev => ({ ...prev, [item.id]: '' }));
  };

  const renderMenuItem = (item: MenuItem) => (
    <Card key={item.id} className="p-4 space-y-3 hover:shadow-md transition-shadow animate-bounce-in">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-foreground">{item.name}</h3>
            {item.isVeg ? (
              <div className="w-4 h-4 border-2 border-food-veg flex items-center justify-center">
                <div className="w-2 h-2 bg-food-veg rounded-full"></div>
              </div>
            ) : (
              <div className="w-4 h-4 border-2 border-food-nonveg flex items-center justify-center">
                <div className="w-2 h-2 bg-food-nonveg rounded-full"></div>
              </div>
            )}
            {item.isBestseller && (
              <Badge className="bg-order-preparing text-white text-xs">
                <Star className="w-3 h-3 mr-1" />
                {t.bestseller}
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
          <p className="font-bold text-primary">₹{item.price}</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">{t.quantity}:</span>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => updateQuantity(item.id, -1)}
              disabled={!quantities[item.id]}
            >
              <Minus className="w-3 h-3" />
            </Button>
            <span className="w-8 text-center">{quantities[item.id] || 0}</span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => updateQuantity(item.id, 1)}
            >
              <Plus className="w-3 h-3" />
            </Button>
          </div>
        </div>

        <Textarea
          placeholder={t.placeholder}
          value={notes[item.id] || ''}
          onChange={(e) => setNotes(prev => ({ ...prev, [item.id]: e.target.value }))}
          className="text-sm"
          rows={2}
        />

        <Button
          onClick={() => handleAddToCart(item)}
          disabled={!quantities[item.id]}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          {t.addToCart}
        </Button>
      </div>
    </Card>
  );

  return (
    <div className="flex-1 p-4">
      <Tabs defaultValue="starter" className="space-y-4">
        <TabsList className="grid grid-cols-4 w-full">
          {categories.map(category => (
            <TabsTrigger key={category.id} value={category.id} className="text-xs">
              {category.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map(category => (
          <TabsContent key={category.id} value={category.id}>
            <div className="space-y-4">
              {menuItems
                .filter(item => item.category === category.id)
                .map(renderMenuItem)}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};