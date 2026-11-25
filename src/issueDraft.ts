export const ISSUE_TITLE_MAX = 60;

export type IssueDraft = {
  categoryId: number;
  description: string;
};

export function issueTitleFromDescription(description: string): string {
  const firstLine = description.trim().split('\n')[0] ?? '';
  const sentence = firstLine.match(/^.*?[.!?…](?=\s|$)/)?.[0] ?? firstLine;
  const title = sentence.replace(/\s+/g, ' ').replace(/[.…]+$/, '').trim();

  if (title.length <= ISSUE_TITLE_MAX) {
    return title;
  }

  const cut = title.slice(0, ISSUE_TITLE_MAX);
  const lastSpace = cut.lastIndexOf(' ');
  const base = lastSpace > ISSUE_TITLE_MAX / 2 ? cut.slice(0, lastSpace) : cut;
  return `${base.trimEnd()}…`;
}