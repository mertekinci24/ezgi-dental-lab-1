import { useTranslations } from 'next-intl';

type Props = {
    selectedTeeth: number[];
    toggleTooth: (tooth: number) => void;
};

export default function StepOdontogram({ selectedTeeth, toggleTooth }: Props) {
    const t = useTranslations('Portal.NewCase.odontogram');

    // FDI Quadrants
    const q1 = [18, 17, 16, 15, 14, 13, 12, 11];
    const q2 = [21, 22, 23, 24, 25, 26, 27, 28];
    const q3 = [48, 47, 46, 45, 44, 43, 42, 41];
    const q4 = [31, 32, 33, 34, 35, 36, 37, 38];

    const ToothButton = ({ number }: { number: number }) => {
        const isSelected = selectedTeeth.includes(number);
        return (
            <button
                onClick={() => toggleTooth(number)}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${isSelected
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50 scale-110'
                        : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:border-zinc-600'
                    }`}
            >
                {number}
            </button>
        );
    };

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h3 className="text-lg font-medium text-zinc-200 mb-2">{t('title')}</h3>
                <p className="text-sm text-zinc-500">{t('instruction')}</p>
            </div>

            <div className="flex flex-col items-center gap-8 p-6 bg-zinc-950/50 rounded-xl border border-zinc-800/50">
                {/* Upper Jaw */}
                <div className="flex gap-8">
                    <div className="flex gap-2">
                        {q1.map((t) => <ToothButton key={t} number={t} />)}
                    </div>
                    <div className="w-px bg-zinc-800"></div>
                    <div className="flex gap-2">
                        {q2.map((t) => <ToothButton key={t} number={t} />)}
                    </div>
                </div>

                {/* Lower Jaw */}
                <div className="flex gap-8">
                    <div className="flex gap-2">
                        {q3.map((t) => <ToothButton key={t} number={t} />)}
                    </div>
                    <div className="w-px bg-zinc-800"></div>
                    <div className="flex gap-2">
                        {q4.map((t) => <ToothButton key={t} number={t} />)}
                    </div>
                </div>
            </div>

            {selectedTeeth.length > 0 && (
                <div className="bg-blue-900/20 border border-blue-900/50 p-4 rounded-lg">
                    <span className="text-blue-400 font-medium">{t('selected')}: </span>
                    <span className="text-zinc-300">
                        {selectedTeeth.sort((a, b) => a - b).join(', ')}
                    </span>
                </div>
            )}
        </div>
    );
}
