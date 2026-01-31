import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Building2, Users, MapPin, Globe, Calendar, 
  Briefcase, DollarSign, Heart, Clock, Shield, User, 
  GraduationCap, Cpu, ExternalLink, Mail, Phone, Linkedin
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { DetailSection, DataField, DataGrid } from '@/components/company/DetailSection';
import { useCompany } from '@/hooks/useCompanies';

const CompanyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: company, isLoading, error } = useCompany(id || '');

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 w-32 skeleton-cyber rounded" />
            <div className="glass-panel p-8">
              <div className="flex gap-6">
                <div className="w-24 h-24 skeleton-cyber rounded-xl" />
                <div className="flex-1 space-y-4">
                  <div className="h-8 w-64 skeleton-cyber rounded" />
                  <div className="h-4 w-full skeleton-cyber rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !company) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Link to="/explore" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-8">
            <ArrowLeft className="w-4 h-4" />
            Back to Explore
          </Link>
          <div className="glass-panel p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">Company not found</h2>
            <p className="text-muted-foreground">The company you're looking for doesn't exist.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link to="/explore" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Explore
        </Link>

        {/* Company Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-6 md:p-8 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-6">
            {/* Logo */}
            <div className="w-24 h-24 rounded-xl bg-muted/50 flex items-center justify-center overflow-hidden border border-border/50 flex-shrink-0">
              {company.logo_url ? (
                <img 
                  src={company.logo_url} 
                  alt={company.name}
                  className="w-16 h-16 object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <Building2 className="w-10 h-10 text-muted-foreground" />
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-wrap items-start gap-3 mb-3">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                  {company.name}
                </h1>
                {company.category && (
                  <span className="cyber-tag-secondary">{company.category}</span>
                )}
                {company.profitability_status && (
                  <span className={`cyber-tag ${company.profitability_status === 'Profitable' ? 'bg-success/10 text-success border-success/30' : ''}`}>
                    {company.profitability_status}
                  </span>
                )}
              </div>

              {company.short_name && company.short_name !== company.name && (
                <p className="text-muted-foreground mb-2">{company.short_name}</p>
              )}

              <p className="text-foreground/80 mb-4 line-clamp-3">{company.overview_text}</p>

              {/* Quick Info */}
              <div className="flex flex-wrap gap-4 text-sm">
                {company.employee_size && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="w-4 h-4 text-primary" />
                    {company.employee_size}
                  </div>
                )}
                {company.headquarters_address && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4 text-accent" />
                    {company.headquarters_address}
                  </div>
                )}
                {company.incorporation_year && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4 text-secondary" />
                    Founded {company.incorporation_year}
                  </div>
                )}
                {company.website_url && (
                  <a 
                    href={company.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary hover:text-primary/80"
                  >
                    <Globe className="w-4 h-4" />
                    Website
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>

            {/* Realtime indicator */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="realtime-dot" />
              <span>Live</span>
            </div>
          </div>
        </motion.div>

        {/* Detail Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Section 1 - Company Overview */}
          <DetailSection title="Company Overview" icon={Building2} id="overview">
            <DataGrid>
              <DataField label="Name" value={company.name} />
              <DataField label="Short Name" value={company.short_name} />
              <DataField label="Category" value={company.category} />
              <DataField label="Nature of Company" value={company.nature_of_company} />
              <DataField label="Incorporation Year" value={company.incorporation_year?.toString()} />
              <DataField label="Headquarters" value={company.headquarters_address} />
              <DataField label="Operating Countries" value={company.operating_countries} />
              <DataField label="Office Count" value={company.office_count} />
              <DataField label="Office Locations" value={company.office_locations} type="list" />
              <DataField label="Employee Size" value={company.employee_size} />
              <DataField label="History" value={company.history_timeline} />
              <DataField label="Recent News" value={company.recent_news} />
            </DataGrid>
          </DetailSection>

          {/* Section 2 - Business & Market */}
          <DetailSection title="Business & Market" icon={Briefcase} id="business">
            <DataGrid>
              <DataField label="Pain Points Addressed" value={company.pain_points_addressed} />
              <DataField label="Focus Sectors" value={company.focus_sectors} type="list" />
              <DataField label="Offerings" value={company.offerings_description} type="list" />
              <DataField label="Top Customers" value={company.top_customers} type="list" />
              <DataField label="Core Value Proposition" value={company.core_value_proposition} />
              <DataField label="Unique Differentiators" value={company.unique_differentiators} />
              <DataField label="Competitive Advantages" value={company.competitive_advantages} />
              <DataField label="Weaknesses/Gaps" value={company.weaknesses_gaps} />
              <DataField label="Key Challenges" value={company.key_challenges_needs} />
              <DataField label="Key Competitors" value={company.key_competitors} type="list" />
              <DataField label="TAM" value={company.tam} />
              <DataField label="SAM" value={company.sam} />
              <DataField label="SOM" value={company.som} />
            </DataGrid>
          </DetailSection>

          {/* Section 3 - Culture, People & Work */}
          <DetailSection title="Culture & People" icon={Heart} id="culture">
            <DataGrid>
              <DataField label="Work Culture Summary" value={company.work_culture_summary} />
              <DataField label="Hiring Velocity" value={company.hiring_velocity} />
              <DataField label="Employee Turnover" value={company.employee_turnover} />
              <DataField label="Avg Retention Tenure" value={company.avg_retention_tenure} />
              <DataField label="Manager Quality" value={company.manager_quality} />
              <DataField label="Psychological Safety" value={company.psychological_safety} />
              <DataField label="Feedback Culture" value={company.feedback_culture} />
              <DataField label="Diversity Metrics" value={company.diversity_metrics} />
              <DataField label="D&I Score" value={company.diversity_inclusion_score} />
              <DataField label="Ethical Standards" value={company.ethical_standards} />
              <DataField label="Layoff History" value={company.layoff_history} />
              <DataField label="Burnout Risk" value={company.burnout_risk} />
              <DataField label="Mission Clarity" value={company.mission_clarity} />
            </DataGrid>
          </DetailSection>

          {/* Section 4 - Learning, Growth & Career */}
          <DetailSection title="Learning & Growth" icon={GraduationCap} id="learning">
            <DataGrid>
              <DataField label="Training Spend" value={company.training_spend} />
              <DataField label="Onboarding Quality" value={company.onboarding_quality} />
              <DataField label="Learning Culture" value={company.learning_culture} />
              <DataField label="Exposure Quality" value={company.exposure_quality} />
              <DataField label="Mentorship Availability" value={company.mentorship_availability} />
              <DataField label="Internal Mobility" value={company.internal_mobility} />
              <DataField label="Promotion Clarity" value={company.promotion_clarity} />
              <DataField label="Tools Access" value={company.tools_access} />
              <DataField label="Role Clarity" value={company.role_clarity} />
              <DataField label="Early Ownership" value={company.early_ownership} />
              <DataField label="Work Impact" value={company.work_impact} />
              <DataField label="Automation Level" value={company.automation_level} />
              <DataField label="Cross-functional Exposure" value={company.cross_functional_exposure} />
              <DataField label="Exit Opportunities" value={company.exit_opportunities} />
              <DataField label="Skill Relevance" value={company.skill_relevance} />
              <DataField label="Network Strength" value={company.network_strength} />
              <DataField label="Global Exposure" value={company.global_exposure} />
              <DataField label="External Recognition" value={company.external_recognition} />
            </DataGrid>
          </DetailSection>

          {/* Section 5 - Compensation & Lifestyle */}
          <DetailSection title="Compensation & Lifestyle" icon={DollarSign} id="compensation">
            <DataGrid>
              <DataField label="Fixed vs Variable Pay" value={company.fixed_vs_variable_pay} />
              <DataField label="Bonus Predictability" value={company.bonus_predictability} />
              <DataField label="ESOPs/Incentives" value={company.esops_incentives} />
              <DataField label="Family Health Insurance" value={company.family_health_insurance} />
              <DataField label="Relocation Support" value={company.relocation_support} />
              <DataField label="Leave Policy" value={company.leave_policy} />
              <DataField label="Health Support" value={company.health_support} />
              <DataField label="Lifestyle Benefits" value={company.lifestyle_benefits} />
            </DataGrid>
          </DetailSection>

          {/* Section 6 - Work Logistics & Safety */}
          <DetailSection title="Work Logistics" icon={Clock} id="logistics">
            <DataGrid>
              <DataField label="Remote Policy" value={company.remote_policy_details} />
              <DataField label="Typical Hours" value={company.typical_hours} />
              <DataField label="Overtime Expectations" value={company.overtime_expectations} />
              <DataField label="Weekend Work" value={company.weekend_work} />
              <DataField label="Flexibility Level" value={company.flexibility_level} />
              <DataField label="Location Centrality" value={company.location_centrality} />
              <DataField label="Public Transport Access" value={company.public_transport_access} />
              <DataField label="Cab Policy" value={company.cab_policy} />
              <DataField label="Airport Commute Time" value={company.airport_commute_time} />
              <DataField label="Office Zone Type" value={company.office_zone_type} />
              <DataField label="Area Safety" value={company.area_safety} />
              <DataField label="Safety Policies" value={company.safety_policies} />
              <DataField label="Infrastructure Safety" value={company.infrastructure_safety} />
              <DataField label="Emergency Preparedness" value={company.emergency_preparedness} />
            </DataGrid>
          </DetailSection>

          {/* Section 7 - Financials */}
          <DetailSection title="Financials & Stability" icon={DollarSign} id="financials">
            <DataGrid>
              <DataField label="Annual Revenue" value={company.annual_revenue} />
              <DataField label="Annual Profit" value={company.annual_profit} />
              <DataField label="Revenue Mix" value={company.revenue_mix} />
              <DataField label="Valuation" value={company.valuation} />
              <DataField label="YoY Growth Rate" value={company.yoy_growth_rate} />
              <DataField label="Profitability Status" value={company.profitability_status} />
              <DataField label="Key Investors" value={company.key_investors} type="list" />
              <DataField label="Recent Funding Rounds" value={company.recent_funding_rounds} />
              <DataField label="Total Capital Raised" value={company.total_capital_raised} />
              <DataField label="Burn Rate" value={company.burn_rate} />
              <DataField label="Runway Months" value={company.runway_months} />
              <DataField label="ESG Ratings" value={company.esg_ratings} />
              <DataField label="Geopolitical Risks" value={company.geopolitical_risks} />
              <DataField label="Macro Risks" value={company.macro_risks} />
            </DataGrid>
          </DetailSection>

          {/* Section 8 - Technology & Innovation */}
          <DetailSection title="Technology & Innovation" icon={Cpu} id="technology">
            <DataGrid>
              <DataField label="Tech Stack" value={company.tech_stack} type="list" />
              <DataField label="Technology Partners" value={company.technology_partners} type="list" />
              <DataField label="Intellectual Property" value={company.intellectual_property} />
              <DataField label="R&D Investment" value={company.r_and_d_investment} />
              <DataField label="AI/ML Adoption" value={company.ai_ml_adoption_level} />
              <DataField label="Cybersecurity Posture" value={company.cybersecurity_posture} />
              <DataField label="Innovation Roadmap" value={company.innovation_roadmap} />
              <DataField label="Product Pipeline" value={company.product_pipeline} />
              <DataField label="Tech Adoption Rating" value={company.tech_adoption_rating} />
              <DataField label="Partnership Ecosystem" value={company.partnership_ecosystem} type="list" />
            </DataGrid>
          </DetailSection>

          {/* Section 9 - Leadership & Contacts */}
          <DetailSection title="Leadership & Contacts" icon={User} id="leadership">
            <DataGrid>
              <DataField label="CEO Name" value={company.ceo_name} />
              <DataField label="CEO LinkedIn" value={company.ceo_linkedin_url} type="link" />
              <DataField label="Key Leaders" value={company.key_leaders} type="list" />
              <DataField label="Board Members" value={company.board_members} type="list" />
              <DataField label="Warm Intro Pathways" value={company.warm_intro_pathways} />
              <DataField label="Decision Maker Access" value={company.decision_maker_access} />
              <DataField label="Contact Person" value={company.contact_person_name} />
              <DataField label="Contact Title" value={company.contact_person_title} />
              <DataField label="Contact Email" value={company.contact_person_email} type="email" />
              <DataField label="Contact Phone" value={company.contact_person_phone} />
            </DataGrid>
          </DetailSection>

          {/* Section 10 - Brand & Digital Presence */}
          <DetailSection title="Brand & Presence" icon={Globe} id="brand">
            <DataGrid>
              <DataField label="Website" value={company.website_url} type="link" />
              <DataField label="Website Quality" value={company.website_quality} />
              <DataField label="Website Rating" value={company.website_rating} type="rating" />
              <DataField label="Traffic Rank" value={company.website_traffic_rank} />
              <DataField label="Social Media Followers" value={company.social_media_followers} />
              <DataField label="Glassdoor Rating" value={company.glassdoor_rating} type="rating" />
              <DataField label="Indeed Rating" value={company.indeed_rating} type="rating" />
              <DataField label="Google Rating" value={company.google_rating} type="rating" />
              <DataField label="LinkedIn" value={company.linkedin_url} type="link" />
              <DataField label="Twitter" value={company.twitter_handle} />
              <DataField label="Facebook" value={company.facebook_url} type="link" />
              <DataField label="Instagram" value={company.instagram_url} type="link" />
              <DataField label="Awards & Recognitions" value={company.awards_recognitions} type="list" />
              <DataField label="Brand Sentiment" value={company.brand_sentiment_score} />
              <DataField label="Event Participation" value={company.event_participation} type="list" />
            </DataGrid>
          </DetailSection>
        </div>
      </div>
    </Layout>
  );
};

export default CompanyDetail;
