import { getCaseDetail } from '@/data/cases';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { ArrowLeft, Calendar, User, FileText, Activity, FileIcon, Download } from 'lucide-react';
import CaseStatusUpdater from '@/components/portal/CaseStatusUpdater';
import CaseFilesManager from '@/components/portal/CaseFilesManager';

type Props = {
    params: Promise<{ caseId: string }>;
};

export default async function CaseDetailPage({ params }: Props) {
    const { caseId } = await params;
    const caseData = await getCaseDetail(caseId);

    if (!caseData) {
        notFound();
    }

    const t = await getTranslations('Portal');

    return (
        <div className="min-h-screen bg-zinc-950 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <Link href="/portal/cases" className="text-zinc-400 hover:text-white flex items-center gap-2 mb-4 transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        {t('NewCase.actions.back') || 'Geri'}
                    </Link>
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                                #{caseData.caseNumber}
                                <span className="px-3 py-1 rounded-full text-sm font-medium bg-zinc-800 text-zinc-400 border border-zinc-700">
                                    {t(`statusMap.${caseData.status}`)}
                                </span>
                            </h1>
                            <p className="text-zinc-400 mt-2">{caseData.patientName}</p>
                        </div>
                        <div className="flex gap-3 items-center">
                            <CaseStatusUpdater caseId={caseData.id} currentStatus={caseData.status} />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Sol Kolon: Hasta Bilgileri */}
                    <div className="space-y-6">
                        <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
                            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <User className="w-5 h-5 text-blue-500" />
                                {t('patient')}
                            </h2>
                            <div className="space-y-3">
                                <div>
                                    <label className="text-xs text-zinc-500 uppercase font-semibold">{t('patient')}</label>
                                    <p className="text-white font-medium">{caseData.patientName}</p>
                                </div>
                                {caseData.patientGender && (
                                    <div>
                                        <label className="text-xs text-zinc-500 uppercase font-semibold">Cinsiyet</label>
                                        <p className="text-white">
                                            {t(`NewCase.patientInfo.genderOptions.${caseData.patientGender}`)}
                                        </p>
                                    </div>
                                )}
                                <div>
                                    <label className="text-xs text-zinc-500 uppercase font-semibold">{t('doctor')}</label>
                                    <p className="text-white">{caseData.doctorName}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
                            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-orange-500" />
                                {t('dueDate')}
                            </h2>
                            <p className="text-white font-medium">{new Date(caseData.dueDate).toLocaleDateString('tr-TR')}</p>
                        </div>
                    </div>

                    {/* Orta/Sağ Kolon: Detaylar ve Dosyalar */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
                            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-green-500" />
                                {t('restoration')} & Teknik Detaylar
                            </h2>

                            {/* 1. Materyal ve Diş Bilgisi */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 p-4 bg-zinc-950/50 rounded-lg border border-zinc-800">
                                <div>
                                    <label className="text-xs text-zinc-500 uppercase font-semibold">Materyal</label>
                                    <p className="text-white text-lg font-medium">
                                        {caseData.restorationType ? t(`NewCase.material.options.${caseData.restorationType}`) : '-'}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-xs text-zinc-500 uppercase font-semibold">Diş Numaraları</label>
                                    <p className="text-white text-lg font-mono text-blue-400">#{caseData.toothNumber}</p>
                                </div>
                            </div>

                            {/* 2. Renk Bilgileri */}
                            <div className="grid grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="text-xs text-zinc-500 uppercase font-semibold">Gövde Rengi (Body)</label>
                                    <p className="text-white font-medium">{caseData.shade || '-'}</p>
                                </div>
                                {caseData.stumpShade && (
                                    <div>
                                        <label className="text-xs text-zinc-500 uppercase font-semibold text-orange-400">Güdük Rengi (Stump)</label>
                                        <p className="text-white font-medium">{caseData.stumpShade}</p>
                                    </div>
                                )}
                            </div>

                            {/* 3. Kritik Tercihler (Grid) */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 pt-6 border-t border-zinc-800">
                                <div className="bg-zinc-800/30 p-3 rounded border border-zinc-800">
                                    <label className="text-[10px] text-zinc-500 uppercase font-bold mb-1 block">Oklüzyon</label>
                                    <p className="text-zinc-300 text-sm">
                                        {caseData.occlusion ? t(`NewCase.preferences.occlusionOpts.${caseData.occlusion}`) : '-'}
                                    </p>
                                </div>
                                <div className="bg-zinc-800/30 p-3 rounded border border-zinc-800">
                                    <label className="text-[10px] text-zinc-500 uppercase font-bold mb-1 block">Kontakt</label>
                                    <p className="text-zinc-300 text-sm">
                                        {caseData.contact ? t(`NewCase.preferences.contactOpts.${caseData.contact}`) : '-'}
                                    </p>
                                </div>
                                <div className="bg-zinc-800/30 p-3 rounded border border-zinc-800">
                                    <label className="text-[10px] text-zinc-500 uppercase font-bold mb-1 block">Marjin</label>
                                    <p className="text-zinc-300 text-sm">
                                        {caseData.margin ? t(`NewCase.preferences.marginOpts.${caseData.margin}`) : '-'}
                                    </p>
                                </div>
                            </div>

                            {/* 4. Notlar */}
                            {caseData.notes && (
                                <div className="pt-4 border-t border-zinc-800">
                                    <label className="text-xs text-zinc-500 uppercase font-semibold flex items-center gap-2 mb-2">
                                        <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                                        Özel Notlar
                                    </label>
                                    <p className="text-zinc-300 bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-lg italic">
                                        "{caseData.notes}"
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="lg:col-span-2">
                            <CaseFilesManager caseId={caseData.id} attachments={caseData.attachments} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
