import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Users, TrendingUp, Globe, Zap } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { CategoryTile } from '@/components/ui/CategoryTile';
import { CompanyCard } from '@/components/ui/CompanyCard';
import { SearchInput } from '@/components/ui/SearchInput';
import { DashboardLoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { NoDataAvailable, NoSearchResults } from '@/components/ui/EmptyState';
import { useCompanies, useCompanyStats } from '@/hooks/useCompanies';

const Index = () => {
  const { data: companies, isLoading, error } = useCompanies();
  const { stats } = useCompanyStats();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter companies based on search
  const filteredCompanies = useMemo(() => {
    if (!companies) return [];
    if (!searchQuery) return companies;

    const query = searchQuery.toLowerCase();
    return companies.filter(company => 
      company.name?.toLowerCase().includes(query) ||
      company.focus_sectors?.toLowerCase().includes(query) ||
      company.tech_stack?.toLowerCase().includes(query) ||
      company.category?.toLowerCase().includes(query)
    );
  }, [companies, searchQuery]);

  // Get categories with counts
  const categories = useMemo(() => {
    return Object.entries(stats.byCategory)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4);
  }, [stats.byCategory]);

  if (isLoading) {
    return (
      <Layout>
        <DashboardLoadingSkeleton />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <NoDataAvailable />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text-cyber">Placement Intelligence</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real-time analytics and insights for career decisions. 
            Explore companies, compare opportunities, and map your skills.
          </p>

          {/* Realtime indicator */}
          <div className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground">
            <div className="realtime-dot" />
            <span>Live data updates</span>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-panel-hover p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="metric-label">Total Companies</p>
                <AnimatedCounter value={stats.total} className="stat-counter text-3xl" />
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-primary" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-panel-hover p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="metric-label">Categories</p>
                <AnimatedCounter value={Object.keys(stats.byCategory).length} className="stat-counter text-3xl" />
              </div>
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                <Globe className="w-6 h-6 text-secondary" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-panel-hover p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="metric-label">Actively Hiring</p>
                <AnimatedCounter 
                  value={Object.values(stats.byHiringVelocity).reduce((a, b) => a + b, 0)} 
                  className="stat-counter text-3xl" 
                />
              </div>
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-accent" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-panel-hover p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="metric-label">Remote-Friendly</p>
                <AnimatedCounter 
                  value={stats.byRemotePolicy['Remote/Hybrid'] || 0} 
                  className="stat-counter text-3xl" 
                />
              </div>
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <Zap className="w-6 h-6 text-success" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Categories Section */}
        <section className="mb-12">
          <h2 className="section-header">Explore by Category</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map(([category, count], index) => (
              <CategoryTile 
                key={category} 
                category={category} 
                count={count} 
                index={index}
              />
            ))}
          </div>
        </section>

        {/* Search Section */}
        <section className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
            <h2 className="section-header mb-0 pb-0 after:hidden">
              All Companies
              <span className="text-sm font-normal text-muted-foreground ml-2">
                ({filteredCompanies.length})
              </span>
            </h2>
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search by name, sector, tech stack..."
              className="w-full md:w-80"
            />
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
              {filteredCompanies.slice(0, 12).map((company, index) => (
                <CompanyCard key={company.id} company={company} index={index} />
              ))}
            </div>
          )}

          {/* View More */}
          {filteredCompanies.length > 12 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center mt-8"
            >
              <a href="/explore" className="cyber-button">
                View All Companies
              </a>
            </motion.div>
          )}
        </section>
      </div>
    </Layout>
  );
};

export default Index;
