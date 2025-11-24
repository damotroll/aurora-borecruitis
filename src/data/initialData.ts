import { ContentBlock, CandidateArchetype, RecruitmentBuilderState, Tab } from '../types';

export const SEED_CONTENT_BLOCKS: ContentBlock[] = [
  // Benefits
  {
    id: 'benefit-ai-tools',
    type: 'benefit',
    title: 'AI-Powered Productivity',
    content: 'ChatGPT Pro ($200/month) and Claude Pro ($20/month) licenses to supercharge your work. Access to cutting-edge prototyping tools (Cursor Pro, Replit Teams, Lovable, GitHub Copilot).',
    category: 'compensation',
    tags: ['ai', 'tools', 'benefits'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'benefit-learning-budget',
    type: 'benefit',
    title: 'Learning & Experimentation',
    content: '€10,000/quarter team experimentation budget. €2,000/year personal learning budget. 10% time for AI experimentation.',
    category: 'compensation',
    tags: ['learning', 'growth', 'budget'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'benefit-remote-work',
    type: 'benefit',
    title: 'Flexible Remote Work',
    content: 'Work from anywhere in the Nordics. Quarterly team meetups. Home office budget included.',
    category: 'work-life',
    tags: ['remote', 'flexibility', 'benefits'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // Requirements
  {
    id: 'req-ai-prototyping',
    type: 'requirement',
    title: 'AI Prototyping Skills',
    content: 'Portfolio of prototypes built with AI coding tools (Cursor, Lovable, Bolt, Replit). Can show concrete examples of how AI improved your product work (time saved, insights gained, prototypes built).',
    category: 'ai-fluency',
    tags: ['ai', 'prototyping', 'portfolio'],
    metadata: { seniorityLevel: ['mid', 'senior', 'principal'] },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'req-hungry-curious',
    type: 'requirement',
    title: 'Hungry & Curious Mindset',
    content: 'Extreme curiosity about the world around you. Continuous learner who swiftly adapts to market changes. Intellectually humble—admit when you don\'t know and dive in to learn.',
    category: 'mindset',
    tags: ['culture-fit', 'learning', 'curiosity'],
    metadata: { seniorityLevel: ['mid', 'senior', 'principal'] },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // Skills
  {
    id: 'skill-api-design',
    type: 'skill',
    title: 'API Design & Development',
    content: 'Strong understanding of REST APIs, webhooks, authentication (OAuth 2.0, API keys). Experience with API documentation and developer experience.',
    category: 'technical',
    tags: ['api', 'technical', 'platform'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'skill-product-management',
    type: 'skill',
    title: 'Project Management',
    content: 'Experience leading cross-functional teams. Strong stakeholder management. Data-driven decision making.',
    category: 'core',
    tags: ['management', 'leadership'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'skill-ux-design',
    type: 'skill',
    title: 'UI/X Design',
    content: 'Understanding of user-centered design principles. Experience with design tools. Ability to create wireframes and prototypes.',
    category: 'design',
    tags: ['design', 'ux', 'ui'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // Red Flags
  {
    id: 'redflag-vague-ai',
    type: 'red_flag',
    title: 'Vague AI Experience',
    content: 'Claims AI experience but only "used ChatGPT once to summarize a meeting." Can\'t name specific daily AI tools. No portfolio of prototypes.',
    category: 'screening',
    tags: ['ai', 'red-flag'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // Questions
  {
    id: 'question-prototyping',
    type: 'question',
    title: 'Prototyping Assessment',
    content: 'Walk me through a recent project where you built something with AI tools. What did you build, what tools did you use, and how long did it take?',
    category: 'interview',
    tags: ['ai', 'prototyping', 'technical'],
    metadata: { weight: 5 },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // Evaluation Criteria
  {
    id: 'criteria-technical-fluency',
    type: 'evaluation_criteria',
    title: 'Technical Fluency',
    content: 'AI/ML concept understanding. Prototyping tool experience. Data literacy.',
    category: 'scoring',
    tags: ['technical', 'evaluation'],
    metadata: { scoreRange: [1, 5] },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const CANDIDATE_ARCHETYPES: CandidateArchetype[] = [
  {
    id: 'archetype-mid-pm',
    name: 'Mid-Level PM (Team-Embedded)',
    description: 'PM who runs high-performing squad, ships iteratively, role-models AI',
    seniorityLevel: 'mid',
    baselineSkillIds: ['skill-product-management', 'skill-api-design'],
    baselineRequirementIds: ['req-ai-prototyping', 'req-hungry-curious'],
    sourceDocument: '/Research/pm-mid-embedded-perplexity.md'
  },
  {
    id: 'archetype-senior-pm',
    name: 'Senior PM (Cross-Product, AI Chapter Leader)',
    description: 'Strategic PM with multi-quarter vision, AI Chapter co-leadership',
    seniorityLevel: 'senior',
    baselineSkillIds: ['skill-product-management', 'skill-api-design'],
    baselineRequirementIds: ['req-ai-prototyping', 'req-hungry-curious'],
    sourceDocument: '/Research/pm-senior-cross-team-perplexity.md'
  },
  {
    id: 'archetype-principal-pm',
    name: 'Principal PM (Platform & AI Enablement)',
    description: 'Technical PM owning platform strategy, org-wide AI enablement',
    seniorityLevel: 'principal',
    baselineSkillIds: ['skill-product-management', 'skill-api-design', 'skill-ux-design'],
    baselineRequirementIds: ['req-ai-prototyping', 'req-hungry-curious'],
    sourceDocument: '/Research/pm-principal-platform-ai-perplexity.md'
  }
];

// Default tabs for each module
const DEFAULT_TABS: Tab[] = [
  {
    id: 'tab-profiles-default',
    name: 'Profiles',
    moduleType: 'profiles',
    state: { profiles: [], selectedProfileId: null },
    createdAt: new Date().toISOString()
  },
  {
    id: 'tab-jobads-default',
    name: 'Job Ads',
    moduleType: 'jobads',
    state: { jobAds: [], selectedJobAdId: null },
    createdAt: new Date().toISOString()
  },
  {
    id: 'tab-casestudies-default',
    name: 'Case Studies',
    moduleType: 'casestudies',
    state: { caseStudies: [], selectedCaseStudyId: null },
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_STATE: RecruitmentBuilderState = {
  contentBlocks: SEED_CONTENT_BLOCKS,
  candidateArchetypes: CANDIDATE_ARCHETYPES,
  tabs: DEFAULT_TABS,
  activeTabId: 'tab-profiles-default',
  activeModule: 'profiles',
  darkMode: true,
  libraryFilter: {}
};
