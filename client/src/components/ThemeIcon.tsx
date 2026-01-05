import * as LucideIcons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface ThemeIconProps {
  name: string;
  className?: string;
}

const iconMap: Record<string, LucideIcon> = {
  Moon: LucideIcons.Moon,
  Brain: LucideIcons.Brain,
  Coins: LucideIcons.Coins,
  Leaf: LucideIcons.Leaf,
  Building2: LucideIcons.Building2,
  CreditCard: LucideIcons.CreditCard,
  Heart: LucideIcons.Heart,
  Shield: LucideIcons.Shield,
  TrendingUp: LucideIcons.TrendingUp,
  Globe: LucideIcons.Globe,
  Cpu: LucideIcons.Cpu,
  Sparkles: LucideIcons.Sparkles,
  DollarSign: LucideIcons.DollarSign,
  Zap: LucideIcons.Zap,
  Car: LucideIcons.Car,
  BarChart2: LucideIcons.BarChart2,
  Smartphone: LucideIcons.Smartphone,
  Pill: LucideIcons.Pill,
  Activity: LucideIcons.Activity,
  Star: LucideIcons.Star,
  Rocket: LucideIcons.Rocket,
  Lightbulb: LucideIcons.Lightbulb,
  Target: LucideIcons.Target,
  Layers: LucideIcons.Layers,
};

export default function ThemeIcon({ name, className = "h-6 w-6" }: ThemeIconProps) {
  const Icon = iconMap[name];
  
  if (!Icon) {
    return <span className={className}>{name}</span>;
  }
  
  return <Icon className={className} />;
}
