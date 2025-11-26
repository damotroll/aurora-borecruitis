import { useState } from 'react';
import { CaseStudy, Action } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface NewCaseStudyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  dispatch: React.Dispatch<Action>;
  tabId: string;
}

const SENIORITY_LEVELS: { value: CaseStudy['seniorityLevel']; label: string }[] = [
  { value: 'mid', label: 'Mid-Level' },
  { value: 'senior', label: 'Senior' },
  { value: 'principal', label: 'Principal' },
];

const DOMAINS = [
  'Product Management',
  'Engineering',
  'Design',
  'Data Science',
  'Marketing',
  'Sales',
  'Operations',
  'Platform',
  'Strategy',
  'AI/ML',
  'Other',
];

const DURATIONS = [
  { value: 30, label: '30 minutes' },
  { value: 45, label: '45 minutes' },
  { value: 60, label: '60 minutes' },
  { value: 90, label: '90 minutes' },
  { value: 120, label: '120 minutes' },
];

export default function NewCaseStudyDialog({
  isOpen,
  onClose,
  dispatch,
  tabId,
}: NewCaseStudyDialogProps) {
  const [title, setTitle] = useState('');
  const [seniorityLevel, setSeniorityLevel] = useState<CaseStudy['seniorityLevel']>('senior');
  const [domain, setDomain] = useState('Product Management');
  const [duration, setDuration] = useState(90);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return;

    const newCaseStudy: CaseStudy = {
      id: `case-${Date.now()}`,
      title: title.trim(),
      seniorityLevel,
      domain,
      candidateProfileId: null,
      scenario: {
        context: '',
        challenge: '',
        constraints: [],
      },
      questionIds: [],
      evaluationCriteriaIds: [],
      customQuestions: [],
      customCriteria: [],
      duration,
      deliverables: [],
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    dispatch({ type: 'ADD_CASE_STUDY', tabId, caseStudy: newCaseStudy });
    handleClose();
  };

  const handleClose = () => {
    setTitle('');
    setSeniorityLevel('senior');
    setDomain('Product Management');
    setDuration(90);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>New Case Study</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="case-title">Case Study Title</Label>
            <Input
              id="case-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Product Strategy Case"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="case-seniority">Seniority Level</Label>
              <select
                id="case-seniority"
                value={seniorityLevel}
                onChange={(e) => setSeniorityLevel(e.target.value as CaseStudy['seniorityLevel'])}
                className="w-full rounded-md px-3 py-2 bg-secondary/50 border border-border/50"
              >
                {SENIORITY_LEVELS.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="case-domain">Domain</Label>
              <select
                id="case-domain"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="w-full rounded-md px-3 py-2 bg-secondary/50 border border-border/50"
              >
                {DOMAINS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="case-duration">Duration</Label>
            <select
              id="case-duration"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full rounded-md px-3 py-2 bg-secondary/50 border border-border/50"
            >
              {DURATIONS.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">Create Case Study</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
