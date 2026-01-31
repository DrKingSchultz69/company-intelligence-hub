import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { GitCompare, X, Plus } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { SearchInput } from '@/components/ui/SearchInput';
import { useCompanies } from '@/hooks/useCompanies';
import type { Company } from '@/types/company';
import { cn } from '@/lib/utils';

const comparisonFields = [
  { key: 'category', label: 'Category', section: 'Overview' },
  { key: 'employee_size', label: 'Employee Size', section: 'Overview' },
  { key: 'incorporation_year', label: 'Founded', section: 'Overview' },
  { key: 'work_culture_summary', label: 'Work Culture', section: 'Culture' },
  { key: 'hiring_velocity', label: 'Hiring Velocity', section: 'Culture' },
  { key: 'avg_retention_tenure', label: 'Retention', section: 'Culture' },
  { key: 'psychological_safety', label: 'Psych Safety', section: 'Culture' },
  { key: 'burnout_risk', label: 'Burnout Risk', section: 'Culture' },
  { key: 'fixed_vs_variable_pay', label: 'Pay Structure', section: 'Compensation' },
  { key: 'esops_incentives', label: 'ESOPs', section: 'Compensation' },
  { key: 'leave_policy', label: 'Leave Policy', section: 'Compensation' },
  { key: 'remote_policy_details', label: 'Remote Policy', section: 'Compensation' },
  { key: 'learning_culture', label: 'Learning Culture', section: 'Growth' },
  { key: 'mentorship_availability', label: 'Mentorship', section: 'Growth' },
  { key: 'promotion_clarity', label: 'Promotion Clarity', section: 'Growth' },
  { key: 'exit_opportunities', label: 'Exit Opportunities', section: 'Growth' },
  { key: 'annual_revenue', label: 'Revenue', section: 'Financials' },
  { key: 'profitability_status', label: 'Profitability', section: 'Financials' },
  { key: 'valuation', label: 'Valuation', section: 'Financials' },
  { key: 'yoy_growth_rate', label: 'YoY Growth', section: 'Financials' },
  { key: 'tech_stack', label: 'Tech Stack', section: 'Technology' },
  { key: 'ai_ml_adoption_level', label: 'AI/ML Adoption', section: 'Technology' },
  { key: 'tech_adoption_rating', label: 'Tech Rating', section: 'Technology' },
];

const Compare = () => {
  const { data: companies, isLoading } = useCompanies();
  const [selectedCompanies, setSelectedCompanies] = useState<Company[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const searchResults = useMemo(() => {
    if (!companies || !searchQuery) return [];
    const query = searchQuery.toLowerCase();
    return companies
      .filter(c => 
        c.name.toLowerCase().includes(query) &&
        !selectedCompanies.find(sc => sc.id === c.id)
      )
      .slice(0, 5);
  }, [companies, searchQuery, selectedCompanies]);

  const addCompany = (company: Company) => {
    if (selectedCompanies.length < 4) {
      setSelectedCompanies([...selectedCompanies, company]);
      setSearchQuery('');
      setShowSearch(false);
    }
  };

  const removeCompany = (id: string) => {
    setSelectedCompanies(selectedCompanies.filter(c => c.id !== id));
  };

  const groupedFields = useMemo(() => {
    const groups: Record<string, typeof comparisonFields> = {};
    comparisonFields.forEach(field => {
      if (!groups[field.section]) groups[field.section] = [];
      groups[field.section].push(field);
    });
    return groups;
  }, []);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">
            <span className="gradient-text-cyber">Compare Companies</span>
          </h1>
          <p className="text-muted-foreground">
            Select up to 4 companies to compare side-by-side
          </p>
        </motion.div>

        {/* Company Selection */}
        <div className="flex flex-wrap gap-4 mb-8">
          {selectedCompanies.map(company => (
            <motion.div
              key={company.id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="glass-panel px-4 py-2 flex items-center gap-3"
            >
              <span className="font-medium">{company.name}</span>
              <button
                onClick={() => removeCompany(company.id)}
                className="p-1 rounded-full hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}

          {selectedCompanies.length < 4 && (
            <div className="relative">
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="glass-panel-hover px-4 py-2 flex items-center gap-2 text-muted-foreground hover:text-foreground"
              >
                <Plus className="w-4 h-4" />
                Add Company
              </button>

              {showSearch && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full left-0 mt-2 w-80 glass-panel p-4 z-50"
                >
                  <SearchInput
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="Search companies..."
                  />
                  {searchResults.length > 0 && (
                    <div className="mt-3 space-y-1">
                      {searchResults.map(company => (
                        <button
                          key={company.id}
                          onClick={() => addCompany(company)}
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <span className="font-medium">{company.name}</span>
                          {company.category && (
                            <span className="text-xs text-muted-foreground ml-2">
                              {company.category}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          )}
        </div>

        {/* Comparison Table */}
        {selectedCompanies.length >= 2 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-4 px-4 font-medium text-muted-foreground w-48">
                    Field
                  </th>
                  {selectedCompanies.map(company => (
                    <th key={company.id} className="text-left py-4 px-4 min-w-[200px]">
                      <div className="font-semibold text-foreground">{company.name}</div>
                      <div className="text-xs text-muted-foreground">{company.category}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.entries(groupedFields).map(([section, fields]) => (
                  <>
                    <tr key={section}>
                      <td 
                        colSpan={selectedCompanies.length + 1} 
                        className="py-4 px-4 bg-muted/20 text-sm font-semibold text-primary uppercase tracking-wider"
                      >
                        {section}
                      </td>
                    </tr>
                    {fields.map(field => (
                      <tr key={field.key} className="border-b border-border/30 hover:bg-muted/10">
                        <td className="py-3 px-4 text-sm text-muted-foreground">
                          {field.label}
                        </td>
                        {selectedCompanies.map(company => (
                          <td key={company.id} className="py-3 px-4 text-sm text-foreground/90">
                            {(company as any)[field.key] || '—'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="glass-panel p-12 text-center">
            <GitCompare className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Select companies to compare</h3>
            <p className="text-muted-foreground">
              Add at least 2 companies to see a side-by-side comparison
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Compare;
