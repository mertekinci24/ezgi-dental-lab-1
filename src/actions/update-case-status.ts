'use server';

import { db } from '@/lib/db';
import { auth } from '@/auth'; // Auth import etmeyi unutma
import { revalidatePath } from 'next/cache';

export async function updateCaseStatus(caseId: string, status: string) {
    const session = await auth();
    if (!session) throw new Error("Unauthorized");

    // GÜVENLİK KONTROLÜ:
    // Eğer LAB_ADMIN ise: Sadece ID ile güncelle (Herkesi yönetebilir)
    // Eğer DENTIST ise: ID + TenantID ile güncelle (Sadece kendi vakasını)

    const whereClause = session.user.role === 'LAB_ADMIN'
        ? { id: caseId }
        : { id: caseId, tenantId: session.user.tenantId };

    try {
        await db.case.update({
            where: whereClause,
            data: { status }
        });

        revalidatePath(`/portal/cases/${caseId}`);
        return { success: true };
    } catch (error) {
        console.error("Status Update Error:", error);
        throw new Error("İşlem başarısız oldu. Yetkiniz olmayabilir.");
    }
}
