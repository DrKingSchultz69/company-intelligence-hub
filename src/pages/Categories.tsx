import { useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { CategoryTile } from '@/components/ui/CategoryTile';
import { CompanyCard } from '@/components/ui/CompanyCard';
import { CategoryTileSkeleton, CompanyCardSkeleton } from '@/components/ui/LoadingSkeleton';
import { NoDataAvailable } from '@/components/ui/EmptyState';
import { useCompanies, useCompanyStats } from '@/hooks/useCompanies';

const Categories = () => {
  const { data: companies, isLoading } = useCompanies();
  const { stats } = useCompanyStats();
  const [searchParams] = useSearchParams();
  const filterCategory = searchParams.get('filter');

  const categories = useMemo(() => {
    return Object.entries(stats.byCategory)
      .sort((a, b) => b[1] - a[1]);
  }, [stats.byCategory]);

  const filteredCompanies = useMemo(() => {
    if (!companies || !filterCategory) return [];
    return companies.filter(c => c.category === filterCategory);
  }, [companies, filterCategory]);

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="h-10 w-48 skeleton-cyber rounded mb-8" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <CategoryTileSkeleton key={i} />
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">
            <span className="gradient-text-cyber">
              {filterCategory ? `${filterCategory} Companies` : 'All Categories'}
            </span>
          </h1>
          <p className="text-muted-foreground">
            {filterCategory 
              ? `Browse ${filteredCompanies.length} companies in ${filterCategory}`
              : 'Explore companies organized by category'
            }
          </p>
        </motion.div>

        {filterCategory ? (
          <>
            {/* Back to categories */}
            <Link 
              to="/categories" 
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-6"
            >
              ← Back to all categories
            </Link>

            {/* Filtered companies */}
            {filteredCompanies.length === 0 ? (
              <NoDataAvailable />
            ) : (
              <div className="data-grid">
                {filteredCompanies.map((company, index) => (
                  <CompanyCard key={company.id} company={company} index={index} />
                ))}
              </div>
            )}
          </>
        ) : (
          /* All categories grid */
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
        )}
      </div>
    </Layout>
  );
};

export default Categories;
