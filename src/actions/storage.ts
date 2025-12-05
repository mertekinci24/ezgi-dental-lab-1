'use server';

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

// 1. Konfigürasyon Kontrolü (Fail-Safe Check)
const hasS3Config =
    process.env.AWS_ACCESS_KEY_ID &&
    process.env.AWS_SECRET_ACCESS_KEY &&
    process.env.AWS_BUCKET_NAME &&
    process.env.AWS_ENDPOINT;

let s3: S3Client | null = null;

if (hasS3Config) {
    try {
        s3 = new S3Client({
            region: process.env.AWS_REGION || 'auto',
            endpoint: process.env.AWS_ENDPOINT,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
            },
            forcePathStyle: true // R2 ve MinIO uyumluluğu için
        });
    } catch (err) {
        console.warn("⚠️ S3 Client başlatılamadı:", err);
        s3 = null;
    }
} else {
    // Bu log, geliştiriciyi uyarır ama sistemi durdurmaz.
    console.warn("⚠️ UYARI: S3 Ortam Değişkenleri eksik. Sistem 'Simülasyon (Mock) Modu'nda çalışacak.");
}

export async function getPresignedUploadUrl(fileName: string, fileType: string) {
    const session = await auth();
    if (!session) throw new Error("Unauthorized");

    // A) MOCK MODU (Eğer S3 yoksa)
    if (!s3) {
        console.log(`[MOCK] Presigned URL isteği: ${fileName}`);
        return {
            signedUrl: "MOCK_MODE",
            fileKey: `mock-uploads/${uuidv4()}-${fileName}`
        };
    }

    // B) GERÇEK MOD (Eğer S3 varsa)
    const fileKey = `uploads/${session.user.tenantId}/${uuidv4()}-${fileName}`;
    const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: fileKey,
        ContentType: fileType,
    });

    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 60 });
    return { signedUrl, fileKey };
}

export async function saveAttachmentToCase(caseId: string, fileName: string, fileUrl: string, fileType: string) {
    const session = await auth();
    if (!session) throw new Error("Unauthorized");

    // Mock URL düzeltmesi (Listede çirkin görünmesin diye)
    let finalUrl = fileUrl;
    if (fileUrl === "MOCK_MODE" || fileUrl.includes("MOCK_URL")) {
        finalUrl = "#"; // Tıklanınca bir yere gitmez
    }

    await db.attachment.create({
        data: {
            caseId,
            fileName,
            fileType,
            url: finalUrl
        }
    });

    revalidatePath(`/portal/cases/${caseId}`);
}
