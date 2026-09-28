import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

export const AUTH_COOKIE = 'bharatai_session';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  organizationName: z.string().min(2),
});

export function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export function verifyPassword(password: string, passwordHash: string) {
  return bcrypt.compare(password, passwordHash);
}

export function createSessionToken(userId: string, organizationId?: string) {
  return jwt.sign({ userId, organizationId }, process.env.JWT_SECRET || 'dev-secret-change-me', { expiresIn: '7d' });
}

export function verifySessionToken(token: string) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'dev-secret-change-me') as { userId: string; organizationId?: string };
  } catch {
    return null;
  }
}

export function setSessionCookie(response: Response, token: string) {
  response.headers.set('Set-Cookie', `${AUTH_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax`);
}

export function clearSessionCookie(response: Response) {
  response.headers.set('Set-Cookie', `${AUTH_COOKIE}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax`);
}

export function assertOrgAccess(userOrgId: string | null | undefined, entityOrgId: string) {
  if (!userOrgId) {
    throw new Error('Unauthorized');
  }

  if (userOrgId !== entityOrgId) {
    throw new Error('Organization mismatch');
  }
}

export function getSessionFromCookies() {
  const cookieStore = cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;
  return token ? verifySessionToken(token) : null;
}
