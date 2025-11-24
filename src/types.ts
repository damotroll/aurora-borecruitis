// ============================================
// SHARED CONTENT LIBRARY
// ============================================

export interface ContentBlock {
  id: string;
  type: 'skill' | 'requirement' | 'benefit' | 'value' | 'question' |
        'evaluation_criteria' | 'process_step' | 'red_flag' | 'experience' |
        'ai_tool' | 'responsibility';
  title: string;
  content: string;
  category: string;
  tags: string[];
  metadata?: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
}

// ============================================
// MODULE 1: CANDIDATE PROFILE BUILDER
// ============================================

export interface CandidateProfile {
  id: string;
  name: string;
  archetypeId: string | null;
  seniorityLevel: 'junior' | 'mid' | 'senior' | 'principal' | 'staff';
  domain: string;

  requiredSkillIds: string[];
  preferredSkillIds: string[];
  requiredExperienceIds: string[];
  aiToolRequirementIds: string[];
  responsibilityIds: string[];
  redFlagIds: string[];

  customSections: CustomSection[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface CandidateArchetype {
  id: string;
  name: string;
  description: string;
  seniorityLevel: string;
  baselineSkillIds: string[];
  baselineRequirementIds: string[];
  sourceDocument?: string;
}

export interface CustomSection {
  id: string;
  title: string;
  content: string;
  position: number;
}

// ============================================
// MODULE 2: JOB AD BUILDER
// ============================================

export interface JobAd {
  id: string;
  title: string;
  specialization: string;
  candidateProfileId: string | null;

  sections: JobAdSection[];

  hiringManager: {
    name: string;
    title: string;
    message: string;
  };

  variableSubstitutions: Record<string, string>;

  status: 'draft' | 'active' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface JobAdSection {
  id: string;
  title: string;
  position: number;
  contentType: 'library' | 'custom' | 'variable';
  contentBlockIds?: string[];
  customContent?: string;
  variableName?: string;
}

// ============================================
// MODULE 3: CASE STUDY BUILDER
// ============================================

export interface CaseStudy {
  id: string;
  title: string;
  seniorityLevel: 'mid' | 'senior' | 'principal';
  domain: string;
  candidateProfileId: string | null;

  scenario: {
    context: string;
    challenge: string;
    constraints: string[];
  };

  questionIds: string[];
  evaluationCriteriaIds: string[];

  customQuestions: CustomQuestion[];
  customCriteria: CustomCriteria[];

  duration: number;
  deliverables: string[];

  status: 'draft' | 'active' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface CustomQuestion {
  id: string;
  text: string;
  type: 'open-ended' | 'framework' | 'technical' | 'strategic';
  position: number;
}

export interface CustomCriteria {
  id: string;
  name: string;
  description: string;
  lookingFor: string[];
  redFlags: string[];
  position: number;
}

// ============================================
// TAB SYSTEM (Version management)
// ============================================

export interface Tab {
  id: string;
  name: string;
  moduleType: 'profiles' | 'jobads' | 'casestudies';
  state: ModuleState;
  createdAt: string;
}

export type ModuleState =
  | ProfileModuleState
  | JobAdModuleState
  | CaseStudyModuleState;

export interface ProfileModuleState {
  profiles: CandidateProfile[];
  selectedProfileId: string | null;
}

export interface JobAdModuleState {
  jobAds: JobAd[];
  selectedJobAdId: string | null;
}

export interface CaseStudyModuleState {
  caseStudies: CaseStudy[];
  selectedCaseStudyId: string | null;
}

// ============================================
// APP STATE
// ============================================

export type ModuleType = 'profiles' | 'jobads' | 'casestudies' | 'library';

export interface RecruitmentBuilderState {
  // Shared content library
  contentBlocks: ContentBlock[];

  // Archetype templates
  candidateArchetypes: CandidateArchetype[];

  // Tab system
  tabs: Tab[];
  activeTabId: string | null;

  // UI state
  activeModule: ModuleType;
  darkMode: boolean;
  libraryFilter: LibraryFilter;
}

export interface LibraryFilter {
  type?: string;
  category?: string;
  tags?: string[];
  searchQuery?: string;
}

// ============================================
// REDUCER ACTIONS
// ============================================

export type Action =
  // Tab actions
  | { type: 'ADD_TAB'; moduleType: 'profiles' | 'jobads' | 'casestudies'; name?: string }
  | { type: 'REMOVE_TAB'; tabId: string }
  | { type: 'RENAME_TAB'; tabId: string; name: string }
  | { type: 'CLONE_TAB'; tabId: string }
  | { type: 'SET_ACTIVE_TAB'; tabId: string | null }

  // Module navigation
  | { type: 'SET_ACTIVE_MODULE'; module: ModuleType }

  // Content block actions
  | { type: 'ADD_CONTENT_BLOCK'; block: ContentBlock }
  | { type: 'UPDATE_CONTENT_BLOCK'; blockId: string; updates: Partial<ContentBlock> }
  | { type: 'DELETE_CONTENT_BLOCK'; blockId: string }

  // Candidate profile actions (tab-based)
  | { type: 'ADD_PROFILE'; tabId: string; profile: CandidateProfile }
  | { type: 'UPDATE_PROFILE'; tabId: string; profileId: string; updates: Partial<CandidateProfile> }
  | { type: 'DELETE_PROFILE'; tabId: string; profileId: string }
  | { type: 'SELECT_PROFILE'; tabId: string; profileId: string | null }

  // Job ad actions (tab-based)
  | { type: 'ADD_JOB_AD'; tabId: string; jobAd: JobAd }
  | { type: 'UPDATE_JOB_AD'; tabId: string; jobAdId: string; updates: Partial<JobAd> }
  | { type: 'DELETE_JOB_AD'; tabId: string; jobAdId: string }
  | { type: 'SELECT_JOB_AD'; tabId: string; jobAdId: string | null }

  // Case study actions (tab-based)
  | { type: 'ADD_CASE_STUDY'; tabId: string; caseStudy: CaseStudy }
  | { type: 'UPDATE_CASE_STUDY'; tabId: string; caseStudyId: string; updates: Partial<CaseStudy> }
  | { type: 'DELETE_CASE_STUDY'; tabId: string; caseStudyId: string }
  | { type: 'SELECT_CASE_STUDY'; tabId: string; caseStudyId: string | null }

  // UI actions
  | { type: 'TOGGLE_DARK_MODE' }
  | { type: 'SET_LIBRARY_FILTER'; filter: Partial<LibraryFilter> }

  // Data import/export
  | { type: 'IMPORT_STATE'; state: Partial<RecruitmentBuilderState> }
  | { type: 'RESET_STATE' };
