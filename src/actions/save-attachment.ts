'use server';

import { auth } from '@/auth';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function saveAttachment(caseId: string, url: string, fileName: string, fileType: string) {
    const session = await auth();
    if (!session?.user || !session.user.tenantId) {
        return { success: false, message: 'Unauthorized' };
    }

    const { tenantId, id: userId } = session.user;

    try {
        // Verify ownership/access
        const existingCase = await db.case.findFirst({
            where: { id: caseId, tenantId }
        });

        if (!existingCase) {
            return { success: false, message: 'Case not found' };
        }

        // Transaction: Create Attachment + Audit Log
        await db.$transaction([
            db.attachment.create({
                data: {
                    caseId,
                    url,
                    fileName,
                    fileType
                }
            }),
            db.auditLog.create({
                data: {
                    caseId,
                    userId,
                    action: 'FILE_UPLOADED',
                    details: `Uploaded: ${fileName}`
                }
            })
        ]);

        revalidatePath(`/portal/cases/${caseId}`);
        return { success: true, message: 'File saved successfully' };

    } catch (error) {
        console.error("Save Attachment Error:", error);
        return { success: false, message: 'Failed to save file metadata' };
    }
}
