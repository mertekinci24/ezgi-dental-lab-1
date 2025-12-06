import { db } from '@/lib/db';

// Vaka Listesi İçin (Rol Duyarlı)
export async function getCases(tenantId: string, userRole: string) {
    try {
        // EĞER LAB ADMIN İSE FİLTREYİ KALDIR (TÜM VAKALARI GÖR)
        // EĞER DEĞİLSE SADECE KENDİ TENANT'INI GÖR
        const whereClause = userRole === 'LAB_ADMIN' ? {} : { tenantId };

        console.log(`[DAL] Fetching cases. Role: ${userRole}, Filter: ${JSON.stringify(whereClause)}`);

        const cases = await db.case.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' },
            include: {
                patient: { select: { fullName: true } },
                dentist: { select: { name: true, email: true } },
                tenant: { select: { name: true } } // Hangi klinikten geldiği
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
                clinicName: c.tenant?.name, // Admin için önemli
                status: c.status,
                dueDate: c.dueDate,
                restorationType: material.material || "Standart",
                toothNumber: c.odontogram ? (JSON.parse(c.odontogram) as number[]).join(", ") : ""
            };
        });
    } catch (error) {
        console.error("DAL Error getCases:", error);
        return [];
    }
}

// getCaseDetail fonksiyonu AYNEN KALACAK, dokunma.
// (Sadece export'un devam ettiğinden emin ol)
export async function getCaseDetail(caseId: string) {
    // ... mevcut kod ...
    // (Burayı değiştirmene gerek yok, ID ile erişim globaldir)
    try {
        const c = await db.case.findUnique({
            where: { id: caseId },
            include: {
                dentist: { select: { email: true, name: true } },
                patient: { select: { fullName: true, gender: true } }, // Gender eklendi
                attachments: { orderBy: { createdAt: "desc" } },
                tenant: true
            }
        });

        if (!c) return null;

        let material: any = {};
        let preferences: any = {};
        let odontogram: number[] = [];

        try {
            material = c.material ? JSON.parse(c.material) : {};
            preferences = c.preferences ? JSON.parse(c.preferences) : {};
            odontogram = c.odontogram ? JSON.parse(c.odontogram) : [];
        } catch (e) { console.error(e); }

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
        return null;
    }
}
