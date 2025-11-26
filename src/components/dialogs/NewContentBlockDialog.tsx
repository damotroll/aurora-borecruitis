import { useState } from 'react';
import { ContentBlock, Action } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface NewContentBlockDialogProps {
  isOpen: boolean;
  onClose: () => void;
  dispatch: React.Dispatch<Action>;
  defaultType?: ContentBlock['type'];
}

const BLOCK_TYPES: { value: ContentBlock['type']; label: string }[] = [
  { value: 'skill', label: 'Skill' },
  { value: 'requirement', label: 'Requirement' },
  { value: 'benefit', label: 'Benefit' },
  { value: 'value', label: 'Value' },
  { value: 'question', label: 'Question' },
  { value: 'evaluation_criteria', label: 'Evaluation Criteria' },
  { value: 'process_step', label: 'Process Step' },
  { value: 'red_flag', label: 'Red Flag' },
  { value: 'experience', label: 'Experience' },
  { value: 'ai_tool', label: 'AI Tool' },
  { value: 'responsibility', label: 'Responsibility' },
];

const CATEGORIES = [
  'technical',
  'compensation',
  'culture',
  'work-life',
  'ai-fluency',
  'mindset',
  'core',
  'design',
  'screening',
  'interview',
  'scoring',
];

export default function NewContentBlockDialog({
  isOpen,
  onClose,
  dispatch,
  defaultType = 'skill',
}: NewContentBlockDialogProps) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<ContentBlock['type']>(defaultType);
  const [category, setCategory] = useState('technical');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) return;

    const newBlock: ContentBlock = {
      id: `block-${Date.now()}`,
      title: title.trim(),
      type,
      category,
      content: content.trim(),
      tags: tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    dispatch({ type: 'ADD_CONTENT_BLOCK', block: newBlock });
    handleClose();
  };

  const handleClose = () => {
    setTitle('');
    setType(defaultType);
    setCategory('technical');
    setContent('');
    setTags('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>New Content Block</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter block title..."
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value as ContentBlock['type'])}
                className="w-full rounded-md px-3 py-2 bg-secondary/50 border border-border/50"
              >
                {BLOCK_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-md px-3 py-2 bg-secondary/50 border border-border/50"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c.charAt(0).toUpperCase() + c.slice(1).replace('-', ' ')}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter block content..."
              className="min-h-[120px]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g., ai, technical, skills"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">Create Block</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
