import { RecruitmentBuilderState, CaseStudy, Tab, CaseStudyModuleState, Action } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Plus, Upload, Trash2, ChevronDown, ChevronUp, Clock, Download } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { parseMarkdown, extractSeniorityLevel, extractDomain } from '@/utils/markdownParser';
import { caseStudyToMarkdown, downloadFile, toSafeFilename } from '@/utils/exportUtils';
import { useRef, useState } from 'react';

interface CaseStudiesModuleProps {
  state: RecruitmentBuilderState;
  dispatch: React.Dispatch<Action>;
  activeTab: Tab;
  moduleState: CaseStudyModuleState;
}

const CaseStudiesModule = ({ state, dispatch, activeTab, moduleState }: CaseStudiesModuleProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [expandedCaseStudies, setExpandedCaseStudies] = useState<Set<string>>(new Set());

  const caseStudies = moduleState.caseStudies;

  const handleImportMarkdown = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const markdown = e.target?.result as string;
      const parsed = parseMarkdown(markdown);

      const scenarioSection = parsed.sections.find(s =>
        s.heading.toLowerCase().includes('scenario') ||
        s.heading.toLowerCase().includes('context') ||
        s.heading.toLowerCase().includes('background')
      );

      const questionsSection = parsed.sections.find(s =>
        s.heading.toLowerCase().includes('question')
      );

      const criteriaSection = parsed.sections.find(s =>
        s.heading.toLowerCase().includes('criteria') ||
        s.heading.toLowerCase().includes('evaluation')
      );

      const newCaseStudy: CaseStudy = {
        id: `case-${Date.now()}`,
        title: parsed.title,
        seniorityLevel: extractSeniorityLevel(parsed.rawContent) as 'mid' | 'senior' | 'principal',
        domain: extractDomain(parsed.rawContent),
        candidateProfileId: null,
        scenario: {
          context: scenarioSection?.content.trim() || '',
          challenge: '',
          constraints: []
        },
        questionIds: [],
        evaluationCriteriaIds: [],
        customQuestions: questionsSection ? [{
          id: `custom-q-${Date.now()}`,
          text: questionsSection.content.trim(),
          type: 'open-ended' as const,
          position: 0
        }] : [],
        customCriteria: criteriaSection ? [{
          id: `custom-c-${Date.now()}`,
          name: criteriaSection.heading,
          description: criteriaSection.content.trim(),
          lookingFor: [],
          redFlags: [],
          position: 0
        }] : [],
        duration: 90,
        deliverables: [],
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      dispatch({ type: 'ADD_CASE_STUDY', tabId: activeTab.id, caseStudy: newCaseStudy });
    };
    reader.readAsText(file);

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDeleteCaseStudy = (caseStudyId: string) => {
    dispatch({ type: 'DELETE_CASE_STUDY', tabId: activeTab.id, caseStudyId });
  };

  const handleExportCaseStudy = (caseStudy: CaseStudy) => {
    const markdown = caseStudyToMarkdown(caseStudy);
    const filename = `${toSafeFilename(caseStudy.title)}.md`;
    downloadFile(markdown, filename);
  };

  const toggleExpanded = (caseStudyId: string) => {
    setExpandedCaseStudies(prev => {
      const newSet = new Set(prev);
      if (newSet.has(caseStudyId)) {
        newSet.delete(caseStudyId);
      } else {
        newSet.add(caseStudyId);
      }
      return newSet;
    });
  };

  const getSeniorityColor = (level: string) => {
    switch (level) {
      case 'principal': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'senior': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'mid': return 'bg-green-500/20 text-green-300 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
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
      {/* Question Library */}
      <div className="lg:col-span-1">
        <Card className="glass-card rounded-3xl p-6">
          <h2 className="text-xl font-semibold mb-6">Question Library</h2>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Filter</label>
              <select className="w-full rounded-full px-4 py-2 bg-secondary/50 border border-border/50">
                <option>All Questions</option>
                <option>Technical</option>
                <option>Strategic</option>
                <option>Framework</option>
              </select>
            </div>

            <div className="pt-4 space-y-3">
              {state.contentBlocks
                .filter(b => b.type === 'question' || b.type === 'evaluation_criteria')
                .slice(0, 3)
                .map((block) => (
                  <Card
                    key={block.id}
                    className="glass-panel rounded-2xl p-4 cursor-move hover:shadow-md transition-all"
                    draggable
                  >
                    <div className="flex items-start gap-2 mb-2">
                      <FileText className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <h4 className="font-medium text-sm">{block.title}</h4>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{block.content}</p>
                  </Card>
                ))}
            </div>

            <Input
              ref={fileInputRef}
              type="file"
              accept=".md,.markdown"
              onChange={handleImportMarkdown}
              className="hidden"
              id="case-import"
            />
            <Button 
              className="w-full rounded-full" 
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              Import .md File
            </Button>
            
            <Button className="w-full rounded-full" variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              New Question
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-8 pt-6 border-t border-border/30">
            <h3 className="text-sm font-medium text-muted-foreground mb-4">Statistics</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Case Studies in Tab</span>
                <span className="font-medium">{caseStudies.length}</span>
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

      {/* Main Content Area - Case Studies List */}
      <div className="lg:col-span-2 space-y-6">
        {caseStudies.length === 0 ? (
          /* Empty State */
          <Card className="glass-card rounded-3xl p-12 text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <FileText className="h-10 w-10 text-primary/60" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Case Studies Yet</h3>
            <p className="text-muted-foreground mb-6">
              Create a new case study or import from a markdown file to get started.
            </p>
            <div className="flex gap-3 justify-center">
              <Button variant="default" className="rounded-full">
                <Plus className="mr-2 h-4 w-4" />
                New Case Study
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
          /* Case Studies List */
          caseStudies.map((caseStudy) => (
            <Card
              key={caseStudy.id}
              className="glass-card rounded-3xl p-6 hover:shadow-lg transition-all"
            >
              <div className="flex items-start gap-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shrink-0">
                  <FileText className="h-8 w-8 text-primary" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-semibold mb-2 truncate">{caseStudy.title}</h3>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge
                          variant="outline"
                          className={`rounded-full ${getSeniorityColor(caseStudy.seniorityLevel)}`}
                        >
                          {caseStudy.seniorityLevel}
                        </Badge>
                        <Badge variant="outline" className="rounded-full">
                          {caseStudy.domain}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={`rounded-full ${getStatusColor(caseStudy.status)}`}
                        >
                          {caseStudy.status}
                        </Badge>
                        <Badge variant="outline" className="rounded-full flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {caseStudy.duration} min
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full h-8 w-8"
                        onClick={() => toggleExpanded(caseStudy.id)}
                      >
                        {expandedCaseStudies.has(caseStudy.id) ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full h-8 w-8"
                        onClick={() => handleExportCaseStudy(caseStudy)}
                        title="Export to Markdown"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleDeleteCaseStudy(caseStudy.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="text-sm text-muted-foreground">
                    {caseStudy.customQuestions.length} question{caseStudy.customQuestions.length !== 1 ? 's' : ''}
                    {caseStudy.customCriteria.length > 0 && ` • ${caseStudy.customCriteria.length} criteria`}
                  </div>

                  {/* Expanded Content */}
                  {expandedCaseStudies.has(caseStudy.id) && (
                    <div className="mt-4 pt-4 border-t border-border/30 space-y-4">
                      {caseStudy.scenario.context && (
                        <div>
                          <h4 className="font-medium text-sm mb-2">Scenario Context</h4>
                          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                            {caseStudy.scenario.context.substring(0, 500)}
                            {caseStudy.scenario.context.length > 500 && '...'}
                          </p>
                        </div>
                      )}
                      {caseStudy.customQuestions.length > 0 && (
                        <div>
                          <h4 className="font-medium text-sm mb-2">Questions</h4>
                          {caseStudy.customQuestions.map((question, idx) => (
                            <p key={question.id} className="text-sm text-muted-foreground mb-2">
                              {idx + 1}. {question.text.substring(0, 200)}
                              {question.text.length > 200 && '...'}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Metadata */}
                  <div className="mt-3 text-xs text-muted-foreground">
                    Created {new Date(caseStudy.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default CaseStudiesModule;
