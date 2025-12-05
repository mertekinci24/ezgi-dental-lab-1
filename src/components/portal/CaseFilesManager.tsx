'use client';

import { useState } from 'react';
import { FileIcon, Download, Eye, X } from 'lucide-react';
import FileUploader from './FileUploader';
import ThreeDViewer from './ThreeDViewer';

type Attachment = {
    id: string;
    fileName: string;
    url: string;
    createdAt: Date;
    fileType: string;
};

export default function CaseFilesManager({ caseId, attachments }: { caseId: string, attachments: Attachment[] }) {
    const [viewingUrl, setViewingUrl] = useState<string | null>(null);

    return (
        <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                Dosyalar & Ekler
            </h2>

            {/* Viewer Aktifse Göster */}
            {viewingUrl ? (
                <div className="mb-6 animate-in fade-in zoom-in duration-300">
                    <ThreeDViewer url={viewingUrl} onClose={() => setViewingUrl(null)} />
                </div>
            ) : (
                <div className="mb-6">
                    <FileUploader caseId={caseId} />
                </div>
            )}

            {/* Dosya Listesi */}
            <div className="space-y-3">
                {attachments.length === 0 ? (
                    <p className="text-zinc-500 text-sm text-center py-4">Henüz dosya yüklenmedi.</p>
                ) : (
                    attachments.map((file) => (
                        <div key={file.id} className={`flex items-center justify-between p-3 rounded-lg border transition-all ${viewingUrl === file.url
                                ? 'bg-blue-900/20 border-blue-500/50'
                                : 'bg-zinc-800/50 border-zinc-800 hover:border-zinc-700'
                            }`}>
                            <div className="flex items-center gap-3 overflow-hidden">
                                <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <FileIcon className="w-5 h-5 text-zinc-400" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-white truncate max-w-[200px]">{file.fileName}</p>
                                    <p className="text-xs text-zinc-500">{new Date(file.createdAt).toLocaleDateString('tr-TR')}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                {/* Sadece STL/PLY ise Göz ikonunu göster */}
                                {(file.fileName.toLowerCase().endsWith('.stl') || file.fileName.toLowerCase().endsWith('.ply')) && (
                                    <button
                                        onClick={() => setViewingUrl(file.url)}
                                        className="p-2 hover:bg-blue-600 hover:text-white rounded-lg text-zinc-400 transition-colors"
                                        title="3D Önizleme"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </button>
                                )}

                                <a
                                    href={file.url}
                                    download
                                    target="_blank"
                                    className="p-2 hover:bg-zinc-700 rounded-lg text-zinc-400 hover:text-white transition-colors"
                                    title="İndir"
                                >
                                    <Download className="w-4 h-4" />
                                </a>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
