import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Default PIN — used as fallback if DB setting doesn't exist yet
const DEFAULT_PIN = 'XERO2008';

// JWT secret for admin tokens (use env var or fallback)
const JWT_SECRET = process.env.ADMIN_JWT_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || 'xhash-admin-secret-key-2024';

export interface AdminTokenPayload {
  adminId: string;
  username: string;
  level: number;
  displayName: string;
}

/**
 * Verify the admin PIN against the DB-stored value (or fallback to hardcoded default).
 * The PIN is the same for ALL admins and can be changed by Level 1 from the dashboard.
 */
export async function verifyPin(pin: string): Promise<boolean> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (supabaseUrl && serviceRoleKey) {
      const res = await fetch(`${supabaseUrl}/rest/v1/platform_settings?key=eq.admin_pin&select=value`, {
        headers: {
          'apikey': serviceRoleKey,
          'Authorization': `Bearer ${serviceRoleKey}`,
        },
      });
      if (res.ok) {
        const rows = await res.json();
        if (rows?.length > 0 && rows[0].value) {
          return pin === rows[0].value;
        }
      }
    }
  } catch {
    // DB not available, fall through to default
  }
  return pin === DEFAULT_PIN;
}

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

/**
 * Compare a password against a bcrypt hash
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Sign a JWT token for an admin session
 */
export function signAdminToken(payload: AdminTokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
}

/**
 * Verify and decode an admin JWT token
 */
export function verifyAdminToken(token: string): AdminTokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AdminTokenPayload;
    return decoded;
  } catch {
    return null;
  }
}

/**
 * Extract admin token from Authorization header
 */
export function extractAdminToken(authHeader: string | null): AdminTokenPayload | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.substring(7);
  return verifyAdminToken(token);
}

/**
 * Check if admin has required level (lower number = higher access)
 */
export function hasPermission(adminLevel: number, requiredLevel: number): boolean {
  return adminLevel <= requiredLevel;
}
