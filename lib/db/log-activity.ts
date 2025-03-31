'use server';

import { desc, eq } from 'drizzle-orm';
import { db } from './drizzle';
import { activityLogs, ActivityType } from './schema';
import { getUser } from './queries';

import { ActivityLog } from '@/lib/db/schema';


export async function logActivity(
    action: ActivityType,
    userId?: number,
    ipAddress?: string,
) {
    if (!userId) {
        const user = await getUser();
        if (!user) return;
        userId = user.id;
    }

    await db.insert(activityLogs).values({
        userId,
        action,
        ipAddress,
    });
}

export async function getActivityLogs(): Promise<ActivityLog[]> {
    const user = await getUser();
    if (!user) {
        return [];
    }

    return db
        .select()
        .from(activityLogs)
        .where(eq(activityLogs.userId, user.id))
        .orderBy(desc(activityLogs.timestamp))
        .limit(20);
}