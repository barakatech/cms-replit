import { Gift, Users, DollarSign, ArrowRight, Share2, Copy, CheckCircle2, Smartphone, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import BarakaHeader from '@/components/BarakaHeader';

export default function ReferEarnPage() {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const referralCode = "BARAKA30";
  const referralLink = "https://baraka.app/invite/BARAKA30";

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast({
      title: "Copied!",
      description: "Referral link copied to clipboard",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const steps = [
    {
      icon: Share2,
      title: "Share Your Link",
      description: "Send your unique referral link to friends and family",
    },
    {
      icon: Smartphone,
      title: "They Sign Up",
      description: "Your friend downloads Baraka and creates an account",
    },
    {
      icon: DollarSign,
      title: "Both Get $30",
      description: "You both receive $30 when they make their first deposit",
    },
  ];

  const benefits = [
    { label: "You Get", value: "$30", description: "Free stock credit" },
    { label: "They Get", value: "$30", description: "Welcome bonus" },
    { label: "No Limit", value: "∞", description: "Unlimited referrals" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <BarakaHeader />
      
      <main>
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10 py-20 md:py-32">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.15),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--accent)/0.1),transparent_50%)]" />
          
          <div className="container relative">
            <div className="mx-auto max-w-3xl text-center">
              <Badge variant="secondary" className="mb-4" data-testid="badge-promo">
                <Gift className="h-3 w-3 mr-1" />
                Limited Time Offer
              </Badge>
              
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6" data-testid="text-hero-title">
                Give $30, Get{' '}
                <span className="text-primary">$30</span>
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto" data-testid="text-hero-description">
                Invite your friends to Baraka and you'll both receive $30 in free stock credit when they make their first deposit.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <div className="flex-1 max-w-md">
                  <div className="flex gap-2">
                    <Input
                      value={referralLink}
                      readOnly
                      className="text-center font-mono"
                      data-testid="input-referral-link"
                    />
                    <Button 
                      onClick={() => copyToClipboard(referralLink)}
                      className="gap-2"
                      data-testid="button-copy-link"
                    >
                      {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      {copied ? 'Copied!' : 'Copy'}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-3">
                <Button size="lg" className="gap-2" data-testid="button-share">
                  <Share2 className="h-4 w-4" />
                  Share Now
                </Button>
                <Button size="lg" variant="outline" className="gap-2" data-testid="button-download">
                  <Smartphone className="h-4 w-4" />
                  Download App
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 border-b">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <Card key={index} className="text-center" data-testid={`card-benefit-${index}`}>
                  <CardContent className="pt-8 pb-6">
                    <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                      {benefit.value}
                    </div>
                    <div className="text-lg font-semibold mb-1">{benefit.label}</div>
                    <div className="text-sm text-muted-foreground">{benefit.description}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-how-it-works-title">
                How It Works
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Earning rewards is easy. Just follow these three simple steps.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {steps.map((step, index) => (
                <div key={index} className="relative" data-testid={`step-${index}`}>
                  <Card className="h-full">
                    <CardContent className="pt-8 pb-6 text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                        <step.icon className="h-8 w-8" />
                      </div>
                      <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                      <p className="text-muted-foreground">{step.description}</p>
                    </CardContent>
                  </Card>
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                      <ArrowRight className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Why Invite Friends to Baraka?
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {[
                { icon: DollarSign, title: "Commission-Free Trading", description: "Trade US stocks without any commission fees" },
                { icon: Users, title: "Fractional Shares", description: "Invest in any stock with as little as $1" },
                { icon: Star, title: "Halal Options", description: "Access to Shariah-compliant investment options" },
                { icon: Gift, title: "Bonus Rewards", description: "Earn free stocks and bonuses regularly" },
              ].map((feature, index) => (
                <Card key={index} className="text-center" data-testid={`card-feature-${index}`}>
                  <CardContent className="pt-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container">
            <Card className="max-w-3xl mx-auto overflow-hidden">
              <div className="bg-gradient-to-r from-primary to-primary/80 p-8 md:p-12 text-center text-primary-foreground">
                <Gift className="h-12 w-12 mx-auto mb-4" />
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  Start Earning Today
                </h2>
                <p className="text-primary-foreground/80 mb-6 max-w-lg mx-auto">
                  Share your referral code with friends and start earning $30 for each successful referral. There's no limit!
                </p>
                
                <div className="bg-white/10 backdrop-blur rounded-lg p-4 max-w-sm mx-auto mb-6">
                  <div className="text-sm text-primary-foreground/70 mb-1">Your Referral Code</div>
                  <div className="text-2xl font-mono font-bold" data-testid="text-referral-code">
                    {referralCode}
                  </div>
                </div>

                <Button 
                  size="lg" 
                  variant="secondary"
                  onClick={() => copyToClipboard(referralLink)}
                  className="gap-2"
                  data-testid="button-copy-link-cta"
                >
                  {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  Copy Referral Link
                </Button>
              </div>
            </Card>
          </div>
        </section>

        <section className="py-12 border-t">
          <div className="container">
            <div className="text-center text-sm text-muted-foreground max-w-2xl mx-auto">
              <p className="mb-2">
                *Terms and conditions apply. Referral bonus is credited after the referred user makes their first deposit of at least $10. 
                Both parties must complete account verification. Baraka reserves the right to modify or terminate this program at any time.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
