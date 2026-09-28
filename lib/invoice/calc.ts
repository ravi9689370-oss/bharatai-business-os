export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
}

export interface InvoiceCalculation {
  subtotal: number;
  taxAmount: number;
  total: number;
}

export function calculateInvoice(items: InvoiceItem[]): InvoiceCalculation {
  let subtotal = 0;
  let taxAmount = 0;

  for (const item of items) {
    const itemSubtotal = item.quantity * item.unitPrice;
    const itemTax = itemSubtotal * (item.taxRate / 100);
    subtotal += itemSubtotal;
    taxAmount += itemTax;
  }

  return {
    subtotal,
    taxAmount,
    total: subtotal + taxAmount,
  };
}
