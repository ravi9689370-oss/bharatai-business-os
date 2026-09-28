import { describe, expect, it } from 'vitest';
import { assertOrgAccess } from '../lib/auth';

describe('auth org isolation', () => {
  it('allows same organization access', () => {
    expect(() => assertOrgAccess('org-1', 'org-1')).not.toThrow();
  });

  it('rejects cross-organization access', () => {
    expect(() => assertOrgAccess('org-1', 'org-2')).toThrow('Organization mismatch');
  });

  it('rejects missing organization context', () => {
    expect(() => assertOrgAccess(undefined, 'org-1')).toThrow('Unauthorized');
  });
});
