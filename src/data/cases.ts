import { db } from '@/lib/db';

// Vaka Listesi İçin (Vakalarım Sayfası)
export async function getCases(tenantId: string) {
    try {
        console.log(`[DAL] Fetching all cases for tenant: ${tenantId}`);

        const cases = await db.case.findMany({
            where: { tenantId },
            orderBy: { createdAt: 'desc' },
            include: {
                patient: { select: { fullName: true } },
                dentist: { select: { name: true, email: true } }
            }
        });

        // DTO Dönüşümü
        return cases.map(c => {
            let material: any = {};
            try {
                material = c.material ? JSON.parse(c.material) : {};
            } catch (e) { /* ignore */ }

            return {
                id: c.id,
                caseNumber: c.caseNumber,
                patientName: c.patient?.fullName || c.patientName,
                doctorName: c.dentist?.name || c.dentist?.email,
                status: c.status,
                dueDate: c.dueDate,
                restorationType: material.material || "Standart" // Tablo için gerekli
            };
        });
    } catch (error) {
        console.error("DAL Error getCases:", error);
        return [];
    }
}

// Vaka Detayı İçin (Detay Sayfası)
export async function getCaseDetail(caseId: string) {
    try {
        const c = await db.case.findUnique({
            where: { id: caseId },
            include: {
                dentist: { select: { email: true, name: true } },
                patient: { select: { fullName: true, gender: true } },
                attachments: {
                    orderBy: { createdAt: "desc" }
                },
                tenant: true
            }
        });

        if (!c) return null;

        // JSON Parsing
        let material: any = {};
        let preferences: any = {};
        let odontogram: number[] = [];

        try {
            material = c.material ? JSON.parse(c.material) : {};
            preferences = c.preferences ? JSON.parse(c.preferences) : {};
            odontogram = c.odontogram ? JSON.parse(c.odontogram) : [];
        } catch (e) {
            console.error("JSON Parse Error:", e);
        }

        return {
            id: c.id,
            caseNumber: c.caseNumber,
            status: c.status,
            patientName: c.patient?.fullName || c.patientName,
            patientGender: c.patient?.gender || null,
            doctorName: c.dentist?.name || c.dentist?.email,
            dueDate: c.dueDate,
            restorationType: material.material || "Standart",
            toothNumber: odontogram.join(", "),
            shade: material.shades?.body || "",
            stumpShade: material.shades?.stump || null,
            occlusion: preferences.occlusion || null,
            contact: preferences.contact || null,
            margin: preferences.margin || null,
            notes: preferences.notes || "",
            attachments: c.attachments || []
        };
    } catch (error) {
        console.error("DAL Error getCaseDetail:", error);
        return null;
    }
}
