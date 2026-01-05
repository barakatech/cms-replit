import * as LucideIcons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface ThemeIconProps {
  name: string;
  className?: string;
}

export default function ThemeIcon({ name, className = "h-6 w-6" }: ThemeIconProps) {
  const Icon = (LucideIcons as Record<string, LucideIcon>)[name];
  
  if (!Icon) {
    return <LucideIcons.HelpCircle className={className} />;
  }
  
  return <Icon className={className} />;
}
