import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Leaf, Zap, Target } from 'lucide-react';

export default function Home() {
  const t = useTranslations('HomePage');

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-dark to-primary py-24 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl sm:text-6xl font-bold text-white tracking-tight mb-6 font-serif">
            {t('title')}
          </h1>
          <p className="text-xl sm:text-2xl text-primary-light mb-8 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
          <p className="text-lg text-white/80 mb-10 max-w-3xl mx-auto">
            {t('description')}
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/portal"
              className="bg-secondary hover:bg-secondary/90 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              {t('getStarted')}
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Feature 1 */}
            <div className="bg-surface-alt p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-primary/5">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-primary-dark mb-3">{t('features.precision.title')}</h3>
              <p className="text-foreground/70">{t('features.precision.desc')}</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-surface-alt p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-primary/5">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary">
                <Leaf className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-primary-dark mb-3">{t('features.sustainability.title')}</h3>
              <p className="text-foreground/70">{t('features.sustainability.desc')}</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-surface-alt p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-primary/5">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-primary-dark mb-3">{t('features.speed.title')}</h3>
              <p className="text-foreground/70">{t('features.speed.desc')}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
