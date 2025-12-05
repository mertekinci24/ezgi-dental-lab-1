'use server';

import { auth } from '@/auth';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function updateCaseStatus(caseId: string, newStatus: string) {
    const session = await auth();
    if (!session?.user || !session.user.tenantId) {
        return { success: false, message: 'Unauthorized' };
    }

    const { tenantId, id: userId, role } = session.user;

    // RBAC Checks
    if (role === 'DENTIST' && newStatus === 'COMPLETED') {
        return { success: false, message: 'Dentists cannot mark cases as COMPLETED.' };
    }

    try {
        // Verify ownership/access first
        const existingCase = await db.case.findFirst({
            where: { id: caseId, tenantId }
        });

        if (!existingCase) {
            return { success: false, message: 'Case not found' };
        }

        const oldStatus = existingCase.status;

        // Transaction: Update Case + Create Audit Log
        await db.$transaction([
            db.case.update({
                where: { id: caseId },
                data: { status: newStatus }
            }),
            db.auditLog.create({
                data: {
                    caseId,
                    userId,
                    action: 'STATUS_CHANGE',
                    details: `${oldStatus} -> ${newStatus}`
                }
            })
        ]);

        revalidatePath('/portal/cases');
        revalidatePath(`/portal/cases/${caseId}`);
        return { success: true, message: 'Status updated successfully' };

    } catch (error) {
        console.error("Update Status Error:", error);
        return { success: false, message: 'Failed to update status' };
    }
}
