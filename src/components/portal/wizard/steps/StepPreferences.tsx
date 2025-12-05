import { useTranslations } from 'next-intl';

type Props = {
    preferences: { occlusion: string; contact: string; margin: string; notes?: string };
    updatePreference: (key: string, value: string) => void;
};

export default function StepPreferences({ preferences, updatePreference }: Props) {
    const t = useTranslations('Portal.NewCase.preferences');

    const renderRadioGroup = (key: 'occlusion' | 'contact' | 'margin', options: string[]) => (
        <div className="mb-6">
            <label className="block text-sm font-medium text-zinc-400 mb-3">
                {t(key)}
            </label>
            <div className="grid grid-cols-3 gap-3">
                {options.map((opt) => (
                    <button
                        key={opt}
                        onClick={() => updatePreference(key, opt)}
                        className={`p-3 rounded-lg border text-sm transition-all ${preferences[key] === opt
                            ? 'border-blue-500 bg-blue-900/20 text-blue-400'
                            : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700'
                            }`}
                    >
                        {t(`${key}Opts.${opt}`)}
                    </button>
                ))}
            </div>
        </div>
    );

    return (
        <div className="space-y-2">
            {renderRadioGroup('occlusion', ['none', 'light', 'tight'])}
            {renderRadioGroup('contact', ['point', 'broad', 'passive'])}
            {renderRadioGroup('margin', ['shoulder', 'knife'])}

            <div className="mt-4">
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                    {t('notes')}
                </label>
                <textarea
                    value={preferences.notes || ''}
                    onChange={(e) => updatePreference('notes', e.target.value)}
                    className="w-full p-3 border border-zinc-800 bg-zinc-900 rounded-lg text-sm text-zinc-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder-zinc-600"
                    placeholder={t('notesPlaceholder')}
                    rows={4}
                />
            </div>
        </div>
    );
}
