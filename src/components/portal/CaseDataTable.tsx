'use client';

import { CaseDTO } from '@/data/cases';
import { Link, useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { Edit, Eye } from 'lucide-react';

interface CaseDataTableProps {
    data: CaseDTO[];
    total: number;
    currentPage: number;
}

export default function CaseDataTable({ data, total, currentPage }: CaseDataTableProps) {
    const router = useRouter();
    const t = useTranslations('Portal');

    if (data.length === 0) {
        return (
            <div className="text-center py-12 bg-neutral-900 rounded-xl border border-neutral-800">
                <p className="text-neutral-400">No cases found matching your criteria.</p>
            </div>
        );
    }

    return (
        <div className="bg-zinc-900 rounded-xl shadow-sm border border-zinc-800 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-zinc-900/50 text-left border-b border-zinc-800">
                        <tr>
                            <th className="p-4 text-sm font-semibold text-zinc-400">{t('caseId')}</th>
                            <th className="p-4 text-sm font-semibold text-zinc-400">{t('patient')}</th>
                            <th className="p-4 text-sm font-semibold text-zinc-400">{t('doctor')}</th>
                            <th className="p-4 text-sm font-semibold text-zinc-400">{t('restoration')}</th>
                            <th className="p-4 text-sm font-semibold text-zinc-400">{t('status')}</th>
                            <th className="p-4 text-sm font-semibold text-zinc-400">{t('dueDate')}</th>
                            <th className="p-4 text-sm font-semibold text-zinc-400">{t('actions')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                        {data.map((c) => (
                            <tr
                                key={c.id}
                                onClick={() => router.push(`/portal/cases/${c.id}`)}
                                className="hover:bg-zinc-800 transition-colors cursor-pointer"
                            >
                                <td className="p-4 font-mono text-sm text-blue-400">#{c.caseNumber}</td>
                                <td className="p-4 font-medium text-zinc-200">{c.patientName}</td>
                                <td className="p-4 text-sm text-zinc-400">{c.doctorName}</td>
                                <td className="p-4 text-sm text-zinc-300">
                                    {t(`NewCase.material.options.${c.restorationType}`)} <span className="text-zinc-500">#{c.toothNumber}</span>
                                </td>
                                <td className="p-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium
                                        ${c.status === 'SUBMITTED' ? 'bg-blue-900/30 text-blue-400 border border-blue-800' :
                                            c.status === 'COMPLETED' ? 'bg-green-900/30 text-green-400 border border-green-800' :
                                                'bg-zinc-800 text-zinc-400 border border-zinc-700'}`}>
                                        {t(`statusMap.${c.status}`)}
                                    </span>
                                </td>
                                <td className="p-4 text-sm text-zinc-400">
                                    {new Date(c.dueDate).toLocaleDateString('tr-TR')}
                                </td>
                                <td className="p-4 flex gap-2" onClick={(e) => e.stopPropagation()}>
                                    <Link href={`/portal/cases/${c.id}`} className="p-2 hover:bg-zinc-700 rounded-lg text-zinc-400 hover:text-white transition-colors">
                                        <Eye className="w-4 h-4" />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="p-4 border-t border-zinc-800 flex justify-between items-center text-sm text-zinc-400">
                <span>Showing {data.length} of {total} cases</span>
                <div className="flex gap-2">
                    {/* Pagination controls would go here */}
                    <button disabled className="px-3 py-1 bg-zinc-800 rounded opacity-50 cursor-not-allowed">Previous</button>
                    <button className="px-3 py-1 bg-zinc-800 rounded hover:bg-zinc-700 text-white">Next</button>
                </div>
            </div>
        </div>
    );
}
