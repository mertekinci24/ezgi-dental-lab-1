import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

export default function Footer() {
    const t = useTranslations('Navigation');

    return (
        <footer className="bg-primary-dark text-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-2">
                        <span className="font-serif text-2xl font-bold tracking-tight">
                            Ezgi<span className="text-secondary">.</span>
                        </span>
                        <p className="mt-4 text-primary-light max-w-xs">
                            Premium dental solutions combining artistry with advanced technology.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-secondary">{t('services')}</h3>
                        <ul className="space-y-2 text-primary-light">
                            <li>Digital Smile Design</li>
                            <li>Implants</li>
                            <li>Orthodontics</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-secondary">Contact</h3>
                        <ul className="space-y-2 text-primary-light">
                            <li>info@ezgidental.com</li>
                            <li>+90 (212) 555 0123</li>
                            <li>Istanbul, Turkey</li>
                        </ul>
                    </div>
                </div>
                <div className="mt-12 pt-8 border-t border-white/10 text-center text-primary-light text-sm">
                    &copy; {new Date().getFullYear()} Ezgi Dental Clinic. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
