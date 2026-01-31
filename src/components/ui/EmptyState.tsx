import { motion } from 'framer-motion';
import { Database, Search, AlertCircle, LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ 
  title, 
  description, 
  icon: Icon = Database,
  action 
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <div className="w-20 h-20 rounded-2xl bg-muted/30 flex items-center justify-center mb-6">
        <Icon className="w-10 h-10 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-md mb-6">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="cyber-button"
        >
          {action.label}
        </button>
      )}
    </motion.div>
  );
}

export function NoSearchResults({ query }: { query: string }) {
  return (
    <EmptyState
      icon={Search}
      title="No results found"
      description={`No companies match "${query}". Try adjusting your search or filters.`}
    />
  );
}

export function NoDataAvailable() {
  return (
    <EmptyState
      icon={Database}
      title="No data available"
      description="Company data hasn't been loaded yet. Please check back later or contact support."
    />
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <EmptyState
      icon={AlertCircle}
      title="Something went wrong"
      description={message}
    />
  );
}
