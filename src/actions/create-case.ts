'use server';

import { z } from 'zod';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

const WizardSchema = z.object({
    patient: z.object({
        name: z.string(),
        gender: z.string(),
        age: z.string(),
        caseType: z.string()
    }),
    selectedTeeth: z.array(z.number()),
    material: z.string(),
    shades: z.object({
        body: z.string(),
        stump: z.string().optional()
    }),
    preferences: z.object({
        occlusion: z.string(),
        contact: z.string(),
        margin: z.string(),
        notes: z.string().optional()
    }),
    dueDate: z.string().or(z.date())
});

export async function submitCase(data: any) {
    const session = await auth();
    if (!session?.user?.tenantId) {
        return { success: false, message: 'Unauthorized' };
    }

    const parsed = WizardSchema.safeParse(data);
    if (!parsed.success) {
        console.error('Validation Error:', parsed.error);
        return { success: false, message: 'Invalid data' };
    }

    const { patient, selectedTeeth, material, shades, preferences, dueDate } = parsed.data;

    try {
        // Create Patient
        const newPatient = await db.patient.create({
            data: {
                fullName: patient.name,
                gender: patient.gender,
                tenantId: session.user.tenantId
            }
        });

        // Use Transaction for Atomic Case Number Generation
        await db.$transaction(async (tx) => {
            // 1. Get Last Case Number (Locking logic if DB supports it, SQLite is file-locked anyway)
            const lastCase = await tx.case.findFirst({
                orderBy: { caseNumber: 'desc' }
            });
            const nextCaseNumber = (lastCase?.caseNumber || 1000) + 1;

            // 2. Create Case
            await tx.case.create({
                data: {
                    caseNumber: nextCaseNumber,
                    status: 'SUBMITTED',
                    patientName: patient.name,
                    dentistId: session.user.id!,
                    tenantId: session.user.tenantId,
                    patientId: newPatient.id,
                    odontogram: JSON.stringify(selectedTeeth),
                    material: JSON.stringify({ material, shades }),
                    preferences: JSON.stringify(preferences),
                    dueDate: new Date(dueDate)
                }
            });
        });

        revalidatePath('/portal');
        return { success: true };
    } catch (error) {
        console.error('Failed to create case:', error);
        return { success: false, message: 'Database error' };
    }
}
