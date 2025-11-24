import type {
  RecruitmentBuilderState,
  Action,
  Tab,
  ProfileModuleState,
  JobAdModuleState,
  CaseStudyModuleState
} from '../types';

export function appReducer(
  state: RecruitmentBuilderState,
  action: Action
): RecruitmentBuilderState {
  switch (action.type) {
    // ========================================
    // TAB MANAGEMENT
    // ========================================

    case 'ADD_TAB': {
      const newTab: Tab = {
        id: `tab-${Date.now()}`,
        name: action.name || `New ${action.moduleType} Tab`,
        moduleType: action.moduleType,
        state:
          action.moduleType === 'profiles'
            ? { profiles: [], selectedProfileId: null }
            : action.moduleType === 'jobads'
            ? { jobAds: [], selectedJobAdId: null }
            : { caseStudies: [], selectedCaseStudyId: null },
        createdAt: new Date().toISOString()
      };

      return {
        ...state,
        tabs: [...state.tabs, newTab],
        activeTabId: newTab.id
      };
    }

    case 'REMOVE_TAB': {
      const newTabs = state.tabs.filter((tab) => tab.id !== action.tabId);
      const wasActive = state.activeTabId === action.tabId;

      return {
        ...state,
        tabs: newTabs,
        activeTabId: wasActive && newTabs.length > 0 ? newTabs[0].id : null
      };
    }

    case 'RENAME_TAB': {
      return {
        ...state,
        tabs: state.tabs.map((tab) =>
          tab.id === action.tabId ? { ...tab, name: action.name } : tab
        )
      };
    }

    case 'CLONE_TAB': {
      const tabToClone = state.tabs.find((tab) => tab.id === action.tabId);
      if (!tabToClone) return state;

      const clonedTab: Tab = {
        id: `tab-${Date.now()}`,
        name: `${tabToClone.name} (Copy)`,
        moduleType: tabToClone.moduleType,
        state: JSON.parse(JSON.stringify(tabToClone.state)),
        createdAt: new Date().toISOString()
      };

      return {
        ...state,
        tabs: [...state.tabs, clonedTab],
        activeTabId: clonedTab.id
      };
    }

    case 'SET_ACTIVE_TAB': {
      return {
        ...state,
        activeTabId: action.tabId
      };
    }

    // ========================================
    // MODULE NAVIGATION
    // ========================================

    case 'SET_ACTIVE_MODULE': {
      // When switching modules, try to select the first tab of that module type
      const moduleTabs = state.tabs.filter(
        (tab) => action.module !== 'library' && tab.moduleType === action.module
      );
      const firstTabOfModule = moduleTabs.length > 0 ? moduleTabs[0].id : null;

      return {
        ...state,
        activeModule: action.module,
        activeTabId: action.module === 'library' ? state.activeTabId : (firstTabOfModule || state.activeTabId)
      };
    }

    // ========================================
    // CONTENT BLOCK OPERATIONS
    // ========================================

    case 'ADD_CONTENT_BLOCK': {
      return {
        ...state,
        contentBlocks: [...state.contentBlocks, action.block]
      };
    }

    case 'UPDATE_CONTENT_BLOCK': {
      return {
        ...state,
        contentBlocks: state.contentBlocks.map((block) =>
          block.id === action.blockId ? { ...block, ...action.updates } : block
        )
      };
    }

    case 'DELETE_CONTENT_BLOCK': {
      return {
        ...state,
        contentBlocks: state.contentBlocks.filter(
          (block) => block.id !== action.blockId
        )
      };
    }

    // ========================================
    // CANDIDATE PROFILE OPERATIONS
    // ========================================

    case 'ADD_PROFILE': {
      return {
        ...state,
        tabs: state.tabs.map((tab) => {
          if (tab.id !== action.tabId || tab.moduleType !== 'profiles')
            return tab;

          const profileState = tab.state as ProfileModuleState;
          return {
            ...tab,
            state: {
              ...profileState,
              profiles: [...profileState.profiles, action.profile],
              selectedProfileId: action.profile.id
            }
          };
        })
      };
    }

    case 'UPDATE_PROFILE': {
      return {
        ...state,
        tabs: state.tabs.map((tab) => {
          if (tab.id !== action.tabId || tab.moduleType !== 'profiles')
            return tab;

          const profileState = tab.state as ProfileModuleState;
          return {
            ...tab,
            state: {
              ...profileState,
              profiles: profileState.profiles.map((profile) =>
                profile.id === action.profileId
                  ? { ...profile, ...action.updates, updatedAt: new Date().toISOString() }
                  : profile
              )
            }
          };
        })
      };
    }

    case 'DELETE_PROFILE': {
      return {
        ...state,
        tabs: state.tabs.map((tab) => {
          if (tab.id !== action.tabId || tab.moduleType !== 'profiles')
            return tab;

          const profileState = tab.state as ProfileModuleState;
          return {
            ...tab,
            state: {
              ...profileState,
              profiles: profileState.profiles.filter(
                (profile) => profile.id !== action.profileId
              ),
              selectedProfileId:
                profileState.selectedProfileId === action.profileId
                  ? null
                  : profileState.selectedProfileId
            }
          };
        })
      };
    }

    case 'SELECT_PROFILE': {
      return {
        ...state,
        tabs: state.tabs.map((tab) => {
          if (tab.id !== action.tabId || tab.moduleType !== 'profiles')
            return tab;

          const profileState = tab.state as ProfileModuleState;
          return {
            ...tab,
            state: {
              ...profileState,
              selectedProfileId: action.profileId
            }
          };
        })
      };
    }

    // ========================================
    // JOB AD OPERATIONS
    // ========================================

    case 'ADD_JOB_AD': {
      return {
        ...state,
        tabs: state.tabs.map((tab) => {
          if (tab.id !== action.tabId || tab.moduleType !== 'jobads') return tab;

          const jobAdState = tab.state as JobAdModuleState;
          return {
            ...tab,
            state: {
              ...jobAdState,
              jobAds: [...jobAdState.jobAds, action.jobAd],
              selectedJobAdId: action.jobAd.id
            }
          };
        })
      };
    }

    case 'UPDATE_JOB_AD': {
      return {
        ...state,
        tabs: state.tabs.map((tab) => {
          if (tab.id !== action.tabId || tab.moduleType !== 'jobads') return tab;

          const jobAdState = tab.state as JobAdModuleState;
          return {
            ...tab,
            state: {
              ...jobAdState,
              jobAds: jobAdState.jobAds.map((jobAd) =>
                jobAd.id === action.jobAdId
                  ? { ...jobAd, ...action.updates, updatedAt: new Date().toISOString() }
                  : jobAd
              )
            }
          };
        })
      };
    }

    case 'DELETE_JOB_AD': {
      return {
        ...state,
        tabs: state.tabs.map((tab) => {
          if (tab.id !== action.tabId || tab.moduleType !== 'jobads') return tab;

          const jobAdState = tab.state as JobAdModuleState;
          return {
            ...tab,
            state: {
              ...jobAdState,
              jobAds: jobAdState.jobAds.filter(
                (jobAd) => jobAd.id !== action.jobAdId
              ),
              selectedJobAdId:
                jobAdState.selectedJobAdId === action.jobAdId
                  ? null
                  : jobAdState.selectedJobAdId
            }
          };
        })
      };
    }

    case 'SELECT_JOB_AD': {
      return {
        ...state,
        tabs: state.tabs.map((tab) => {
          if (tab.id !== action.tabId || tab.moduleType !== 'jobads') return tab;

          const jobAdState = tab.state as JobAdModuleState;
          return {
            ...tab,
            state: {
              ...jobAdState,
              selectedJobAdId: action.jobAdId
            }
          };
        })
      };
    }

    // ========================================
    // CASE STUDY OPERATIONS
    // ========================================

    case 'ADD_CASE_STUDY': {
      return {
        ...state,
        tabs: state.tabs.map((tab) => {
          if (tab.id !== action.tabId || tab.moduleType !== 'casestudies')
            return tab;

          const caseStudyState = tab.state as CaseStudyModuleState;
          return {
            ...tab,
            state: {
              ...caseStudyState,
              caseStudies: [...caseStudyState.caseStudies, action.caseStudy],
              selectedCaseStudyId: action.caseStudy.id
            }
          };
        })
      };
    }

    case 'UPDATE_CASE_STUDY': {
      return {
        ...state,
        tabs: state.tabs.map((tab) => {
          if (tab.id !== action.tabId || tab.moduleType !== 'casestudies')
            return tab;

          const caseStudyState = tab.state as CaseStudyModuleState;
          return {
            ...tab,
            state: {
              ...caseStudyState,
              caseStudies: caseStudyState.caseStudies.map((caseStudy) =>
                caseStudy.id === action.caseStudyId
                  ? { ...caseStudy, ...action.updates, updatedAt: new Date().toISOString() }
                  : caseStudy
              )
            }
          };
        })
      };
    }

    case 'DELETE_CASE_STUDY': {
      return {
        ...state,
        tabs: state.tabs.map((tab) => {
          if (tab.id !== action.tabId || tab.moduleType !== 'casestudies')
            return tab;

          const caseStudyState = tab.state as CaseStudyModuleState;
          return {
            ...tab,
            state: {
              ...caseStudyState,
              caseStudies: caseStudyState.caseStudies.filter(
                (caseStudy) => caseStudy.id !== action.caseStudyId
              ),
              selectedCaseStudyId:
                caseStudyState.selectedCaseStudyId === action.caseStudyId
                  ? null
                  : caseStudyState.selectedCaseStudyId
            }
          };
        })
      };
    }

    case 'SELECT_CASE_STUDY': {
      return {
        ...state,
        tabs: state.tabs.map((tab) => {
          if (tab.id !== action.tabId || tab.moduleType !== 'casestudies')
            return tab;

          const caseStudyState = tab.state as CaseStudyModuleState;
          return {
            ...tab,
            state: {
              ...caseStudyState,
              selectedCaseStudyId: action.caseStudyId
            }
          };
        })
      };
    }

    // ========================================
    // UI OPERATIONS
    // ========================================

    case 'TOGGLE_DARK_MODE': {
      return {
        ...state,
        darkMode: !state.darkMode
      };
    }

    case 'SET_LIBRARY_FILTER': {
      return {
        ...state,
        libraryFilter: {
          ...state.libraryFilter,
          ...action.filter
        }
      };
    }

    // ========================================
    // DATA IMPORT/EXPORT
    // ========================================

    case 'IMPORT_STATE': {
      return {
        ...state,
        ...action.state
      };
    }

    case 'RESET_STATE': {
      return state;
    }

    default:
      return state;
  }
}
