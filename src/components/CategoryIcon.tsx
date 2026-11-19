import {
  Briefcase,
  Film,
  ShoppingBag,
  Train,
  TrendingUp,
  Utensils,
  Wallet,
  Zap,
} from 'lucide-react';
import type { TransactionCategory } from '../types/finance';

interface CategoryIconProps {
  category: TransactionCategory;
  className?: string;
}

export function CategoryIcon({ category, className = 'w-5 h-5' }: CategoryIconProps) {
  switch (category) {
    case 'Makanan & Minum':
      return <Utensils className={className} aria-hidden="true" />;
    case 'Transportasi':
      return <Train className={className} aria-hidden="true" />;
    case 'Belanja':
      return <ShoppingBag className={className} aria-hidden="true" />;
    case 'Tagihan':
      return <Zap className={className} aria-hidden="true" />;
    case 'Hiburan':
      return <Film className={className} aria-hidden="true" />;
    case 'Gaji':
      return <Wallet className={className} aria-hidden="true" />;
    case 'Freelance':
      return <Briefcase className={className} aria-hidden="true" />;
    case 'Investasi':
      return <TrendingUp className={className} aria-hidden="true" />;
  }
}
