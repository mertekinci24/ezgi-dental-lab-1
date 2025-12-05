import { useTranslations } from 'next-intl';

type Props = {
    data: any;
};

export default function StepReview({ data }: Props) {
    const t = useTranslations('Portal.NewCase');

    const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4 mb-4">
            <h4 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-3 border-b border-zinc-800 pb-2">
                {title}
            </h4>
            <div className="space-y-2">
                {children}
            </div>
        </div>
    );

    const Row = ({ label, value }: { label: string; value: string | number }) => (
        <div className="flex justify-between text-sm">
            <span className="text-zinc-400">{label}:</span>
            <span className="text-zinc-200 font-medium">{value}</span>
        </div>
    );

    return (
        <div>
            <Section title={t('steps.patient')}>
                <Row label={t('patientInfo.fullName')} value={data.patient.name} />
                <Row label={t('patientInfo.gender')} value={t(`patientInfo.genderOptions.${data.patient.gender}`)} />
                <Row label={t('patientInfo.age')} value={data.patient.age} />
                <Row label={t('patientInfo.caseType')} value={t(`patientInfo.types.${data.patient.caseType}`)} />
            </Section>

            <Section title={t('steps.odontogram')}>
                <div className="text-zinc-200 font-medium">
                    {data.selectedTeeth.sort((a: number, b: number) => a - b).join(', ')}
                </div>
            </Section>

            <Section title={t('steps.material')}>
                <Row label={t('material.type')} value={t(`material.options.${data.material}`)} />
                <Row label={t('material.bodyShade')} value={data.shades.body} />
                {data.shades.stump && (
                    <Row label={t('material.stumpShade')} value={data.shades.stump} />
                )}
            </Section>

            <Section title={t('steps.preferences')}>
                <Row label={t('preferences.occlusion')} value={t(`preferences.occlusionOpts.${data.preferences.occlusion}`)} />
                <Row label={t('preferences.contact')} value={t(`preferences.contactOpts.${data.preferences.contact}`)} />
                <Row label={t('preferences.margin')} value={t(`preferences.marginOpts.${data.preferences.margin}`)} />
            </Section>
        </div>
    );
}
