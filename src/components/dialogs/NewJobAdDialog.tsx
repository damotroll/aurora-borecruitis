import { useState } from 'react';
import { JobAd, Action } from '@/types';
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

interface NewJobAdDialogProps {
  isOpen: boolean;
  onClose: () => void;
  dispatch: React.Dispatch<Action>;
  tabId: string;
}

const SPECIALIZATIONS = [
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

const STATUSES: { value: JobAd['status']; label: string }[] = [
  { value: 'draft', label: 'Draft' },
  { value: 'active', label: 'Active' },
  { value: 'archived', label: 'Archived' },
];

export default function NewJobAdDialog({
  isOpen,
  onClose,
  dispatch,
  tabId,
}: NewJobAdDialogProps) {
  const [title, setTitle] = useState('');
  const [specialization, setSpecialization] = useState('Product Management');
  const [status, setStatus] = useState<JobAd['status']>('draft');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return;

    const newJobAd: JobAd = {
      id: `jobad-${Date.now()}`,
      title: title.trim(),
      specialization,
      candidateProfileId: null,
      sections: [],
      hiringManager: {
        name: '',
        title: '',
        message: '',
      },
      variableSubstitutions: {},
      status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    dispatch({ type: 'ADD_JOB_AD', tabId, jobAd: newJobAd });
    handleClose();
  };

  const handleClose = () => {
    setTitle('');
    setSpecialization('Product Management');
    setStatus('draft');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>New Job Ad</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="jobad-title">Job Title</Label>
            <Input
              id="jobad-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Senior Product Manager"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="specialization">Specialization</Label>
              <select
                id="specialization"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                className="w-full rounded-md px-3 py-2 bg-secondary/50 border border-border/50"
              >
                {SPECIALIZATIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as JobAd['status'])}
                className="w-full rounded-md px-3 py-2 bg-secondary/50 border border-border/50"
              >
                {STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">Create Job Ad</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
