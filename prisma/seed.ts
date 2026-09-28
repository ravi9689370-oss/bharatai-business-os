import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const starterPlan = await prisma.subscriptionPlan.upsert({
    where: { id: 'starter' },
    update: {},
    create: {
      id: 'starter',
      name: 'Starter',
      priceMonthly: 2999,
      currency: 'INR',
      aiMessageLimit: 500,
      leadLimit: 500,
      invoiceLimit: 100,
      features: 'CRM, AI assistant, invoicing, support base',
    },
  });

  const growthPlan = await prisma.subscriptionPlan.upsert({
    where: { id: 'growth' },
    update: {},
    create: {
      id: 'growth',
      name: 'Growth',
      priceMonthly: 9999,
      currency: 'INR',
      aiMessageLimit: 3000,
      leadLimit: 5000,
      invoiceLimit: 1000,
      features: 'Starter + higher limits + growth features',
    },
  });

  await prisma.subscriptionPlan.upsert({
    where: { id: 'enterprise' },
    update: {},
    create: {
      id: 'enterprise',
      name: 'Enterprise',
      priceMonthly: 49999,
      currency: 'INR',
      aiMessageLimit: 20000,
      leadLimit: 999999,
      invoiceLimit: 999999,
      features: 'Unlimited limits + enterprise support',
    },
  });

  const demoOrg = await prisma.organization.upsert({
    where: { slug: 'bharat-demo' },
    update: {},
    create: {
      name: 'Bharat Demo Business',
      slug: 'bharat-demo',
      industry: 'Retail',
      phone: '+91-9876543210',
      address: 'Bengaluru, Karnataka',
      preferredLanguage: 'hi',
      status: 'ACTIVE',
    },
  });

  const demoPassword = await bcrypt.hash('DemoPassword123!', 10);
  const adminPassword = await bcrypt.hash('AdminPassword123!', 10);

  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@bharatai.local' },
    update: {},
    create: {
      name: 'Demo Owner',
      email: 'demo@bharatai.local',
      passwordHash: demoPassword,
      globalRole: 'USER',
    },
  });

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@bharatai.local' },
    update: {},
    create: {
      name: 'Platform Admin',
      email: 'admin@bharatai.local',
      passwordHash: adminPassword,
      globalRole: 'PLATFORM_ADMIN',
    },
  });

  await prisma.membership.upsert({
    where: { userId_organizationId: { userId: demoUser.id, organizationId: demoOrg.id } },
    update: {},
    create: {
      userId: demoUser.id,
      organizationId: demoOrg.id,
      role: 'OWNER',
    },
  });

  await prisma.membership.upsert({
    where: { userId_organizationId: { userId: adminUser.id, organizationId: demoOrg.id } },
    update: {},
    create: {
      userId: adminUser.id,
      organizationId: demoOrg.id,
      role: 'ADMIN',
    },
  });

  await prisma.subscription.upsert({
    where: { id: 'demo-subscription' },
    update: {},
    create: {
      id: 'demo-subscription',
      organizationId: demoOrg.id,
      planId: growthPlan.id,
      status: 'TRIALING',
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
    },
  });

  await prisma.customer.upsert({
    where: { id: 'cust-1' },
    update: {},
    create: {
      id: 'cust-1',
      organizationId: demoOrg.id,
      name: 'Rajesh Sharma',
      phone: '+91-9000000001',
      email: 'rajesh@example.com',
      address: 'Delhi',
    },
  });

  await prisma.customer.upsert({
    where: { id: 'cust-2' },
    update: {},
    create: {
      id: 'cust-2',
      organizationId: demoOrg.id,
      name: 'Priya Verma',
      phone: '+91-9000000002',
      email: 'priya@example.com',
      address: 'Lucknow',
    },
  });

  await prisma.lead.upsert({
    where: { id: 'lead-1' },
    update: {},
    create: {
      id: 'lead-1',
      organizationId: demoOrg.id,
      name: 'Amit Gupta',
      phone: '+91-9000000003',
      email: 'amit@example.com',
      source: 'Website',
      status: 'NEW',
      estimatedValue: 120000,
      notes: 'Interested in digital marketing packages.',
    },
  });

  await prisma.lead.upsert({
    where: { id: 'lead-2' },
    update: {},
    create: {
      id: 'lead-2',
      organizationId: demoOrg.id,
      name: 'Sneha Patel',
      phone: '+91-9000000004',
      email: 'sneha@example.com',
      source: 'Referral',
      status: 'CONTACTED',
      estimatedValue: 90000,
      notes: 'Requested a consultation call.',
    },
  });

  await prisma.supportKnowledgeBaseItem.upsert({
    where: { id: 'kb-1' },
    update: {},
    create: {
      id: 'kb-1',
      organizationId: demoOrg.id,
      title: 'Return Policy',
      content: 'Items can be returned within 7 days with a valid bill. For electronics, returns require inspection.',
      category: 'Shipping',
      language: 'en',
    },
  });

  await prisma.supportKnowledgeBaseItem.upsert({
    where: { id: 'kb-2' },
    update: {},
    create: {
      id: 'kb-2',
      organizationId: demoOrg.id,
      title: 'Delivery Time',
      content: 'Standard delivery takes 3-5 working days across India. Express delivery is available in select cities.',
      category: 'Shipping',
      language: 'hi',
    },
  });

  await prisma.auditLog.upsert({
    where: { id: 'audit-1' },
    update: {},
    create: {
      id: 'audit-1',
      organizationId: demoOrg.id,
      userId: demoUser.id,
      action: 'LOGIN',
      entityType: 'User',
      entityId: demoUser.id,
      metadata: JSON.stringify({ source: 'local seed' }),
    },
  });

  console.log('Seed data created');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
