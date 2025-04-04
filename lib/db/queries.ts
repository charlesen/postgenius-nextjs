import { and, eq, isNull } from 'drizzle-orm';
import { db } from './drizzle';
import { users } from './schema';

import { verifyToken } from '@/lib/auth/session';