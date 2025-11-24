// Utility to parse unstructured markdown files into structured data

export interface ParsedMarkdown {
  title: string;
  sections: {
    heading: string;
    content: string;
    level: number;
  }[];
  rawContent: string;
}

export function parseMarkdown(markdown: string): ParsedMarkdown {
  const lines = markdown.split('\n');
  const sections: ParsedMarkdown['sections'] = [];
  let currentSection: { heading: string; content: string; level: number } | null = null;
  let title = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check for headings
    const h1Match = line.match(/^# (.+)$/);
    const h2Match = line.match(/^## (.+)$/);
    const h3Match = line.match(/^### (.+)$/);
    
    if (h1Match) {
      if (!title) title = h1Match[1].trim();
      if (currentSection) sections.push(currentSection);
      currentSection = { heading: h1Match[1].trim(), content: '', level: 1 };
    } else if (h2Match) {
      if (currentSection) sections.push(currentSection);
      currentSection = { heading: h2Match[1].trim(), content: '', level: 2 };
    } else if (h3Match) {
      if (currentSection) sections.push(currentSection);
      currentSection = { heading: h3Match[1].trim(), content: '', level: 3 };
    } else if (currentSection) {
      currentSection.content += line + '\n';
    } else if (line.trim() && !title) {
      // Use first non-empty line as title if no heading found
      title = line.trim();
    }
  }
  
  if (currentSection) sections.push(currentSection);
  
  return {
    title: title || 'Imported Document',
    sections,
    rawContent: markdown
  };
}

export function extractSeniorityLevel(text: string): 'junior' | 'mid' | 'senior' | 'principal' | 'staff' {
  const lowerText = text.toLowerCase();
  if (lowerText.includes('principal')) return 'principal';
  if (lowerText.includes('staff')) return 'staff';
  if (lowerText.includes('senior')) return 'senior';
  if (lowerText.includes('mid') || lowerText.includes('middle')) return 'mid';
  if (lowerText.includes('junior')) return 'junior';
  return 'mid';
}

export function extractDomain(text: string): string {
  const lowerText = text.toLowerCase();
  if (lowerText.includes('platform')) return 'platform';
  if (lowerText.includes('growth')) return 'growth';
  if (lowerText.includes('api')) return 'api';
  if (lowerText.includes('mobile')) return 'mobile';
  if (lowerText.includes('data')) return 'data';
  if (lowerText.includes('infrastructure')) return 'infrastructure';
  return 'general';
}
