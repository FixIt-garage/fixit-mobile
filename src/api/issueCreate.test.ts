import { buildIssueCreate } from './issueCreate';

describe('buildIssueCreate', () => {
  const draft = { categoryId: 4, description: '  Пральна машина не зливає воду. Шумить.  ' };

  it('builds a request to a master', () => {
    expect(buildIssueCreate(draft, { masterId: 12 })).toEqual({
      title: 'Пральна машина не зливає воду',
      description: 'Пральна машина не зливає воду. Шумить.',
      category_id: 4,
      assignee_master_id: 12,
    });
  });

  it('builds a request to a service center', () => {
    expect(buildIssueCreate(draft, { companyId: 3 })).toEqual({
      title: 'Пральна машина не зливає воду',
      description: 'Пральна машина не зливає воду. Шумить.',
      category_id: 4,
      assignee_company_id: 3,
    });
  });
});