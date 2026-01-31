import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface DetailSectionProps {
  title: string;
  icon: LucideIcon;
  children: ReactNode;
  id?: string;
}

export function DetailSection({ title, icon: Icon, children, id }: DetailSectionProps) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.4 }}
      className="detail-section"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <h2 className="section-header mb-0 pb-0 after:hidden">{title}</h2>
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </motion.section>
  );
}

interface DataFieldProps {
  label: string;
  value: string | null | undefined;
  type?: 'text' | 'list' | 'link' | 'email' | 'rating';
}

export function DataField({ label, value, type = 'text' }: DataFieldProps) {
  if (!value || value === 'NA' || value === 'N/A') {
    return null;
  }

  const renderValue = () => {
    switch (type) {
      case 'list':
        const items = value.split(';').map(item => item.trim()).filter(Boolean);
        return (
          <ul className="space-y-1">
            {items.map((item, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/50 mt-2 flex-shrink-0" />
                <span className="text-foreground/90">{item}</span>
              </li>
            ))}
          </ul>
        );
      
      case 'link':
        return (
          <a 
            href={value.startsWith('http') ? value : `https://${value}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary/80 underline underline-offset-2 transition-colors"
          >
            {value}
          </a>
        );
      
      case 'email':
        return (
          <a 
            href={`mailto:${value}`}
            className="text-primary hover:text-primary/80 underline underline-offset-2 transition-colors"
          >
            {value}
          </a>
        );
      
      case 'rating':
        return (
          <div className="flex items-center gap-2">
            <span className="text-foreground/90">{value}</span>
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <div 
                  key={i} 
                  className={`w-2 h-2 rounded-full ${i < parseFloat(value) ? 'bg-primary' : 'bg-muted'}`} 
                />
              ))}
            </div>
          </div>
        );
      
      default:
        return <span className="text-foreground/90">{value}</span>;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 py-3 border-b border-border/30 last:border-0">
      <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
      <dd className="md:col-span-2 text-sm">{renderValue()}</dd>
    </div>
  );
}

interface DataGridProps {
  children: ReactNode;
}

export function DataGrid({ children }: DataGridProps) {
  return (
    <dl className="divide-y divide-border/30">
      {children}
    </dl>
  );
}
