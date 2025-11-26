import { RecruitmentBuilderState, JobAd, Tab, JobAdModuleState, Action } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Briefcase, Upload, Trash2, ChevronDown, ChevronUp, Download } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { parseMarkdown, extractDomain } from '@/utils/markdownParser';
import { jobAdToMarkdown, downloadFile, toSafeFilename } from '@/utils/exportUtils';
import { useRef, useState } from 'react';
import NewJobAdDialog from '@/components/dialogs/NewJobAdDialog';
import NewContentBlockDialog from '@/components/dialogs/NewContentBlockDialog';

interface JobAdsModuleProps {
  state: RecruitmentBuilderState;
  dispatch: React.Dispatch<Action>;
  activeTab: Tab;
  moduleState: JobAdModuleState;
}

const JobAdsModule = ({ state, dispatch, activeTab, moduleState }: JobAdsModuleProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [expandedJobAds, setExpandedJobAds] = useState<Set<string>>(new Set());
  const [isNewJobAdDialogOpen, setIsNewJobAdDialogOpen] = useState(false);
  const [isNewBlockDialogOpen, setIsNewBlockDialogOpen] = useState(false);
  const [typeFilter, setTypeFilter] = useState('');

  const jobAds = moduleState.jobAds;

  // Filter content blocks for sidebar
  const filteredBlocks = state.contentBlocks.filter(block => {
    if (!typeFilter) return true;
    return block.type === typeFilter;
  });

  const handleImportMarkdown = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const markdown = e.target?.result as string;
      const parsed = parseMarkdown(markdown);

      const newJobAd: JobAd = {
        id: `jobad-${Date.now()}`,
        title: parsed.title,
        specialization: extractDomain(parsed.rawContent),
        candidateProfileId: null,
        sections: parsed.sections.map((section, index) => ({
          id: `section-${Date.now()}-${index}`,
          title: section.heading,
          position: index,
          contentType: 'custom' as const,
          customContent: section.content.trim()
        })),
        hiringManager: {
          name: '',
          title: '',
          message: ''
        },
        variableSubstitutions: {},
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      dispatch({ type: 'ADD_JOB_AD', tabId: activeTab.id, jobAd: newJobAd });
    };
    reader.readAsText(file);

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDeleteJobAd = (jobAdId: string) => {
    dispatch({ type: 'DELETE_JOB_AD', tabId: activeTab.id, jobAdId });
  };

  const handleExportJobAd = (jobAd: JobAd) => {
    const markdown = jobAdToMarkdown(jobAd);
    const filename = `${toSafeFilename(jobAd.title)}.md`;
    downloadFile(markdown, filename);
  };

  const toggleExpanded = (jobAdId: string) => {
    setExpandedJobAds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(jobAdId)) {
        newSet.delete(jobAdId);
      } else {
        newSet.add(jobAdId);
      }
      return newSet;
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'archived': return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
      default: return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    }
  };
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Content Library */}
      <div className="lg:col-span-1">
        <Card className="glass-card rounded-3xl p-6">
          <h2 className="text-xl font-semibold mb-6">Content Library</h2>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Filter by Type</label>
              <select
                className="w-full rounded-full px-4 py-2 bg-secondary/50 border border-border/50"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="">All Types</option>
                <option value="benefit">Benefits</option>
                <option value="requirement">Requirements</option>
                <option value="skill">Skills</option>
              </select>
            </div>

            <div className="pt-4 space-y-3">
              {filteredBlocks.slice(0, 5).map((block) => (
                <Card
                  key={block.id}
                  className="glass-panel rounded-2xl p-4 cursor-move hover:shadow-md transition-all"
                  draggable
                >
                  <h4 className="font-medium text-sm mb-1">{block.title}</h4>
                  <p className="text-xs text-muted-foreground line-clamp-2">{block.content}</p>
                  <div className="flex gap-2 mt-2">
                    {block.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                        {tag}
                      </span>
                    ))}
                  </div>
                </Card>
              ))}
            </div>

            <Input
              ref={fileInputRef}
              type="file"
              accept=".md,.markdown"
              onChange={handleImportMarkdown}
              className="hidden"
              id="jobad-import"
            />
            <Button 
              className="w-full rounded-full" 
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              Import .md File
            </Button>
            
            <Button
              className="w-full rounded-full"
              variant="outline"
              onClick={() => setIsNewBlockDialogOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              New Block
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-8 pt-6 border-t border-border/30">
            <h3 className="text-sm font-medium text-muted-foreground mb-4">Statistics</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Job Ads in Tab</span>
                <span className="font-medium">{jobAds.length}</span>
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

      {/* Main Content Area - Job Ads List */}
      <div className="lg:col-span-2 space-y-6">
        {jobAds.length === 0 ? (
          /* Empty State */
          <Card className="glass-card rounded-3xl p-12 text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <Briefcase className="h-10 w-10 text-primary/60" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Job Ads Yet</h3>
            <p className="text-muted-foreground mb-6">
              Create a new job ad or import from a markdown file to get started.
            </p>
            <div className="flex gap-3 justify-center">
              <Button
                variant="default"
                className="rounded-full"
                onClick={() => setIsNewJobAdDialogOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                New Job Ad
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
          /* Job Ads List */
          jobAds.map((jobAd) => (
            <Card
              key={jobAd.id}
              className="glass-card rounded-3xl p-6 hover:shadow-lg transition-all"
            >
              <div className="flex items-start gap-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shrink-0">
                  <Briefcase className="h-8 w-8 text-primary" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-semibold mb-2 truncate">{jobAd.title}</h3>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge
                          variant="outline"
                          className={`rounded-full ${getStatusColor(jobAd.status)}`}
                        >
                          {jobAd.status}
                        </Badge>
                        <Badge variant="outline" className="rounded-full">
                          {jobAd.specialization}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full h-8 w-8"
                        onClick={() => toggleExpanded(jobAd.id)}
                      >
                        {expandedJobAds.has(jobAd.id) ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full h-8 w-8"
                        onClick={() => handleExportJobAd(jobAd)}
                        title="Export to Markdown"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleDeleteJobAd(jobAd.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Sections Preview */}
                  {jobAd.sections.length > 0 && (
                    <div className="text-sm text-muted-foreground">
                      {jobAd.sections.length} section{jobAd.sections.length !== 1 ? 's' : ''} defined
                    </div>
                  )}

                  {/* Expanded Content */}
                  {expandedJobAds.has(jobAd.id) && jobAd.sections.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-border/30 space-y-4">
                      {jobAd.sections.map((section) => (
                        <div key={section.id}>
                          <h4 className="font-medium text-sm mb-2">{section.title}</h4>
                          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                            {section.customContent?.substring(0, 500)}
                            {(section.customContent?.length || 0) > 500 && '...'}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Metadata */}
                  <div className="mt-3 text-xs text-muted-foreground">
                    Created {new Date(jobAd.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Dialogs */}
      <NewJobAdDialog
        isOpen={isNewJobAdDialogOpen}
        onClose={() => setIsNewJobAdDialogOpen(false)}
        dispatch={dispatch}
        tabId={activeTab.id}
      />

      <NewContentBlockDialog
        isOpen={isNewBlockDialogOpen}
        onClose={() => setIsNewBlockDialogOpen(false)}
        dispatch={dispatch}
      />
    </div>
  );
};

export default JobAdsModule;
