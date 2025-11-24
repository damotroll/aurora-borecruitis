import { CandidateProfile, JobAd, CaseStudy } from '@/types';

/**
 * Export a candidate profile to markdown format
 */
export function profileToMarkdown(profile: CandidateProfile): string {
  const lines: string[] = [];

  lines.push(`# ${profile.name}`);
  lines.push('');
  lines.push(`**Seniority:** ${profile.seniorityLevel}`);
  lines.push(`**Domain:** ${profile.domain}`);
  lines.push('');

  if (profile.customSections.length > 0) {
    for (const section of profile.customSections) {
      lines.push(`## ${section.title}`);
      lines.push('');
      lines.push(section.content);
      lines.push('');
    }
  }

  if (profile.notes && profile.notes !== profile.customSections.map(s => s.content).join('\n')) {
    lines.push('## Notes');
    lines.push('');
    lines.push(profile.notes);
    lines.push('');
  }

  lines.push('---');
  lines.push(`*Created: ${new Date(profile.createdAt).toLocaleDateString()}*`);

  return lines.join('\n');
}

/**
 * Export a job ad to markdown format
 */
export function jobAdToMarkdown(jobAd: JobAd): string {
  const lines: string[] = [];

  lines.push(`# ${jobAd.title}`);
  lines.push('');
  lines.push(`**Specialization:** ${jobAd.specialization}`);
  lines.push(`**Status:** ${jobAd.status}`);
  lines.push('');

  if (jobAd.hiringManager.name) {
    lines.push('## Hiring Manager');
    lines.push('');
    lines.push(`**Name:** ${jobAd.hiringManager.name}`);
    if (jobAd.hiringManager.title) {
      lines.push(`**Title:** ${jobAd.hiringManager.title}`);
    }
    if (jobAd.hiringManager.message) {
      lines.push('');
      lines.push(jobAd.hiringManager.message);
    }
    lines.push('');
  }

  if (jobAd.sections.length > 0) {
    for (const section of jobAd.sections) {
      lines.push(`## ${section.title}`);
      lines.push('');
      if (section.customContent) {
        lines.push(section.customContent);
      }
      lines.push('');
    }
  }

  lines.push('---');
  lines.push(`*Created: ${new Date(jobAd.createdAt).toLocaleDateString()}*`);

  return lines.join('\n');
}

/**
 * Export a case study to markdown format
 */
export function caseStudyToMarkdown(caseStudy: CaseStudy): string {
  const lines: string[] = [];

  lines.push(`# ${caseStudy.title}`);
  lines.push('');
  lines.push(`**Seniority Level:** ${caseStudy.seniorityLevel}`);
  lines.push(`**Domain:** ${caseStudy.domain}`);
  lines.push(`**Duration:** ${caseStudy.duration} minutes`);
  lines.push(`**Status:** ${caseStudy.status}`);
  lines.push('');

  if (caseStudy.scenario.context || caseStudy.scenario.challenge) {
    lines.push('## Scenario');
    lines.push('');
    if (caseStudy.scenario.context) {
      lines.push('### Context');
      lines.push('');
      lines.push(caseStudy.scenario.context);
      lines.push('');
    }
    if (caseStudy.scenario.challenge) {
      lines.push('### Challenge');
      lines.push('');
      lines.push(caseStudy.scenario.challenge);
      lines.push('');
    }
    if (caseStudy.scenario.constraints.length > 0) {
      lines.push('### Constraints');
      lines.push('');
      for (const constraint of caseStudy.scenario.constraints) {
        lines.push(`- ${constraint}`);
      }
      lines.push('');
    }
  }

  if (caseStudy.customQuestions.length > 0) {
    lines.push('## Questions');
    lines.push('');
    for (let i = 0; i < caseStudy.customQuestions.length; i++) {
      const q = caseStudy.customQuestions[i];
      lines.push(`${i + 1}. ${q.text}`);
      lines.push(`   - *Type: ${q.type}*`);
      lines.push('');
    }
  }

  if (caseStudy.customCriteria.length > 0) {
    lines.push('## Evaluation Criteria');
    lines.push('');
    for (const criteria of caseStudy.customCriteria) {
      lines.push(`### ${criteria.name}`);
      lines.push('');
      lines.push(criteria.description);
      lines.push('');
      if (criteria.lookingFor.length > 0) {
        lines.push('**Looking For:**');
        for (const item of criteria.lookingFor) {
          lines.push(`- ${item}`);
        }
        lines.push('');
      }
      if (criteria.redFlags.length > 0) {
        lines.push('**Red Flags:**');
        for (const item of criteria.redFlags) {
          lines.push(`- ${item}`);
        }
        lines.push('');
      }
    }
  }

  if (caseStudy.deliverables.length > 0) {
    lines.push('## Deliverables');
    lines.push('');
    for (const deliverable of caseStudy.deliverables) {
      lines.push(`- ${deliverable}`);
    }
    lines.push('');
  }

  lines.push('---');
  lines.push(`*Created: ${new Date(caseStudy.createdAt).toLocaleDateString()}*`);

  return lines.join('\n');
}

/**
 * Download content as a file
 */
export function downloadFile(content: string, filename: string, mimeType: string = 'text/markdown'): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generate a safe filename from a title
 */
export function toSafeFilename(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 50);
}
