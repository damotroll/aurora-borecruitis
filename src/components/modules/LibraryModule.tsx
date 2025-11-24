import { RecruitmentBuilderState } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Search, Tag, Edit, Trash2 } from 'lucide-react';

interface LibraryModuleProps {
  state: RecruitmentBuilderState;
  dispatch: React.Dispatch<any>;
}

const LibraryModule = ({ state }: LibraryModuleProps) => {
  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      benefit: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20',
      requirement: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20',
      skill: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20',
      question: 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20',
      red_flag: 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20',
      evaluation_criteria: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20',
    };
    return colors[type] || 'bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">Content Library</h2>
          <p className="text-muted-foreground">Manage your reusable content blocks</p>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-full">
            Import
          </Button>
          <Button className="rounded-full">
            <Plus className="mr-2 h-4 w-4" />
            New Block
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="glass-card rounded-3xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search blocks..."
              className="w-full rounded-full pl-11 pr-4 py-2.5 bg-secondary/50 border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          
          <select className="rounded-full px-4 py-2.5 bg-secondary/50 border border-border/50">
            <option>All Types</option>
            <option>Benefits</option>
            <option>Requirements</option>
            <option>Skills</option>
            <option>Questions</option>
            <option>Red Flags</option>
          </select>
          
          <select className="rounded-full px-4 py-2.5 bg-secondary/50 border border-border/50">
            <option>All Categories</option>
            <option>Technical</option>
            <option>Compensation</option>
            <option>Culture</option>
          </select>
          
          <Button variant="outline" className="rounded-full">
            <Tag className="mr-2 h-4 w-4" />
            Filter Tags
          </Button>
        </div>
      </Card>

      {/* Content Blocks Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {state.contentBlocks.map((block) => (
          <Card key={block.id} className="glass-card rounded-3xl p-6 hover:shadow-lg transition-all group">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs px-3 py-1 rounded-full border ${getTypeColor(block.type)}`}>
                    {block.type.replace('_', ' ')}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {block.category}
                  </span>
                </div>
                <h3 className="text-lg font-semibold mb-2">{block.title}</h3>
              </div>
              
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
              {block.content}
            </p>
            
            <div className="flex flex-wrap gap-2">
              {block.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-border/30">
              <p className="text-xs text-muted-foreground">
                Used in: <span className="font-medium">0 profiles, 0 job ads</span>
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/* Stats */}
      <Card className="glass-card rounded-3xl p-6">
        <h3 className="text-lg font-semibold mb-4">Library Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Blocks', value: state.contentBlocks.length },
            { label: 'Benefits', value: state.contentBlocks.filter(b => b.type === 'benefit').length },
            { label: 'Requirements', value: state.contentBlocks.filter(b => b.type === 'requirement').length },
            { label: 'Skills', value: state.contentBlocks.filter(b => b.type === 'skill').length },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-4 rounded-2xl bg-secondary/30">
              <div className="text-3xl font-bold text-primary mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default LibraryModule;
