import { getCases } from '@/data/cases';
import CaseDataTable from '@/components/portal/CaseDataTable';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { Plus, Search } from 'lucide-react';

type Props = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function CasesPage({ searchParams }: Props) {
    const t = await getTranslations('Portal');
    const params = await searchParams;
    const session = await auth();

    if (!session?.user) {
        redirect('/login');
    }

    const page = typeof params.page === 'string' ? parseInt(params.page) : 1;
    // const status = typeof params.status === 'string' ? params.status : undefined;
    // const search = typeof params.search === 'string' ? params.search : undefined;

    const cases = await getCases(session.user.tenantId);

    return (
        <div className="min-h-screen bg-black p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Vakalarım</h1>
                        <p className="text-neutral-400">Tüm vaka geçmişinizi buradan yönetebilirsiniz.</p>
                    </div>
                    <Link href="/portal/new-case" className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg flex items-center gap-2 shadow-lg transition-colors">
                        <Plus className="w-5 h-5" />
                        Yeni Vaka
                    </Link>
                </div>

                {/* Filters Toolbar (Placeholder for now) */}
                <div className="flex gap-4 mb-6">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                        <input
                            type="text"
                            placeholder="Hasta adı veya Vaka No ile ara..."
                            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-primary"
                        />
                    </div>
                    <select className="bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary">
                        <option value="ALL">Tüm Durumlar</option>
                        <option value="RECEIVED">Alındı</option>
                        <option value="DESIGN">Tasarımda</option>
                        <option value="PRODUCTION">Üretimde</option>
                        <option value="COMPLETED">Tamamlandı</option>
                    </select>
                </div>

                <CaseDataTable data={cases} total={cases.length} currentPage={page} />
            </div>
        </div>
    );
}
