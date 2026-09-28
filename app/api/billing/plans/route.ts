import { NextResponse } from 'next/server';
import { SUBSCRIPTION_PLANS } from '@/lib/billing/plans';

export async function GET() {
  const plans = Object.values(SUBSCRIPTION_PLANS);
  return NextResponse.json({ data: plans });
}
