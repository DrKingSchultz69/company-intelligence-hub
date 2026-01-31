import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Check, AlertCircle, TrendingUp } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { useCompanies } from '@/hooks/useCompanies';
import type { Company } from '@/types/company';
import { cn } from '@/lib/utils';

const Skills = () => {
  const { data: companies, isLoading } = useCompanies();
  const [skills, setSkills] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');

  const addSkill = () => {
    if (inputValue.trim() && !skills.includes(inputValue.trim().toLowerCase())) {
      setSkills([...skills, inputValue.trim().toLowerCase()]);
      setInputValue('');
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  const matchedCompanies = useMemo(() => {
    if (!companies || skills.length === 0) return [];

    return companies.map(company => {
      const techStack = company.tech_stack?.toLowerCase() || '';
      const aiAdoption = company.ai_ml_adoption_level?.toLowerCase() || '';
      const automationLevel = company.automation_level?.toLowerCase() || '';
      const skillRelevance = company.skill_relevance?.toLowerCase() || '';

      const allText = `${techStack} ${aiAdoption} ${automationLevel} ${skillRelevance}`;

      const matchedSkills = skills.filter(skill => allText.includes(skill));
      const matchScore = skills.length > 0 ? (matchedSkills.length / skills.length) * 100 : 0;

      return {
        company,
        matchedSkills,
        unmatchedSkills: skills.filter(s => !matchedSkills.includes(s)),
        matchScore,
        fitLevel: matchScore >= 70 ? 'High' : matchScore >= 40 ? 'Medium' : 'Low',
      };
    })
    .filter(m => m.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore);
  }, [companies, skills]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">
            <span className="gradient-text-cyber">Skill Mapping</span>
          </h1>
          <p className="text-muted-foreground">
            Enter your skills to find matching companies based on their tech stack and requirements
          </p>
        </motion.div>

        {/* Skill Input */}
        <div className="glass-panel p-6 mb-8">
          <label className="block text-sm font-medium text-muted-foreground mb-3">
            Add your skills
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addSkill()}
              placeholder="e.g., React, Python, AWS, TensorFlow..."
              className="flex-1 px-4 py-3 rounded-xl bg-muted/30 border border-border/50 text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
            />
            <button onClick={addSkill} className="cyber-button">
              Add Skill
            </button>
          </div>

          {/* Skills Tags */}
          {skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {skills.map(skill => (
                <span key={skill} className="cyber-tag flex items-center gap-2">
                  {skill}
                  <button
                    onClick={() => removeSkill(skill)}
                    className="hover:text-destructive transition-colors"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Results */}
        {skills.length === 0 ? (
          <div className="glass-panel p-12 text-center">
            <Cpu className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Enter your skills</h3>
            <p className="text-muted-foreground">
              Add skills to see which companies match your profile
            </p>
          </div>
        ) : matchedCompanies.length === 0 ? (
          <div className="glass-panel p-12 text-center">
            <AlertCircle className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No matches found</h3>
            <p className="text-muted-foreground">
              Try adding different skills or check your spelling
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Found <span className="text-foreground font-medium">{matchedCompanies.length}</span> matching companies
            </p>

            {matchedCompanies.map(({ company, matchedSkills, unmatchedSkills, matchScore, fitLevel }, index) => (
              <motion.div
                key={company.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass-panel-hover p-6"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-foreground">{company.name}</h3>
                      <span className={cn(
                        "px-2 py-0.5 rounded text-xs font-medium",
                        fitLevel === 'High' && "bg-success/20 text-success",
                        fitLevel === 'Medium' && "bg-warning/20 text-warning",
                        fitLevel === 'Low' && "bg-muted text-muted-foreground"
                      )}>
                        {fitLevel} Fit
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      {matchedSkills.map(skill => (
                        <span key={skill} className="cyber-tag text-xs">
                          <Check className="w-3 h-3 mr-1" />
                          {skill}
                        </span>
                      ))}
                      {unmatchedSkills.map(skill => (
                        <span key={skill} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-muted/50 text-muted-foreground border border-border/30">
                          {skill}
                        </span>
                      ))}
                    </div>

                    {company.tech_stack && (
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        <span className="text-foreground/70">Tech: </span>
                        {company.tech_stack}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Match Score */}
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{Math.round(matchScore)}%</div>
                      <div className="text-xs text-muted-foreground">Match</div>
                    </div>

                    <a
                      href={`/company/${company.id}`}
                      className="cyber-button text-xs py-2"
                    >
                      View Details
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Preparation Tips */}
        {matchedCompanies.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="glass-panel p-6 mt-8"
          >
            <h3 className="flex items-center gap-2 text-lg font-semibold mb-4">
              <TrendingUp className="w-5 h-5 text-primary" />
              Skill Gaps to Focus On
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              Based on your matches, consider developing these skills:
            </p>
            <div className="flex flex-wrap gap-2">
              {['Cloud Architecture', 'System Design', 'Leadership', 'Data Analytics']
                .filter(s => !skills.includes(s.toLowerCase()))
                .map(skill => (
                  <span key={skill} className="cyber-tag-accent text-xs">
                    {skill}
                  </span>
                ))
              }
            </div>
          </motion.div>
        )}
      </div>
    </Layout>
  );
};

export default Skills;
