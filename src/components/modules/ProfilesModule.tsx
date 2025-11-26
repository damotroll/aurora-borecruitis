import { RecruitmentBuilderState, CandidateProfile, Tab, ProfileModuleState, Action } from '@/types';
import { Button } from '@/components/ui/button';
import { Plus, User, Upload, Trash2, ChevronDown, ChevronUp, Download } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { parseMarkdown, extractSeniorityLevel, extractDomain } from '@/utils/markdownParser';
import { profileToMarkdown, downloadFile, toSafeFilename } from '@/utils/exportUtils';
import { useRef, useState } from 'react';
import NewProfileDialog from '@/components/dialogs/NewProfileDialog';

interface ProfilesModuleProps {
  state: RecruitmentBuilderState;
  dispatch: React.Dispatch<Action>;
  activeTab: Tab;
  moduleState: ProfileModuleState;
}

const ProfilesModule = ({ state, dispatch, activeTab, moduleState }: ProfilesModuleProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [expandedProfiles, setExpandedProfiles] = useState<Set<string>>(new Set());
  const [isNewProfileDialogOpen, setIsNewProfileDialogOpen] = useState(false);

  const profiles = moduleState.profiles;

  const handleImportMarkdown = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const markdown = e.target?.result as string;
      const parsed = parseMarkdown(markdown);

      const newProfile: CandidateProfile = {
        id: `profile-${Date.now()}`,
        name: parsed.title,
        archetypeId: null,
        seniorityLevel: extractSeniorityLevel(parsed.rawContent),
        domain: extractDomain(parsed.rawContent),
        requiredSkillIds: [],
        preferredSkillIds: [],
        requiredExperienceIds: [],
        aiToolRequirementIds: [],
        responsibilityIds: [],
        redFlagIds: [],
        customSections: parsed.sections.map((section, index) => ({
          id: `custom-${Date.now()}-${index}`,
          title: section.heading,
          content: section.content.trim(),
          position: index
        })),
        notes: parsed.rawContent,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      dispatch({ type: 'ADD_PROFILE', tabId: activeTab.id, profile: newProfile });
    };
    reader.readAsText(file);

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDeleteProfile = (profileId: string) => {
    dispatch({ type: 'DELETE_PROFILE', tabId: activeTab.id, profileId });
  };

  const handleExportProfile = (profile: CandidateProfile) => {
    const markdown = profileToMarkdown(profile);
    const filename = `${toSafeFilename(profile.name)}.md`;
    downloadFile(markdown, filename);
  };

  const toggleExpanded = (profileId: string) => {
    setExpandedProfiles(prev => {
      const newSet = new Set(prev);
      if (newSet.has(profileId)) {
        newSet.delete(profileId);
      } else {
        newSet.add(profileId);
      }
      return newSet;
    });
  };

  const getSeniorityColor = (level: string) => {
    switch (level) {
      case 'principal': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'staff': return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';
      case 'senior': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'mid': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'junior': return 'bg-teal-500/20 text-teal-300 border-teal-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Sidebar - Builder Tools */}
      <div className="lg:col-span-1">
        <Card className="glass-card rounded-3xl p-6">
          <h2 className="text-xl font-semibold mb-6">Builder Tools</h2>

          <div className="space-y-3">
            <Button
              className="w-full justify-start rounded-full"
              variant="default"
              onClick={() => setIsNewProfileDialogOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              New Candidate Profile
            </Button>

            <Input
              ref={fileInputRef}
              type="file"
              accept=".md,.markdown"
              onChange={handleImportMarkdown}
              className="hidden"
              id="profile-import"
            />
            <Button
              className="w-full justify-start rounded-full"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              Import .md File
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-8 pt-6 border-t border-border/30">
            <h3 className="text-sm font-medium text-muted-foreground mb-4">Statistics</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Profiles in Tab</span>
                <span className="font-medium">{profiles.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Content Blocks</span>
                <span className="font-medium">{state.contentBlocks.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Active Tab</span>
                <span className="font-medium truncate max-w-[120px]">{activeTab.name}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content Area - Profiles List */}
      <div className="lg:col-span-2 space-y-6">
        {profiles.length === 0 ? (
          /* Empty State */
          <Card className="glass-card rounded-3xl p-12 text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <User className="h-10 w-10 text-primary/60" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Candidate Profiles Yet</h3>
            <p className="text-muted-foreground mb-6">
              Create a new profile or import from a markdown file to get started.
            </p>
            <div className="flex gap-3 justify-center">
              <Button
                variant="default"
                className="rounded-full"
                onClick={() => setIsNewProfileDialogOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                New Profile
              </Button>
              <Button
                variant="outline"
                className="rounded-full"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                Import .md
              </Button>
            </div>
          </Card>
        ) : (
          /* Profiles List */
          profiles.map((profile) => (
            <Card
              key={profile.id}
              className="glass-card rounded-3xl p-6 hover:shadow-lg transition-all"
            >
              <div className="flex items-start gap-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shrink-0">
                  <User className="h-8 w-8 text-primary" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-semibold mb-2 truncate">{profile.name}</h3>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge
                          variant="outline"
                          className={`rounded-full ${getSeniorityColor(profile.seniorityLevel)}`}
                        >
                          {profile.seniorityLevel}
                        </Badge>
                        <Badge variant="outline" className="rounded-full">
                          {profile.domain}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full h-8 w-8"
                        onClick={() => toggleExpanded(profile.id)}
                      >
                        {expandedProfiles.has(profile.id) ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full h-8 w-8"
                        onClick={() => handleExportProfile(profile)}
                        title="Export to Markdown"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleDeleteProfile(profile.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Custom Sections Preview */}
                  {profile.customSections.length > 0 && (
                    <div className="text-sm text-muted-foreground">
                      {profile.customSections.length} section{profile.customSections.length !== 1 ? 's' : ''} imported
                    </div>
                  )}

                  {/* Expanded Content */}
                  {expandedProfiles.has(profile.id) && profile.customSections.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-border/30 space-y-4">
                      {profile.customSections.map((section) => (
                        <div key={section.id}>
                          <h4 className="font-medium text-sm mb-2">{section.title}</h4>
                          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                            {section.content.substring(0, 500)}
                            {section.content.length > 500 && '...'}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Metadata */}
                  <div className="mt-3 text-xs text-muted-foreground">
                    Created {new Date(profile.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Dialogs */}
      <NewProfileDialog
        isOpen={isNewProfileDialogOpen}
        onClose={() => setIsNewProfileDialogOpen(false)}
        dispatch={dispatch}
        tabId={activeTab.id}
      />
    </div>
  );
};

export default ProfilesModule;
