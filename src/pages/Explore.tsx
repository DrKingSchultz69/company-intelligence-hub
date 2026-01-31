import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Filter, SortAsc, SortDesc } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { CompanyCard } from '@/components/ui/CompanyCard';
import { SearchInput } from '@/components/ui/SearchInput';
import { CompanyCardSkeleton } from '@/components/ui/LoadingSkeleton';
import { NoDataAvailable, NoSearchResults } from '@/components/ui/EmptyState';
import { useCompanies } from '@/hooks/useCompanies';
import type { Company, SortState } from '@/types/company';
import { cn } from '@/lib/utils';

const sortOptions: { field: keyof Company; label: string }[] = [
  { field: 'name', label: 'Name' },
  { field: 'employee_size', label: 'Employee Size' },
  { field: 'yoy_growth_rate', label: 'Growth Rate' },
  { field: 'brand_value', label: 'Brand Value' },
];

const Explore = () => {
  const { data: companies, isLoading } = useCompanies();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortState, setSortState] = useState<SortState>({ field: 'name', direction: 'asc' });
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    profitability: '',
    remote: '',
  });

  // Get unique filter values
  const filterOptions = useMemo(() => {
    if (!companies) return { categories: [], profitabilities: [], remotes: [] };
    
    const categories = [...new Set(companies.map(c => c.category).filter(Boolean))];
    const profitabilities = [...new Set(companies.map(c => c.profitability_status).filter(Boolean))];
    const remotes = [...new Set(companies.map(c => 
      c.remote_policy_details?.includes('Remote') || c.remote_policy_details?.includes('Hybrid') 
        ? 'Remote/Hybrid' 
        : 'On-site'
    ).filter(Boolean))];
    
    return { categories, profitabilities, remotes };
  }, [companies]);

  // Filter and sort companies
  const filteredCompanies = useMemo(() => {
    if (!companies) return [];

    let result = [...companies];

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(company => 
        company.name?.toLowerCase().includes(query) ||
        company.focus_sectors?.toLowerCase().includes(query) ||
        company.tech_stack?.toLowerCase().includes(query) ||
        company.category?.toLowerCase().includes(query)
      );
    }

    // Apply filters
    if (filters.category) {
      result = result.filter(c => c.category === filters.category);
    }
    if (filters.profitability) {
      result = result.filter(c => c.profitability_status === filters.profitability);
    }
    if (filters.remote) {
      result = result.filter(c => {
        const isRemote = c.remote_policy_details?.includes('Remote') || c.remote_policy_details?.includes('Hybrid');
        return filters.remote === 'Remote/Hybrid' ? isRemote : !isRemote;
      });
    }

    // Apply sorting
    result.sort((a, b) => {
      const aVal = a[sortState.field] || '';
      const bVal = b[sortState.field] || '';
      const comparison = String(aVal).localeCompare(String(bVal), undefined, { numeric: true });
      return sortState.direction === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [companies, searchQuery, filters, sortState]);

  const toggleSort = (field: keyof Company) => {
    setSortState(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="h-10 w-64 skeleton-cyber rounded mb-4" />
            <div className="h-12 w-full skeleton-cyber rounded" />
          </div>
          <div className="data-grid">
            {[...Array(12)].map((_, i) => (
              <CompanyCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">
            <span className="gradient-text-cyber">Explore Companies</span>
          </h1>
          <p className="text-muted-foreground">
            Browse and filter through all available company profiles
          </p>
        </motion.div>

        {/* Search & Filters Bar */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search companies..."
            className="flex-1"
          />
          
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "flex items-center gap-2 px-4 py-3 rounded-xl transition-all",
                showFilters 
                  ? "bg-primary text-primary-foreground" 
                  : "glass-panel border-border/50 text-muted-foreground hover:text-foreground"
              )}
            >
              <Filter className="w-5 h-5" />
              Filters
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-panel p-6 mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg bg-muted/30 border border-border/50 text-foreground focus:border-primary/50 focus:outline-none"
                >
                  <option value="">All Categories</option>
                  {filterOptions.categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Profitability</label>
                <select
                  value={filters.profitability}
                  onChange={(e) => setFilters(prev => ({ ...prev, profitability: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg bg-muted/30 border border-border/50 text-foreground focus:border-primary/50 focus:outline-none"
                >
                  <option value="">All</option>
                  {filterOptions.profitabilities.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Work Policy</label>
                <select
                  value={filters.remote}
                  onChange={(e) => setFilters(prev => ({ ...prev, remote: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg bg-muted/30 border border-border/50 text-foreground focus:border-primary/50 focus:outline-none"
                >
                  <option value="">All</option>
                  {filterOptions.remotes.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-6">
              <span className="text-sm text-muted-foreground">Sort by:</span>
              {sortOptions.map(option => (
                <button
                  key={option.field}
                  onClick={() => toggleSort(option.field)}
                  className={cn(
                    "flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-all",
                    sortState.field === option.field 
                      ? "bg-primary/20 text-primary" 
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  {option.label}
                  {sortState.field === option.field && (
                    sortState.direction === 'asc' 
                      ? <SortAsc className="w-4 h-4" />
                      : <SortDesc className="w-4 h-4" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted-foreground">
            Showing <span className="text-foreground font-medium">{filteredCompanies.length}</span> companies
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="realtime-dot" />
            <span>Live updates</span>
          </div>
        </div>

        {/* Companies Grid */}
        {filteredCompanies.length === 0 ? (
          searchQuery ? (
            <NoSearchResults query={searchQuery} />
          ) : (
            <NoDataAvailable />
          )
        ) : (
          <div className="data-grid">
            {filteredCompanies.map((company, index) => (
              <CompanyCard key={company.id} company={company} index={index} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Explore;
