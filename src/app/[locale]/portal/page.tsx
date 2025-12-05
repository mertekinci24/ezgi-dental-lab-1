import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { Plus, Package, CheckCircle, Clock, Activity } from 'lucide-react';
import { auth } from '@/auth';
import { getDashboardStats, getRecentCases } from '@/data/dashboard';

type Props = {
    params: Promise<{ locale: string }>;
};

export default async function PortalDashboard({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);

    const t = await getTranslations('Portal');
    const session = await auth();

    if (!session?.user?.tenantId) {
        return <div className="text-white">Unauthorized: No Tenant ID</div>;
    }

    const stats = await getDashboardStats(session.user.tenantId);
    const recentCases = await getRecentCases(session.user.tenantId);

    return (
        <div className="min-h-screen bg-zinc-950 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-zinc-100">{t('welcome')}</h1>
                        <p className="text-zinc-400">Ezgi Dental Lab Enterprise System</p>
                        {session?.user && (
                            <div className="mt-2 p-2 bg-green-900/20 border border-green-800 text-green-400 rounded text-sm font-mono inline-block">
                                Logged in as: {session.user.email} | Role: {session.user.role} | Tenant: {session.user.tenantId}
                            </div>
                        )}
                    </div>
                    <Link href="/portal/new-case" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg flex items-center gap-2 shadow-lg shadow-blue-900/20 transition-all">
                        <Plus className="w-5 h-5" />
                        {t('newCase')}
                    </Link>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-zinc-900 p-6 rounded-xl shadow-sm border border-zinc-800">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-zinc-400 font-medium">{t('activeCases')}</h3>
                            <Package className="w-6 h-6 text-blue-500" />
                        </div>
                        <p className="text-4xl font-bold text-zinc-100">{stats.active}</p>
                    </div>
                    <div className="bg-zinc-900 p-6 rounded-xl shadow-sm border border-zinc-800">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-zinc-400 font-medium">{t('completedCases')}</h3>
                            <CheckCircle className="w-6 h-6 text-green-500" />
                        </div>
                        <p className="text-4xl font-bold text-green-500">{stats.completed}</p>
                    </div>
                    <div className="bg-zinc-900 p-6 rounded-xl shadow-sm border border-zinc-800">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-zinc-400 font-medium">{t('pendingActions')}</h3>
                            <Clock className="w-6 h-6 text-orange-500" />
                        </div>
                        <p className="text-4xl font-bold text-orange-500">{stats.pending}</p>
                    </div>
                </div>

                {/* Recent Activity Table */}
                <div className="bg-zinc-900 rounded-xl shadow-sm border border-zinc-800 overflow-hidden">
                    <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-blue-500" />
                            {t('recentActivity')}
                        </h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-zinc-950/50 text-left border-b border-zinc-800">
                                <tr>
                                    <th className="p-4 text-sm font-semibold text-zinc-400">{t('caseId')}</th>
                                    <th className="p-4 text-sm font-semibold text-zinc-400">{t('patient')}</th>
                                    <th className="p-4 text-sm font-semibold text-zinc-400">{t('status')}</th>
                                    <th className="p-4 text-sm font-semibold text-zinc-400">{t('dueDate')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800">
                                {recentCases.map((c) => (
                                    <tr key={c.id} className="hover:bg-zinc-800 transition-colors group">
                                        <td className="p-4 font-mono text-sm text-blue-400">
                                            <Link href={`/portal/cases/${c.id}`} className="block w-full h-full">
                                                #{c.caseNumber}
                                            </Link>
                                        </td>
                                        <td className="p-4 font-medium text-zinc-200">
                                            <Link href={`/portal/cases/${c.id}`} className="block w-full h-full">
                                                {c.patientName}
                                            </Link>
                                        </td>
                                        <td className="p-4">
                                            <Link href={`/portal/cases/${c.id}`} className="block w-full h-full">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium
                            ${c.status === 'DESIGN' ? 'bg-blue-900/30 text-blue-400 border border-blue-800' :
                                                        c.status === 'PRODUCTION' ? 'bg-orange-900/30 text-orange-400 border border-orange-800' :
                                                            'bg-green-900/30 text-green-400 border border-green-800'}`}>
                                                    {c.status}
                                                </span>
                                            </Link>
                                        </td>
                                        <td className="p-4 text-sm text-zinc-400">
                                            <Link href={`/portal/cases/${c.id}`} className="block w-full h-full">
                                                {c.dueDate.toLocaleDateString('tr-TR')}
                                            </Link>
                                        </td>
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
