import { useTranslations } from 'next-intl';

type Props = {
    material: string;
    shades: { body: string; stump: string };
    updateMaterial: (value: string) => void;
    updateShade: (key: string, value: string) => void;
};

export default function StepMaterial({ material, shades, updateMaterial, updateShade }: Props) {
    const t = useTranslations('Portal.NewCase.material');

    const materials = ['zirconia_ml', 'zirconia_cb', 'emax_press', 'metal_porcelain', 'pmma'];

    return (
        <div className="space-y-8">
            <div>
                <label className="block text-sm font-medium text-zinc-400 mb-3">
                    {t('type')}
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {materials.map((mat) => (
                        <button
                            key={mat}
                            onClick={() => updateMaterial(mat)}
                            className={`p-4 rounded-lg border text-left transition-all ${material === mat
                                    ? 'border-blue-500 bg-blue-900/20 text-blue-400'
                                    : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700'
                                }`}
                        >
                            {t(`options.${mat}`)}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
                <h4 className="text-zinc-200 font-medium mb-4">{t('shadeInfo')}</h4>
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1">
                            {t('bodyShade')}
                        </label>
                        <select
                            value={shades.body}
                            onChange={(e) => updateShade('body', e.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-100 focus:outline-none focus:border-blue-500"
                        >
                            <option value="">Seçiniz</option>
                            {['A1', 'A2', 'A3', 'A3.5', 'B1', 'B2', 'C1', 'D2', 'BL1', 'BL2'].map((s) => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1">
                            {t('stumpShade')}
                        </label>
                        <select
                            value={shades.stump}
                            onChange={(e) => updateShade('stump', e.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-100 focus:outline-none focus:border-blue-500"
                        >
                            <option value="">Seçiniz</option>
                            {['ND1', 'ND2', 'ND3', 'ND4', 'ND5', 'ND6'].map((s) => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                        <p className="text-xs text-zinc-500 mt-2">{t('stumpHint')}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
