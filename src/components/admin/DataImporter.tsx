import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Check, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

// CSV column mapping to database columns
const columnMapping: Record<string, string> = {
  company_id: 'company_id',
  company_type: 'company_type',
  name: 'name',
  short_name: 'short_name',
  logo_url: 'logo_url',
  category: 'category',
  incorporation_year: 'incorporation_year',
  overview_text: 'overview_text',
  nature_of_company: 'nature_of_company',
  headquarters_address: 'headquarters_address',
  operating_countries: 'operating_countries',
  office_count: 'office_count',
  office_locations: 'office_locations',
  employee_size: 'employee_size',
  vision_statement: 'vision_statement',
  mission_statement: 'mission_statement',
  core_values: 'core_values',
  history_timeline: 'history_timeline',
  recent_news: 'recent_news',
  website_url: 'website_url',
  linkedin_url: 'linkedin_url',
  twitter_handle: 'twitter_handle',
  facebook_url: 'facebook_url',
  instagram_url: 'instagram_url',
  primary_contact_email: 'primary_contact_email',
  primary_phone_number: 'primary_phone_number',
  regulatory_status: 'regulatory_status',
  legal_issues: 'legal_issues',
  esg_ratings: 'esg_ratings',
  supply_chain_dependencies: 'supply_chain_dependencies',
  geopolitical_risks: 'geopolitical_risks',
  macro_risks: 'macro_risks',
  carbon_footprint: 'carbon_footprint',
  ethical_sourcing: 'ethical_sourcing',
  marketing_video_url: 'marketing_video_url',
  customer_testimonials: 'customer_testimonials',
  website_quality: 'website_quality',
  website_rating: 'website_rating',
  website_traffic_rank: 'website_traffic_rank',
  social_media_followers: 'social_media_followers',
  glassdoor_rating: 'glassdoor_rating',
  indeed_rating: 'indeed_rating',
  google_rating: 'google_rating',
  awards_recognitions: 'awards_recognitions',
  brand_sentiment_score: 'brand_sentiment_score',
  event_participation: 'event_participation',
  pain_points_addressed: 'pain_points_addressed',
  focus_sectors: 'focus_sectors',
  offerings_description: 'offerings_description',
  top_customers: 'top_customers',
  core_value_proposition: 'core_value_proposition',
  unique_differentiators: 'unique_differentiators',
  competitive_advantages: 'competitive_advantages',
  weaknesses_gaps: 'weaknesses_gaps',
  key_challenges_needs: 'key_challenges_needs',
  key_competitors: 'key_competitors',
  market_share_percentage: 'market_share_percentage',
  sales_motion: 'sales_motion',
  customer_concentration_risk: 'customer_concentration_risk',
  exit_strategy_history: 'exit_strategy_history',
  benchmark_vs_peers: 'benchmark_vs_peers',
  future_projections: 'future_projections',
  strategic_priorities: 'strategic_priorities',
  industry_associations: 'industry_associations',
  case_studies: 'case_studies',
  go_to_market_strategy: 'go_to_market_strategy',
  innovation_roadmap: 'innovation_roadmap',
  product_pipeline: 'product_pipeline',
  tam: 'tam',
  sam: 'sam',
  som: 'som',
  leave_policy: 'leave_policy',
  health_support: 'health_support',
  fixed_vs_variable_pay: 'fixed_vs_variable_pay',
  bonus_predictability: 'bonus_predictability',
  esops_incentives: 'esops_incentives',
  family_health_insurance: 'family_health_insurance',
  relocation_support: 'relocation_support',
  lifestyle_benefits: 'lifestyle_benefits',
  hiring_velocity: 'hiring_velocity',
  employee_turnover: 'employee_turnover',
  avg_retention_tenure: 'avg_retention_tenure',
  diversity_metrics: 'diversity_metrics',
  work_culture_summary: 'work_culture_summary',
  manager_quality: 'manager_quality',
  psychological_safety: 'psychological_safety',
  feedback_culture: 'feedback_culture',
  diversity_inclusion_score: 'diversity_inclusion_score',
  ethical_standards: 'ethical_standards',
  burnout_risk: 'burnout_risk',
  layoff_history: 'layoff_history',
  mission_clarity: 'mission_clarity',
  sustainability_csr: 'sustainability_csr',
  crisis_behavior: 'crisis_behavior',
  annual_revenue: 'annual_revenue',
  annual_profit: 'annual_profit',
  revenue_mix: 'revenue_mix',
  valuation: 'valuation',
  yoy_growth_rate: 'yoy_growth_rate',
  profitability_status: 'profitability_status',
  key_investors: 'key_investors',
  recent_funding_rounds: 'recent_funding_rounds',
  total_capital_raised: 'total_capital_raised',
  customer_acquisition_cost: 'customer_acquisition_cost',
  customer_lifetime_value: 'customer_lifetime_value',
  cac_ltv_ratio: 'cac_ltv_ratio',
  churn_rate: 'churn_rate',
  net_promoter_score: 'net_promoter_score',
  burn_rate: 'burn_rate',
  runway_months: 'runway_months',
  burn_multiplier: 'burn_multiplier',
  remote_policy_details: 'remote_policy_details',
  typical_hours: 'typical_hours',
  overtime_expectations: 'overtime_expectations',
  weekend_work: 'weekend_work',
  flexibility_level: 'flexibility_level',
  location_centrality: 'location_centrality',
  public_transport_access: 'public_transport_access',
  cab_policy: 'cab_policy',
  airport_commute_time: 'airport_commute_time',
  office_zone_type: 'office_zone_type',
  area_safety: 'area_safety',
  safety_policies: 'safety_policies',
  infrastructure_safety: 'infrastructure_safety',
  emergency_preparedness: 'emergency_preparedness',
  ceo_name: 'ceo_name',
  ceo_linkedin_url: 'ceo_linkedin_url',
  key_leaders: 'key_leaders',
  warm_intro_pathways: 'warm_intro_pathways',
  decision_maker_access: 'decision_maker_access',
  contact_person_name: 'contact_person_name',
  contact_person_title: 'contact_person_title',
  contact_person_email: 'contact_person_email',
  contact_person_phone: 'contact_person_phone',
  board_members: 'board_members',
  training_spend: 'training_spend',
  onboarding_quality: 'onboarding_quality',
  learning_culture: 'learning_culture',
  exposure_quality: 'exposure_quality',
  mentorship_availability: 'mentorship_availability',
  internal_mobility: 'internal_mobility',
  promotion_clarity: 'promotion_clarity',
  tools_access: 'tools_access',
  role_clarity: 'role_clarity',
  early_ownership: 'early_ownership',
  work_impact: 'work_impact',
  execution_thinking_balance: 'execution_thinking_balance',
  automation_level: 'automation_level',
  cross_functional_exposure: 'cross_functional_exposure',
  company_maturity: 'company_maturity',
  brand_value: 'brand_value',
  client_quality: 'client_quality',
  exit_opportunities: 'exit_opportunities',
  skill_relevance: 'skill_relevance',
  external_recognition: 'external_recognition',
  network_strength: 'network_strength',
  global_exposure: 'global_exposure',
  technology_partners: 'technology_partners',
  intellectual_property: 'intellectual_property',
  r_and_d_investment: 'r_and_d_investment',
  ai_ml_adoption_level: 'ai_ml_adoption_level',
  tech_stack: 'tech_stack',
  cybersecurity_posture: 'cybersecurity_posture',
  partnership_ecosystem: 'partnership_ecosystem',
  tech_adoption_rating: 'tech_adoption_rating',
};

