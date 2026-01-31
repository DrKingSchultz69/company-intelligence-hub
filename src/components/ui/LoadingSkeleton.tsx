import { motion } from 'framer-motion';

export function CompanyCardSkeleton() {
  return (
    <div className="glass-panel p-5 space-y-4">
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-lg skeleton-cyber" />
        <div className="flex-1 space-y-2">
          <div className="h-5 w-3/4 skeleton-cyber rounded" />
          <div className="h-4 w-1/2 skeleton-cyber rounded" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="h-4 skeleton-cyber rounded" />
        <div className="h-4 skeleton-cyber rounded" />
      </div>
      <div className="h-4 w-full skeleton-cyber rounded" />
      <div className="flex justify-between pt-3 border-t border-border/50">
        <div className="h-6 w-20 skeleton-cyber rounded-full" />
        <div className="h-4 w-16 skeleton-cyber rounded" />
      </div>
    </div>
  );
}

export function CategoryTileSkeleton() {
  return (
    <div className="glass-panel p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="w-12 h-12 rounded-xl skeleton-cyber" />
        <div className="text-right space-y-1">
          <div className="h-8 w-16 skeleton-cyber rounded" />
          <div className="h-3 w-12 skeleton-cyber rounded" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-6 w-1/2 skeleton-cyber rounded" />
        <div className="h-4 w-full skeleton-cyber rounded" />
      </div>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="glass-panel p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-4 w-24 skeleton-cyber rounded" />
          <div className="h-10 w-20 skeleton-cyber rounded" />
        </div>
        <div className="w-12 h-12 rounded-xl skeleton-cyber" />
      </div>
    </div>
  );
}

export function DashboardLoadingSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-8 space-y-8"
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>

      {/* Categories */}
      <div>
        <div className="h-8 w-40 skeleton-cyber rounded mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <CategoryTileSkeleton key={i} />
          ))}
        </div>
      </div>

      {/* Company Grid */}
      <div>
        <div className="h-8 w-48 skeleton-cyber rounded mb-6" />
        <div className="data-grid">
          {[...Array(6)].map((_, i) => (
            <CompanyCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
