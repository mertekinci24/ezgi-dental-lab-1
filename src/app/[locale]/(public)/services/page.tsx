import { useTranslations } from 'next-intl';

export default function Services() {
    const t = useTranslations('Navigation');

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <h1 className="text-4xl font-bold text-primary-dark mb-8">{t('services')}</h1>
            <p className="text-lg text-foreground/70">
                Detailed service catalog coming soon.
            </p>
        </div>
    );
}
