import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

export default function Navbar() {
    const t = useTranslations('Navigation');

    return (
        <nav className="bg-surface/90 backdrop-blur-md border-b border-primary/10 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20">
                    <div className="flex items-center">
                        <Link href="/" className="flex-shrink-0 flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary rounded-tr-lg rounded-bl-lg"></div>
                            <span className="font-serif text-2xl font-bold text-primary-dark tracking-tight">
                                Ezgi<span className="text-secondary">.</span>
                            </span>
                        </Link>
                    </div>

                    <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-8">
                        <Link href="/" className="text-foreground/80 hover:text-primary px-3 py-2 text-sm font-medium transition-colors">
                            {t('home')}
                        </Link>
                        <Link href="/services" className="text-foreground/80 hover:text-primary px-3 py-2 text-sm font-medium transition-colors">
                            {t('services')}
                        </Link>
                        <Link href="/about" className="text-foreground/80 hover:text-primary px-3 py-2 text-sm font-medium transition-colors">
                            {t('about')}
                        </Link>
                        <Link
                            href="/portal"
                            className="bg-primary text-white hover:bg-primary-dark px-5 py-2.5 rounded-full text-sm font-medium transition-all shadow-lg shadow-primary/20"
                        >
                            {t('portal')}
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
