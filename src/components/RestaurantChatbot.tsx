import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, ShoppingCart, Gamepad2, Menu, Star, Clock, ChefHat } from 'lucide-react';
import { MenuPanel } from './MenuPanel';
import { TicTacToe } from './TicTacToe';
import { OrderStatus } from './OrderStatus';
import { FeedbackForm } from './FeedbackForm';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'menu' | 'order' | 'game' | 'status';
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

export const RestaurantChatbot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [currentScreen, setCurrentScreen] = useState<'chat' | 'menu' | 'game' | 'status' | 'feedback'>('chat');
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [orderStatus, setOrderStatus] = useState<'none' | 'confirmed' | 'preparing' | 'ready' | 'served'>('none');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const translations = {
    en: {
      welcome: "🍴 Welcome to our restaurant! I'm your digital dining assistant. How can I help you today?",
      orderFood: "Order Food",
      viewMenu: "View Menu", 
      playGames: "Play Games",
      orderStatus: "Order Status",
      feedback: "Give Feedback",
      howCanIHelp: "How can I help you?",
      sendMessage: "Send message",
      orderNow: "Order Now",
      addToCart: "Add to Cart",
      viewCart: "View Cart",
      backToChat: "Back to Chat"
    },
    hi: {
      welcome: "🍴 हमारे रेस्टोरेंट में आपका स्वागत है! मैं आपका डिजिटल डाइनिंग असिस्टेंट हूं। आज मैं आपकी कैसे मदद कर सकता हूं?",
      orderFood: "खाना ऑर्डर करें",
      viewMenu: "मेनू देखें",
      playGames: "गेम खेलें", 
      orderStatus: "ऑर्डर स्थिति",
      feedback: "फीडबैक दें",
      howCanIHelp: "मैं आपकी कैसे मदद कर सकता हूं?",
      sendMessage: "संदेश भेजें",
      orderNow: "अभी ऑर्डर करें",
      addToCart: "कार्ट में जोड़ें",
      viewCart: "कार्ट देखें",
      backToChat: "चैट पर वापस"
    }
  };

  const t = translations[language];

  useEffect(() => {
    // Initial welcome message
    setMessages([{
      id: '1',
      text: t.welcome,
      sender: 'bot',
      timestamp: new Date()
    }]);
  }, [language]);

  useEffect(() => {
    // Auto scroll to bottom
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const addMessage = (text: string, sender: 'user' | 'bot', type?: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date(),
      type: type as any
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    addMessage(inputValue, 'user');
    
    // Simple bot responses
    setTimeout(() => {
      let botResponse = "I understand! Let me help you with that.";
      if (inputValue.toLowerCase().includes('order') || inputValue.toLowerCase().includes('food')) {
        botResponse = "Great! I can help you order food. You can browse our menu or tell me what you're craving today!";
      } else if (inputValue.toLowerCase().includes('menu')) {
        botResponse = "Perfect! Let me show you our delicious menu with fresh options.";
      } else if (inputValue.toLowerCase().includes('game')) {
        botResponse = "Fun! I have Tic Tac Toe ready for you. Want to play while you wait?";
      }
      addMessage(botResponse, 'bot');
    }, 1000);
    
    setInputValue('');
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'order':
        setCurrentScreen('menu');
        addMessage(t.orderFood, 'user');
        addMessage("Excellent choice! Here's our delicious menu. What catches your eye?", 'bot');
        break;
      case 'menu':
        setCurrentScreen('menu');
        break;
      case 'games':
        setCurrentScreen('game');
        addMessage(t.playGames, 'user');
        addMessage("Let's have some fun! How about a quick game of Tic Tac Toe?", 'bot');
        break;
      case 'status':
        setCurrentScreen('status');
        break;
      case 'feedback':
        setCurrentScreen('feedback');
        break;
    }
  };

  const addToCart = (item: OrderItem) => {
    setCart(prev => {
      const existing = prev.find(cartItem => cartItem.id === item.id);
      if (existing) {
        return prev.map(cartItem => 
          cartItem.id === item.id 
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
            : cartItem
        );
      }
      return [...prev, item];
    });
    addMessage(`Added ${item.name} to cart!`, 'bot');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'menu':
        return <MenuPanel onAddToCart={addToCart} language={language} />;
      case 'game':
        return <TicTacToe />;
      case 'status':
        return <OrderStatus status={orderStatus} language={language} />;
      case 'feedback':
        return <FeedbackForm language={language} />;
      default:
        return (
          <div className="flex-1 flex flex-col">
            {/* Chat Messages */}
            <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 shadow-sm ${
                        message.sender === 'user'
                          ? 'bg-chat-user text-primary-foreground'
                          : 'bg-chat-bot text-foreground border'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Quick Actions */}
            <div className="p-4 border-t bg-muted/20">
              <div className="grid grid-cols-2 gap-2 mb-4">
                <Button 
                  onClick={() => handleQuickAction('order')}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {t.orderFood}
                </Button>
                <Button 
                  onClick={() => handleQuickAction('menu')}
                  variant="outline"
                >
                  <Menu className="h-4 w-4 mr-2" />
                  {t.viewMenu}
                </Button>
                <Button 
                  onClick={() => handleQuickAction('games')}
                  variant="outline"
                >
                  <Gamepad2 className="h-4 w-4 mr-2" />
                  {t.playGames}
                </Button>
                <Button 
                  onClick={() => handleQuickAction('status')}
                  variant="outline"
                >
                  <Clock className="h-4 w-4 mr-2" />
                  {t.orderStatus}
                </Button>
              </div>

              {/* Chat Input */}
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={t.howCanIHelp}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ChefHat className="h-6 w-6" />
            <h1 className="text-lg font-semibold">Restaurant Assistant</h1>
          </div>
          <div className="flex items-center gap-2">
            {cart.length > 0 && (
              <Badge className="bg-accent text-accent-foreground">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </Badge>
            )}
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            >
              {language === 'en' ? 'हिं' : 'EN'}
            </Button>
            {currentScreen !== 'chat' && (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setCurrentScreen('chat')}
              >
                <MessageCircle className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      {renderScreen()}
    </div>
  );
};