'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { updateCaseStatus } from '@/actions/update-case-status';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface Props {
    caseId: string;
    currentStatus: string;
}

const STATUS_OPTIONS = [
    'SUBMITTED',
    'RECEIVED',
    'DESIGN',
    'PRODUCTION',
    'COMPLETED',
    'SHIPPED',
    'DRAFT'
];

export default function CaseStatusUpdater({ caseId, currentStatus }: Props) {
    const t = useTranslations('Portal.statusMap');
    const router = useRouter();
    const [status, setStatus] = useState(currentStatus);
    const [isUpdating, setIsUpdating] = useState(false);

    const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value;
        if (newStatus === status) return;

        setStatus(newStatus);
        setIsUpdating(true);

        try {
            await updateCaseStatus(caseId, newStatus);
            router.refresh();
        } catch (error) {
            console.error(error);
            setStatus(currentStatus);
            alert("Statü güncellenemedi. Yetkinizi kontrol edin.");
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="flex items-center gap-2">
            {isUpdating && <Loader2 className="w-4 h-4 animate-spin text-neutral-400" />}
            <select
                value={status}
                onChange={handleStatusChange}
                disabled={isUpdating}
                className="bg-neutral-800 border border-neutral-700 text-white text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5"
            >
                {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                        {t(s)}
                    </option>
                ))}
            </select>
        </div>
    );
}
