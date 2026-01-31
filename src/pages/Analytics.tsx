import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, PieChart, TrendingUp, Users } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { useCompanies, useCompanyStats } from '@/hooks/useCompanies';
import { 
  ResponsiveContainer, 
  PieChart as RechartsPie, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  Legend
} from 'recharts';

const COLORS = ['#00d4ff', '#8b5cf6', '#ff006e', '#00ff88', '#ffcc00', '#ff6600'];

const Analytics = () => {
  const { data: companies, isLoading } = useCompanies();
  const { stats } = useCompanyStats();

  const categoryData = useMemo(() => {
    return Object.entries(stats.byCategory).map(([name, value]) => ({ name, value }));
  }, [stats.byCategory]);

  const profitabilityData = useMemo(() => {
    return Object.entries(stats.byProfitability).map(([name, value]) => ({ name, value }));
  }, [stats.byProfitability]);

  const remotePolicyData = useMemo(() => {
    return Object.entries(stats.byRemotePolicy).map(([name, value]) => ({ name, value }));
  }, [stats.byRemotePolicy]);

  const hiringData = useMemo(() => {
    if (!companies) return [];
    const byVelocity: Record<string, number> = {};
    companies.forEach(c => {
      if (c.hiring_velocity) {
        const key = c.hiring_velocity.includes('15,000') ? 'High' : 
                    c.hiring_velocity.includes('1,000') ? 'Medium' : 'Active';
        byVelocity[key] = (byVelocity[key] || 0) + 1;
      }
    });
    return Object.entries(byVelocity).map(([name, value]) => ({ name, value }));
  }, [companies]);

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="h-10 w-48 skeleton-cyber rounded mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="glass-panel p-6 h-80 skeleton-cyber" />
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
            <span className="gradient-text-cyber">Analytics Dashboard</span>
          </h1>
          <p className="text-muted-foreground">
            Visualize placement intelligence data across all companies
          </p>
        </motion.div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-panel p-6"
          >
            <h3 className="flex items-center gap-2 text-lg font-semibold mb-4">
              <PieChart className="w-5 h-5 text-primary" />
              Distribution by Category
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPie>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    labelLine={false}
                  >
                    {categoryData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(225 30% 8%)', 
                      border: '1px solid hsl(220 25% 18%)',
                      borderRadius: '8px'
                    }}
                  />
                </RechartsPie>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Hiring Velocity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-panel p-6"
          >
            <h3 className="flex items-center gap-2 text-lg font-semibold mb-4">
              <TrendingUp className="w-5 h-5 text-primary" />
              Hiring Velocity Trends
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hiringData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 25% 18%)" />
                  <XAxis dataKey="name" stroke="hsl(215 20% 55%)" fontSize={12} />
                  <YAxis stroke="hsl(215 20% 55%)" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(225 30% 8%)', 
                      border: '1px solid hsl(220 25% 18%)',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="value" fill="#00d4ff" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Profitability Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-panel p-6"
          >
            <h3 className="flex items-center gap-2 text-lg font-semibold mb-4">
              <BarChart3 className="w-5 h-5 text-primary" />
              Profitability Status
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={profitabilityData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 25% 18%)" />
                  <XAxis type="number" stroke="hsl(215 20% 55%)" fontSize={12} />
                  <YAxis dataKey="name" type="category" stroke="hsl(215 20% 55%)" fontSize={12} width={80} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(225 30% 8%)', 
                      border: '1px solid hsl(220 25% 18%)',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="value" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Remote Policy Mix */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-panel p-6"
          >
            <h3 className="flex items-center gap-2 text-lg font-semibold mb-4">
              <Users className="w-5 h-5 text-primary" />
              Remote Policy Distribution
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPie>
                  <Pie
                    data={remotePolicyData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                    labelLine={false}
                  >
                    {remotePolicyData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(225 30% 8%)', 
                      border: '1px solid hsl(220 25% 18%)',
                      borderRadius: '8px'
                    }}
                  />
                </RechartsPie>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Summary Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-panel p-6 mt-6"
        >
          <h3 className="text-lg font-semibold mb-4">Quick Insights</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
              <div className="text-2xl font-bold text-primary">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Total Companies</div>
            </div>
            <div className="p-4 rounded-lg bg-secondary/10 border border-secondary/20">
              <div className="text-2xl font-bold text-secondary">{Object.keys(stats.byCategory).length}</div>
              <div className="text-sm text-muted-foreground">Categories</div>
            </div>
            <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
              <div className="text-2xl font-bold text-accent">{stats.byProfitability['Profitable'] || 0}</div>
              <div className="text-sm text-muted-foreground">Profitable</div>
            </div>
            <div className="p-4 rounded-lg bg-success/10 border border-success/20">
              <div className="text-2xl font-bold text-success">{stats.byRemotePolicy['Remote/Hybrid'] || 0}</div>
              <div className="text-sm text-muted-foreground">Remote-Friendly</div>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Analytics;
