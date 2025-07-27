import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, ChefHat, CheckCircle, Utensils } from 'lucide-react';

interface OrderStatusProps {
  status: 'none' | 'confirmed' | 'preparing' | 'ready' | 'served';
  language: 'en' | 'hi';
  estimatedTime?: number;
}

export const OrderStatus: React.FC<OrderStatusProps> = ({ 
  status, 
  language, 
  estimatedTime = 20 
}) => {
  const translations = {
    en: {
      noOrder: "No active orders",
      noOrderDesc: "Place an order to track its status here!",
      confirmed: "Order Confirmed!",
      confirmedDesc: "Your order has been received and confirmed.",
      preparing: "Being Prepared",
      preparingDesc: "Our chefs are working on your delicious meal.",
      ready: "Ready for Pickup",
      readyDesc: "Your order is ready! Please collect it from the counter.",
      served: "Order Served",
      servedDesc: "Enjoy your meal! We hope you love it.",
      estimatedTime: "Estimated time",
      minutes: "minutes",
      orderNumber: "Order #1234"
    },
    hi: {
      noOrder: "कोई सक्रिय ऑर्डर नहीं",
      noOrderDesc: "यहां स्थिति ट्रैक करने के लिए एक ऑर्डर दें!",
      confirmed: "ऑर्डर कन्फर्म!",
      confirmedDesc: "आपका ऑर्डर प्राप्त और कन्फर्म हो गया है।",
      preparing: "तैयार किया जा रहा है",
      preparingDesc: "हमारे शेफ आपके स्वादिष्ट भोजन पर काम कर रहे हैं।",
      ready: "पिकअप के लिए तैयार",
      readyDesc: "आपका ऑर्डर तैयार है! कृपया काउंटर से लें।",
      served: "ऑर्डर परोसा गया",
      servedDesc: "अपने भोजन का आनंद लें! हमें उम्मीद है कि आपको पसंद आएगा।",
      estimatedTime: "अनुमानित समय",
      minutes: "मिनट",
      orderNumber: "ऑर्डर #1234"
    }
  };

  const t = translations[language];

  const statusConfig = {
    none: {
      icon: Clock,
      title: t.noOrder,
      description: t.noOrderDesc,
      color: 'muted',
      bgColor: 'bg-muted'
    },
    confirmed: {
      icon: CheckCircle,
      title: t.confirmed,
      description: t.confirmedDesc,
      color: 'primary',
      bgColor: 'bg-primary'
    },
    preparing: {
      icon: ChefHat,
      title: t.preparing,
      description: t.preparingDesc,
      color: 'order-preparing',
      bgColor: 'bg-order-preparing'
    },
    ready: {
      icon: Utensils,
      title: t.ready,
      description: t.readyDesc,
      color: 'order-ready',
      bgColor: 'bg-order-ready'
    },
    served: {
      icon: CheckCircle,
      title: t.served,
      description: t.servedDesc,
      color: 'order-ready',
      bgColor: 'bg-order-ready'
    }
  };

  const currentStatus = statusConfig[status];
  const IconComponent = currentStatus.icon;

  const steps = [
    { key: 'confirmed', label: 'Confirmed', completed: ['confirmed', 'preparing', 'ready', 'served'].includes(status) },
    { key: 'preparing', label: 'Preparing', completed: ['preparing', 'ready', 'served'].includes(status) },
    { key: 'ready', label: 'Ready', completed: ['ready', 'served'].includes(status) },
    { key: 'served', label: 'Served', completed: ['served'].includes(status) }
  ];

  return (
    <div className="flex-1 p-4 space-y-6">
      {/* Main Status Card */}
      <Card className="p-6 text-center animate-bounce-in">
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${currentStatus.bgColor} text-white mb-4`}>
          <IconComponent className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold mb-2">{currentStatus.title}</h2>
        <p className="text-muted-foreground mb-4">{currentStatus.description}</p>
        
        {status !== 'none' && (
          <Badge variant="outline" className="mb-4">
            {t.orderNumber}
          </Badge>
        )}

        {(status === 'confirmed' || status === 'preparing') && (
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{t.estimatedTime}: {estimatedTime} {t.minutes}</span>
          </div>
        )}
      </Card>

      {/* Progress Steps */}
      {status !== 'none' && (
        <Card className="p-4">
          <h3 className="font-semibold mb-4">Order Progress</h3>
          <div className="space-y-3">
            {steps.map((step, index) => (
              <div key={step.key} className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  step.completed 
                    ? 'bg-order-ready text-white' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {step.completed ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <span className="text-xs">{index + 1}</span>
                  )}
                </div>
                <span className={`text-sm ${step.completed ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Fun Waiting Message */}
      {(status === 'confirmed' || status === 'preparing') && (
        <Card className="p-4 bg-muted/20 border-dashed">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">
              ⏱️ While you wait, why not try our games or browse more menu items?
            </p>
            <p className="text-xs text-muted-foreground">
              We'll notify you when your order is ready! 
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};