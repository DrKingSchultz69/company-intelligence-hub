import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, Rocket, Briefcase, Cpu, Globe, LucideIcon } from 'lucide-react';
import { AnimatedCounter } from './AnimatedCounter';

interface CategoryTileProps {
  category: string;
  count: number;
  index?: number;
}

const categoryIcons: Record<string, LucideIcon> = {
  'Enterprise': Building2,
  'Startup': Rocket,
  'Product': Cpu,
  'Service': Briefcase,
  'default': Globe,
};

const categoryColors: Record<string, string> = {
  'Enterprise': 'from-primary/20 to-secondary/10 hover:from-primary/30 hover:to-secondary/20',
  'Startup': 'from-accent/20 to-warning/10 hover:from-accent/30 hover:to-warning/20',
  'Product': 'from-secondary/20 to-primary/10 hover:from-secondary/30 hover:to-primary/20',
  'Service': 'from-success/20 to-primary/10 hover:from-success/30 hover:to-primary/20',
  'default': 'from-muted/20 to-muted/10 hover:from-muted/30 hover:to-muted/20',
};

export function CategoryTile({ category, count, index = 0 }: CategoryTileProps) {
  const Icon = categoryIcons[category] || categoryIcons.default;
  const colorClass = categoryColors[category] || categoryColors.default;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
    >
      <Link
        to={`/categories?filter=${encodeURIComponent(category)}`}
        className="block"
      >
        <div className={`category-tile bg-gradient-to-br ${colorClass}`}>
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-background/50 flex items-center justify-center">
              <Icon className="w-6 h-6 text-primary" />
            </div>
            <div className="text-right">
              <AnimatedCounter 
                value={count} 
                className="stat-counter text-3xl"
              />
              <p className="text-xs text-muted-foreground mt-1">companies</p>
            </div>
          </div>
          
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-foreground">{category}</h3>
            <p className="text-sm text-muted-foreground">
              {category === 'Enterprise' && 'Large established corporations'}
              {category === 'Startup' && 'Early-stage & scale-ups'}
              {category === 'Product' && 'Product-focused companies'}
              {category === 'Service' && 'Service & consulting firms'}
              {!['Enterprise', 'Startup', 'Product', 'Service'].includes(category) && 'Various organizations'}
            </p>
          </div>

          {/* Decorative corner */}
          <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden rounded-tr-lg">
            <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-primary/30 rounded-tr-lg" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
