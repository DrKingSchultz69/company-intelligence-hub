import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, Users, TrendingUp, MapPin, Briefcase } from 'lucide-react';
import type { Company } from '@/types/company';
import { cn } from '@/lib/utils';

interface CompanyCardProps {
  company: Company;
  index?: number;
}

export function CompanyCard({ company, index = 0 }: CompanyCardProps) {
  const getHiringBadgeColor = (velocity: string | null) => {
    if (!velocity) return 'cyber-tag';
    if (velocity.toLowerCase().includes('high') || velocity.includes('15,000')) return 'cyber-tag';
    if (velocity.toLowerCase().includes('medium') || velocity.includes('1,000')) return 'cyber-tag-secondary';
    return 'cyber-tag-accent';
  };

  const getProfitabilityColor = (status: string | null) => {
    if (!status) return 'text-muted-foreground';
    if (status.toLowerCase() === 'profitable') return 'text-success';
    if (status.toLowerCase().includes('loss')) return 'text-destructive';
    return 'text-warning';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <Link to={`/company/${company.id}`} className="block">
        <div className="company-card group">
          {/* Header with Logo and Name */}
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-lg bg-muted/50 flex items-center justify-center overflow-hidden border border-border/50 group-hover:border-primary/50 transition-colors">
              {company.logo_url ? (
                <img 
                  src={company.logo_url} 
                  alt={company.name}
                  className="w-10 h-10 object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                  }}
                />
              ) : null}
              <Building2 className={cn("w-6 h-6 text-muted-foreground", company.logo_url && "hidden")} />
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                {company.name}
              </h3>
              {company.short_name && company.short_name !== company.name && (
                <p className="text-xs text-muted-foreground">{company.short_name}</p>
              )}
              {company.category && (
                <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded bg-secondary/20 text-secondary">
                  {company.category}
                </span>
              )}
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            {company.employee_size && (
              <div className="flex items-center gap-2 text-sm">
                <Users className="w-4 h-4 text-primary/70" />
                <span className="text-muted-foreground truncate">{company.employee_size}</span>
              </div>
            )}
            
            {company.headquarters_address && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-accent/70" />
                <span className="text-muted-foreground truncate">
                  {company.headquarters_address.split(',')[0]}
                </span>
              </div>
            )}
          </div>

          {/* Focus Sectors */}
          {company.focus_sectors && (
            <div className="flex items-center gap-2 mt-3">
              <Briefcase className="w-4 h-4 text-secondary/70 flex-shrink-0" />
              <p className="text-xs text-muted-foreground line-clamp-1">
                {company.focus_sectors}
              </p>
            </div>
          )}

          {/* Footer with Status */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50">
            {company.hiring_velocity && (
              <span className={getHiringBadgeColor(company.hiring_velocity)}>
                <TrendingUp className="w-3 h-3 mr-1" />
                Hiring
              </span>
            )}
            
            {company.profitability_status && (
              <span className={cn("text-xs font-medium", getProfitabilityColor(company.profitability_status))}>
                {company.profitability_status}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
