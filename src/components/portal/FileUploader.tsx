'use client';

import { useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Upload, Loader2 } from 'lucide-react';
import { getPresignedUploadUrl, saveAttachmentToCase } from '@/actions/storage';

export default function FileUploader({ caseId }: { caseId: string }) {
    const t = useTranslations('Portal.Files');
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            // 1. Sunucudan İzin İste
            const { signedUrl, fileKey } = await getPresignedUploadUrl(file.name, file.type);

            if (signedUrl === "MOCK_MODE") {
                // --- MOCK SENARYOSU ---
                console.log("Simülasyon yüklemesi başlatılıyor...");
                // Gerçekçi görünmesi için 1.5 saniye bekle
                await new Promise(resolve => setTimeout(resolve, 1500));

                // Veritabanına "Yüklendi" bilgisini geç
                await saveAttachmentToCase(caseId, file.name, "MOCK_URL", file.type);
                // ----------------------
            } else {
                // --- GERÇEK SENARYO ---
                const uploadRes = await fetch(signedUrl, {
                    method: 'PUT',
                    body: file,
                    headers: { 'Content-Type': file.type }
                });

                if (!uploadRes.ok) throw new Error('Upload failed');

                // Cloudflare R2 / AWS Public URL oluşturma
                // Not: Endpoint sonuna fileKey eklenerek public URL tahmin edilir
                // Örn: https://pub-xxx.r2.dev/uploads/...
                // Şimdilik signedUrl'in origin'ini kullanıyoruz veya basit path
                const publicUrl = fileKey;

                await saveAttachmentToCase(caseId, file.name, publicUrl, file.type);
                // ---------------------
            }

        } catch (error) {
            console.error("Yükleme Hatası:", error);
            alert('Dosya yüklenirken hata oluştu.');
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    return (
        <div
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed border-zinc-800 rounded-lg p-8 text-center hover:bg-zinc-900/50 transition-colors cursor-pointer flex flex-col items-center justify-center gap-3 ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
        >
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleUpload}
                className="hidden"
                accept=".stl,.ply,.obj"
            />

            {isUploading ? (
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            ) : (
                <Upload className="w-8 h-8 text-zinc-600" />
            )}

            <div>
                <p className="text-sm text-zinc-400 font-medium">
                    {/* Çeviri anahtarlarının varlığından emin ol */}
                    {isUploading ? (t.has('uploading') ? t('uploading') : 'Yükleniyor...') : (t.has('dragDrop') ? t('dragDrop') : 'Dosya Seçin')}
                </p>
                <p className="text-xs text-zinc-600 mt-1">
                    {t.has('maxSize') ? t('maxSize') : 'Maks. 50MB'}
                </p>
            </div>
        </div>
    );
}
