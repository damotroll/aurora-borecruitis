import { useState } from 'react';
import { CandidateProfile, Action } from '@/types';
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

interface NewProfileDialogProps {
  isOpen: boolean;
  onClose: () => void;
  dispatch: React.Dispatch<Action>;
  tabId: string;
}

const SENIORITY_LEVELS: { value: CandidateProfile['seniorityLevel']; label: string }[] = [
  { value: 'junior', label: 'Junior' },
  { value: 'mid', label: 'Mid-Level' },
  { value: 'senior', label: 'Senior' },
  { value: 'staff', label: 'Staff' },
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
  'Infrastructure',
  'Security',
  'AI/ML',
  'Other',
];

export default function NewProfileDialog({
  isOpen,
  onClose,
  dispatch,
  tabId,
}: NewProfileDialogProps) {
  const [name, setName] = useState('');
  const [seniorityLevel, setSeniorityLevel] = useState<CandidateProfile['seniorityLevel']>('mid');
  const [domain, setDomain] = useState('Product Management');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) return;

    const newProfile: CandidateProfile = {
      id: `profile-${Date.now()}`,
      name: name.trim(),
      archetypeId: null,
      seniorityLevel,
      domain,
      requiredSkillIds: [],
      preferredSkillIds: [],
      requiredExperienceIds: [],
      aiToolRequirementIds: [],
      responsibilityIds: [],
      redFlagIds: [],
      customSections: [],
      notes: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    dispatch({ type: 'ADD_PROFILE', tabId, profile: newProfile });
    handleClose();
  };

  const handleClose = () => {
    setName('');
    setSeniorityLevel('mid');
    setDomain('Product Management');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>New Candidate Profile</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="profile-name">Profile Name</Label>
            <Input
              id="profile-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Senior Product Manager"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="seniority">Seniority Level</Label>
              <select
                id="seniority"
                value={seniorityLevel}
                onChange={(e) => setSeniorityLevel(e.target.value as CandidateProfile['seniorityLevel'])}
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
              <Label htmlFor="domain">Domain</Label>
              <select
                id="domain"
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

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">Create Profile</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
