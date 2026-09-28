import { describe, expect, it } from 'vitest';
import { calculateInvoice } from '../lib/invoice/calc';

describe('invoice calculation', () => {
  it('calculates subtotal correctly', () => {
    const result = calculateInvoice([
      { description: 'Item 1', quantity: 2, unitPrice: 1000, taxRate: 18 },
    ]);
    expect(result.subtotal).toBe(2000);
  });

  it('calculates tax correctly', () => {
    const result = calculateInvoice([
      { description: 'Item 1', quantity: 2, unitPrice: 1000, taxRate: 18 },
    ]);
    expect(result.taxAmount).toBe(360);
    expect(result.total).toBe(2360);
  });

  it('handles multiple items', () => {
    const result = calculateInvoice([
      { description: 'Item 1', quantity: 1, unitPrice: 1000, taxRate: 18 },
      { description: 'Item 2', quantity: 2, unitPrice: 500, taxRate: 5 },
    ]);
    expect(result.subtotal).toBe(2000);
    expect(result.taxAmount).toBe(230);
    expect(result.total).toBe(2230);
  });
});
