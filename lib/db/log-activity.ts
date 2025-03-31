'use server';

import { desc, eq } from 'drizzle-orm';
import { db } from './drizzle';
import { activityLogs, ActivityType } from './schema';
import { getUser } from './queries';


export async function logActivity(action: ActivityType, ipAddress?: string) {
    const user = await getUser();
    if (!user) return;

    await db.insert(activityLogs).values({
        userId: user.id,
        action,
        ipAddress: ipAddress || '',
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