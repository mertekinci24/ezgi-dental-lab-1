import { db } from '@/lib/db';

export type DashboardStats = {
    active: number;
    completed: number;
    pending: number;
};

export type RecentCase = {
    id: string;
    caseNumber: number;
    patientName: string;
    status: string;
    dueDate: Date;
};

export async function getDashboardStats(tenantId: string): Promise<DashboardStats> {
    console.log(`[DAL] Dashboard Stats Fetching for Tenant: ${tenantId}`);

    // Example mapping:
    // Active: RECEIVED, DESIGN, PRODUCTION
    // Completed: SHIPPED, COMPLETED
    // Pending: DRAFT, ON_HOLD

    const activeCount = await db.case.count({
        where: {
            tenantId,
            status: { in: ['SUBMITTED', 'RECEIVED', 'DESIGN', 'PRODUCTION'] }
        }
    });

    const completedCount = await db.case.count({
        where: {
            tenantId,
            status: { in: ['SHIPPED', 'COMPLETED'] }
        }
    });

    const pendingCount = await db.case.count({
        where: {
            tenantId,
            status: { in: ['DRAFT', 'ON_HOLD'] }
        }
    });

    return {
        active: activeCount,
        completed: completedCount,
        pending: pendingCount
    };
}

export async function getRecentCases(tenantId: string): Promise<RecentCase[]> {
    console.log(`[DAL] Recent Cases Fetching for Tenant: ${tenantId}`);

    const cases = await db.case.findMany({
        where: { tenantId },
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
            patient: {
                select: { fullName: true }
            }
        }
    });

    return cases.map(c => ({
        id: c.id,
        caseNumber: c.caseNumber,
        patientName: c.patient?.fullName || c.patientName,
        status: c.status,
        dueDate: c.dueDate,
        // JSON Parsing (Even if not used in table, good for DTO consistency)
        odontogram: c.odontogram ? JSON.parse(c.odontogram) : [],
        material: c.material ? JSON.parse(c.material) : {},
        preferences: c.preferences ? JSON.parse(c.preferences) : {}
    }));
}
