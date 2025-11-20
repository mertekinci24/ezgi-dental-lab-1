import { useTranslations } from 'next-intl';
import { Plus, Package, CheckCircle, Clock, Activity } from 'lucide-react';

export default function PortalDashboard() {
    const t = useTranslations('Portal');

    const cases = [
        { id: 'CS-2024-001', patient: 'Ahmet K.', status: 'design', date: '2024-11-25' },
        { id: 'CS-2024-002', patient: 'Ayşe Y.', status: 'production', date: '2024-11-24' },
        { id: 'CS-2024-003', patient: 'Mehmet D.', status: 'quality', date: '2024-11-23' },
    ];

    return (
        <div className="min-h-screen bg-surface-alt p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-primary-dark">{t('welcome')}</h1>
                        <p className="text-foreground/60">Ezgi Dental Lab Enterprise System</p>
                    </div>
                    <button className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg flex items-center gap-2 shadow-lg transition-colors">
                        <Plus className="w-5 h-5" />
                        {t('newCase')}
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-primary/5">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-foreground/70 font-medium">{t('activeCases')}</h3>
                            <Package className="w-6 h-6 text-primary" />
                        </div>
                        <p className="text-4xl font-bold text-primary-dark">12</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-primary/5">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-foreground/70 font-medium">{t('completedCases')}</h3>
                            <CheckCircle className="w-6 h-6 text-secondary" />
                        </div>
                        <p className="text-4xl font-bold text-secondary">45</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-primary/5">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-foreground/70 font-medium">{t('pendingActions')}</h3>
                            <Clock className="w-6 h-6 text-orange-500" />
                        </div>
                        <p className="text-4xl font-bold text-orange-500">3</p>
                    </div>
                </div>

                {/* Recent Activity Table */}
                <div className="bg-white rounded-xl shadow-sm border border-primary/5 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-primary-dark flex items-center gap-2">
                            <Activity className="w-5 h-5" />
                            {t('recentActivity')}
                        </h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-surface-alt text-left">
                                <tr>
                                    <th className="p-4 text-sm font-semibold text-foreground/70">{t('caseId')}</th>
                                    <th className="p-4 text-sm font-semibold text-foreground/70">{t('patient')}</th>
                                    <th className="p-4 text-sm font-semibold text-foreground/70">{t('status')}</th>
                                    <th className="p-4 text-sm font-semibold text-foreground/70">{t('dueDate')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {cases.map((c) => (
                                    <tr key={c.id} className="hover:bg-surface-alt/50 transition-colors">
                                        <td className="p-4 font-mono text-sm text-primary">{c.id}</td>
                                        <td className="p-4 font-medium">{c.patient}</td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium
                        ${c.status === 'design' ? 'bg-blue-100 text-blue-700' :
                                                    c.status === 'production' ? 'bg-orange-100 text-orange-700' :
                                                        'bg-green-100 text-green-700'}`}>
                                                {t(`statuses.${c.status}`)}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm text-foreground/60">{c.date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
