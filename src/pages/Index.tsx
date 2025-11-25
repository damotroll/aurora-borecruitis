import { useReducer, useEffect } from 'react';
import { ModuleType, RecruitmentBuilderState, Tab, ProfileModuleState, JobAdModuleState, CaseStudyModuleState, Action } from '@/types';
import { INITIAL_STATE, SEED_CONTENT_BLOCKS, CANDIDATE_ARCHETYPES } from '@/data/initialData';
import { appReducer } from '@/state/appReducer';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Plus, X } from 'lucide-react';
import ProfilesModule from '@/components/modules/ProfilesModule';
import JobAdsModule from '@/components/modules/JobAdsModule';
import CaseStudiesModule from '@/components/modules/CaseStudiesModule';
import LibraryModule from '@/components/modules/LibraryModule';

const STORAGE_KEY = 'aurora-boreacrutis-state';

function loadInitialState(): RecruitmentBuilderState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);

      // Handle migration from old flat state to new tab-based state
      if (parsed.candidateProfiles && !parsed.tabs) {
        // Old format - migrate to new format
        const migratedTabs: Tab[] = [
          {
            id: 'tab-profiles-migrated',
            name: 'Profiles (Migrated)',
            moduleType: 'profiles',
            state: {
              profiles: parsed.candidateProfiles || [],
              selectedProfileId: null
            },
            createdAt: new Date().toISOString()
          },
          {
            id: 'tab-jobads-migrated',
            name: 'Job Ads',
            moduleType: 'jobads',
            state: { jobAds: parsed.jobAds || [], selectedJobAdId: null },
            createdAt: new Date().toISOString()
          },
          {
            id: 'tab-casestudies-migrated',
            name: 'Case Studies',
            moduleType: 'casestudies',
            state: { caseStudies: parsed.caseStudies || [], selectedCaseStudyId: null },
            createdAt: new Date().toISOString()
          }
        ];

        return {
          ...INITIAL_STATE,
          contentBlocks: parsed.contentBlocks?.length > 0 ? parsed.contentBlocks : SEED_CONTENT_BLOCKS,
          candidateArchetypes: parsed.candidateArchetypes?.length > 0 ? parsed.candidateArchetypes : CANDIDATE_ARCHETYPES,
          tabs: migratedTabs,
          activeTabId: 'tab-profiles-migrated',
          activeModule: parsed.activeModule || 'profiles',
          darkMode: parsed.darkMode ?? true,
          libraryFilter: parsed.libraryFilter || {}
        };
      }

      // New format - merge with defaults
      return {
        ...INITIAL_STATE,
        ...parsed,
        contentBlocks: parsed.contentBlocks?.length > 0 ? parsed.contentBlocks : SEED_CONTENT_BLOCKS,
        candidateArchetypes: parsed.candidateArchetypes?.length > 0 ? parsed.candidateArchetypes : CANDIDATE_ARCHETYPES,
        tabs: parsed.tabs?.length > 0 ? parsed.tabs : INITIAL_STATE.tabs,
        libraryFilter: parsed.libraryFilter || {}
      };
    }
  } catch (error) {
    console.error('Failed to load state from localStorage:', error);
  }
  return INITIAL_STATE;
}

const Index = () => {
  const [state, dispatch] = useReducer(appReducer, null, loadInitialState);

  // Persist to localStorage on state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Failed to save state to localStorage:', error);
    }
  }, [state]);

  // Apply dark mode class
  useEffect(() => {
    if (state.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.darkMode]);

  // Get tabs for current module
  const currentModuleTabs = state.tabs.filter(
    (tab) => tab.moduleType === state.activeModule
  );

  // Get active tab
  const activeTab = state.tabs.find((tab) => tab.id === state.activeTabId);

  // Handle adding a new tab
  const handleAddTab = () => {
    if (state.activeModule !== 'library') {
      dispatch({
        type: 'ADD_TAB',
        moduleType: state.activeModule as 'profiles' | 'jobads' | 'casestudies'
      });
    }
  };

  const renderModule = () => {
    if (state.activeModule === 'library') {
      return <LibraryModule state={state} dispatch={dispatch} />;
    }

    if (!activeTab || activeTab.moduleType !== state.activeModule) {
      // No active tab for this module
      return (
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-muted-foreground mb-4">No tab selected</p>
          <Button onClick={handleAddTab} className="rounded-full">
            <Plus className="mr-2 h-4 w-4" />
            Create New Tab
          </Button>
        </div>
      );
    }

    switch (state.activeModule) {
      case 'profiles':
        return (
          <ProfilesModule
            state={state}
            dispatch={dispatch}
            activeTab={activeTab}
            moduleState={activeTab.state as ProfileModuleState}
          />
        );
      case 'jobads':
        return (
          <JobAdsModule
            state={state}
            dispatch={dispatch}
            activeTab={activeTab}
            moduleState={activeTab.state as JobAdModuleState}
          />
        );
      case 'casestudies':
        return (
          <CaseStudiesModule
            state={state}
            dispatch={dispatch}
            activeTab={activeTab}
            moduleState={activeTab.state as CaseStudyModuleState}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-panel border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Aurora Boreacrutis
              </h1>

              <Tabs
                value={state.activeModule}
                onValueChange={(v) => dispatch({ type: 'SET_ACTIVE_MODULE', module: v as ModuleType })}
              >
                <TabsList className="glass-card">
                  <TabsTrigger value="profiles" className="rounded-full">
                    Candidate Profiles
                  </TabsTrigger>
                  <TabsTrigger value="jobads" className="rounded-full">
                    Job Ads
                  </TabsTrigger>
                  <TabsTrigger value="casestudies" className="rounded-full">
                    Case Interviews
                  </TabsTrigger>
                  <TabsTrigger value="library" className="rounded-full">
                    Library
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => dispatch({ type: 'TOGGLE_DARK_MODE' })}
              className="rounded-full"
            >
              {state.darkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Version Tabs Bar (for non-library modules) */}
      {state.activeModule !== 'library' && (
        <div className="border-b bg-background/50 backdrop-blur-sm">
          <div className="container mx-auto px-6">
            <div className="flex items-center gap-1 py-2 overflow-x-auto">
              {currentModuleTabs.map((tab) => (
                <div
                  key={tab.id}
                  className={`
                    group flex items-center gap-2 px-4 py-2 rounded-full text-sm cursor-pointer transition-all
                    ${tab.id === state.activeTabId
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-secondary/50 text-muted-foreground'
                    }
                  `}
                  onClick={() => dispatch({ type: 'SET_ACTIVE_TAB', tabId: tab.id })}
                >
                  <span className="truncate max-w-[150px]">{tab.name}</span>
                  {currentModuleTabs.length > 1 && (
                    <button
                      className={`
                        opacity-0 group-hover:opacity-100 transition-opacity
                        hover:text-destructive
                        ${tab.id === state.activeTabId ? 'text-primary-foreground/70' : ''}
                      `}
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch({ type: 'REMOVE_TAB', tabId: tab.id });
                      }}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              ))}
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full h-8 px-3"
                onClick={handleAddTab}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {renderModule()}
      </main>
    </div>
  );
};

export default Index;
