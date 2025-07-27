import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Star, Heart, ThumbsUp } from 'lucide-react';

interface FeedbackFormProps {
  language: 'en' | 'hi';
}

export const FeedbackForm: React.FC<FeedbackFormProps> = ({ language }) => {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const translations = {
    en: {
      title: "How was your experience?",
      subtitle: "Your feedback helps us serve you better!",
      rateExperience: "Rate your overall experience",
      comments: "Additional comments (optional)",
      commentsPlaceholder: "Tell us what you loved or how we can improve...",
      submit: "Submit Feedback",
      thankYou: "Thank you for your feedback!",
      thankYouMessage: "We truly appreciate your time and will use your feedback to improve our service.",
      excellent: "Excellent",
      good: "Good", 
      average: "Average",
      poor: "Poor",
      terrible: "Terrible"
    },
    hi: {
      title: "आपका अनुभव कैसा रहा?",
      subtitle: "आपकी फीडबैक हमें बेहतर सेवा देने में मदद करती है!",
      rateExperience: "अपने कुल अनुभव को रेट करें",
      comments: "अतिरिक्त टिप्पणी (वैकल्पिक)",
      commentsPlaceholder: "बताएं कि आपको क्या अच्छा लगा या हम कैसे सुधार कर सकते हैं...",
      submit: "फीडबैक भेजें",
      thankYou: "आपकी फीडबैक के लिए धन्यवाद!",
      thankYouMessage: "हम आपके समय की सराहना करते हैं और आपकी फीडबैक का उपयोग अपनी सेवा सुधारने में करेंगे।",
      excellent: "उत्कृष्ट",
      good: "अच्छा",
      average: "औसत", 
      poor: "खराब",
      terrible: "बहुत खराब"
    }
  };

  const t = translations[language];

  const ratingLabels = [
    t.terrible,
    t.poor,
    t.average,
    t.good,
    t.excellent
  ];

  const handleSubmit = () => {
    if (rating === 0) return;
    
    // Simulate feedback submission
    console.log('Feedback submitted:', { rating, comment, timestamp: new Date(), tableNumber: 12 });
    setSubmitted(true);
    
    // Reset form after a delay
    setTimeout(() => {
      setSubmitted(false);
      setRating(0);
      setComment('');
    }, 3000);
  };

  if (submitted) {
    return (
      <div className="flex-1 p-4 flex items-center justify-center">
        <Card className="p-8 text-center max-w-md animate-bounce-in">
          <div className="mb-4">
            <Heart className="w-16 h-16 mx-auto text-primary animate-pulse-gentle" />
          </div>
          <h2 className="text-xl font-bold text-primary mb-2">{t.thankYou}</h2>
          <p className="text-muted-foreground">{t.thankYouMessage}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 space-y-6">
      <Card className="p-6">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold mb-2">{t.title}</h2>
          <p className="text-muted-foreground">{t.subtitle}</p>
        </div>

        <div className="space-y-6">
          {/* Star Rating */}
          <div>
            <label className="block text-sm font-medium mb-3">{t.rateExperience}</label>
            <div className="flex justify-center gap-2 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= rating
                        ? 'text-order-preparing fill-current'
                        : 'text-muted-foreground'
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-center text-sm text-muted-foreground">
                {ratingLabels[rating - 1]}
              </p>
            )}
          </div>

          {/* Comments */}
          <div>
            <label className="block text-sm font-medium mb-2">{t.comments}</label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={t.commentsPlaceholder}
              rows={4}
              className="resize-none"
            />
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={rating === 0}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <ThumbsUp className="w-4 h-4 mr-2" />
            {t.submit}
          </Button>
        </div>
      </Card>

      {/* Quick Rating Options */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { emoji: '😍', rating: 5, label: 'Loved it!' },
          { emoji: '😊', rating: 4, label: 'Good' },
          { emoji: '😐', rating: 3, label: 'Okay' }
        ].map((option) => (
          <Card 
            key={option.rating}
            className={`p-3 text-center cursor-pointer transition-colors hover:bg-muted ${
              rating === option.rating ? 'bg-primary/10 border-primary' : ''
            }`}
            onClick={() => setRating(option.rating)}
          >
            <div className="text-2xl mb-1">{option.emoji}</div>
            <div className="text-xs text-muted-foreground">{option.label}</div>
          </Card>
        ))}
      </div>
    </div>
  );
};