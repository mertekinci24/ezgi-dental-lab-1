import { db } from '@/lib/db';

export type DashboardStats = {
    activeCases: number;
    completedCases: number;
    pendingActions: number;
};

export async function getDashboardStats(tenantId: string, userRole: string): Promise<DashboardStats> {
    // DEBUG LOG (Sunucu konsolunda görünecek)
    console.log(`[DASHBOARD] Stats requested. Tenant: ${tenantId}, Role: ${userRole}`);

    // Admin ise TÜM sistemi gör, değilse sadece kendi tenant'ını
    const whereClause = userRole === 'LAB_ADMIN' ? {} : { tenantId };

    console.log(`[DASHBOARD] Where Clause: ${JSON.stringify(whereClause)}`);

    try {
        const activeCount = await db.case.count({
            where: {
                ...whereClause,
                status: { in: ['SUBMITTED', 'RECEIVED', 'DESIGN', 'PRODUCTION'] }
            }
        });

        const completedCount = await db.case.count({
            where: {
                ...whereClause,
                status: 'COMPLETED'
            }
        });

        const pendingCount = await db.case.count({
            where: {
                ...whereClause,
                status: 'SUBMITTED'
            }
        });

        console.log(`[DASHBOARD] Results - Active: ${activeCount}, Completed: ${completedCount}`);

        return {
            activeCases: activeCount,
            completedCases: completedCount,
            pendingActions: pendingCount
        };
    } catch (error) {
        console.error("[DASHBOARD] Error fetching stats:", error);
        return { activeCases: 0, completedCases: 0, pendingActions: 0 };
    }
}

// getRecentCases fonksiyonunu da aynı mantıkla güncelle (Log ekle)
export async function getRecentCases(tenantId: string, userRole: string) {
    const whereClause = userRole === 'LAB_ADMIN' ? {} : { tenantId };

    console.log(`[DASHBOARD] Recent Cases requested. Role: ${userRole}`);

    return await db.case.findMany({
        where: whereClause,
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
            patient: { select: { fullName: true } },
            tenant: { select: { name: true } } // Admin için klinik adı
        }
    });
}
