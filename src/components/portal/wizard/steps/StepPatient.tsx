import { useTranslations } from 'next-intl';

type Props = {
    data: { name: string; gender: string; age: string; caseType: string };
    updateData: (key: string, value: any) => void;
};

export default function StepPatient({ data, updateData }: Props) {
    const t = useTranslations('Portal.NewCase.patientInfo');

    return (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">
                    {t('fullName')}
                </label>
                <input
                    type="text"
                    value={data.name}
                    onChange={(e) => updateData('name', e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-100 focus:outline-none focus:border-blue-500 transition-colors"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-zinc-400 mb-3">
                    {t('gender')}
                </label>
                <div className="grid grid-cols-2 gap-4">
                    {['male', 'female'].map((gender) => (
                        <button
                            key={gender}
                            onClick={() => updateData('gender', gender)}
                            className={`p-4 rounded-lg border-2 transition-all ${data.gender === gender
                                    ? 'border-blue-500 bg-blue-900/20 text-blue-400'
                                    : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700'
                                }`}
                        >
                            {t(`genderOptions.${gender}`)}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1">
                        {t('age')}
                    </label>
                    <input
                        type="text"
                        value={data.age}
                        onChange={(e) => updateData('age', e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-100 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1">
                        {t('caseType')}
                    </label>
                    <select
                        value={data.caseType}
                        onChange={(e) => updateData('caseType', e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-100 focus:outline-none focus:border-blue-500 transition-colors"
                    >
                        <option value="fixed">{t('types.fixed')}</option>
                        <option value="removable">{t('types.removable')}</option>
                        <option value="implant">{t('types.implant')}</option>
                    </select>
                </div>
            </div>
        </div>
    );
}