function parseCSV(csvText: string): Record<string, any>[] {
  const lines = csvText.split('\n');
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim());
  const records: Record<string, any>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;

    // Handle quoted fields with commas
    const values: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '"' && (j === 0 || line[j - 1] !== '\\')) {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());

    const record: Record<string, any> = {};
    headers.forEach((header, index) => {
      const dbColumn = columnMapping[header];
      if (dbColumn && values[index]) {
        let value = values[index].replace(/^"|"$/g, '').trim();
        
        // Handle numeric fields
        if (dbColumn === 'company_id' || dbColumn === 'incorporation_year') {
          const num = parseInt(value, 10);
          record[dbColumn] = isNaN(num) ? null : num;
        } else {
          record[dbColumn] = value || null;
        }
      }
    });

    if (record.name) {
      records.push(record);
    }
  }

  return records;
}

interface DataImporterProps {
  onImportComplete?: () => void;
}

export function DataImporter({ onImportComplete }: DataImporterProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const importData = async () => {
    setStatus('loading');
    setMessage('Fetching CSV data...');

    try {
      // Fetch the CSV file
      const response = await fetch('/data/companies.csv');
      if (!response.ok) {
        throw new Error('Failed to fetch CSV file');
      }

      const csvText = await response.text();
      setMessage('Parsing CSV...');

      const records = parseCSV(csvText);
      if (records.length === 0) {
        throw new Error('No valid records found in CSV');
      }

      setMessage(`Importing ${records.length} companies...`);

      // Insert directly using Supabase client
      const batchSize = 20;
      let insertedCount = 0;

      for (let i = 0; i < records.length; i += batchSize) {
        const batch = records.slice(i, i + batchSize) as any[];
        
        const { error } = await supabase
          .from('company')
          .upsert(batch, { onConflict: 'company_id' });

        if (error) {
          console.error('Batch insert error:', error);
          throw error;
        }

        insertedCount += batch.length;
        setMessage(`Imported ${insertedCount}/${records.length} companies...`);
      }

      setStatus('success');
      setMessage(`Successfully imported ${insertedCount} companies!`);
      onImportComplete?.();
    } catch (error: any) {
      setStatus('error');
      setMessage(error.message || 'Import failed');
      console.error('Import error:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-panel p-6 text-center"
    >
      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
        {status === 'loading' && <Loader2 className="w-8 h-8 text-primary animate-spin" />}
        {status === 'success' && <Check className="w-8 h-8 text-success" />}
        {status === 'error' && <AlertCircle className="w-8 h-8 text-destructive" />}
        {status === 'idle' && <Upload className="w-8 h-8 text-primary" />}
      </div>

      <h3 className="text-xl font-semibold mb-2">
        {status === 'idle' && 'Import Company Data'}
        {status === 'loading' && 'Importing...'}
        {status === 'success' && 'Import Complete!'}
        {status === 'error' && 'Import Failed'}
      </h3>

      <p className="text-muted-foreground mb-4">{message || 'Load company data from CSV file'}</p>

      {status === 'idle' && (
        <button onClick={importData} className="cyber-button">
          <Upload className="w-4 h-4 mr-2 inline" />
          Import Data
        </button>
      )}

      {status === 'error' && (
        <button onClick={importData} className="cyber-button">
          Try Again
        </button>
      )}
    </motion.div>
  );
}
