import { useTranslations } from 'next-intl';
import { Diamond, Layers, Anchor, Monitor, Cpu, Smile } from 'lucide-react';
import PortfolioMarquee from '@/components/public/PortfolioMarquee';
import ServiceShowcase from '@/components/public/ServiceShowcase';

export default function Services() {
    const t = useTranslations('ServicesPage');

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-300">
            {/* Header */}
            <div className="bg-zinc-900/50 py-24 border-b border-zinc-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-zinc-100 mb-6 font-serif">
                        {t('title')}
                    </h1>
                    <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
                        {t('subtitle')}
                    </p>
                </div>
            </div>

            {/* Services Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* Zirconia */}
                    <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 hover:border-blue-900/50 transition-all hover:shadow-lg hover:shadow-blue-900/10 group">
                        <div className="w-12 h-12 bg-blue-900/20 rounded-xl flex items-center justify-center mb-6 text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <Diamond className="w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-bold text-zinc-100 mb-3">{t('items.zirconia.title')}</h3>
                        <p className="text-zinc-400 mb-4">{t('items.zirconia.desc')}</p>
                        <p className="text-xs font-mono text-zinc-500 border-t border-zinc-800 pt-4">
                            {t('items.zirconia.detail')}
                        </p>
                    </div>

                    {/* E.max */}
                    <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 hover:border-purple-900/50 transition-all hover:shadow-lg hover:shadow-purple-900/10 group">
                        <div className="w-12 h-12 bg-purple-900/20 rounded-xl flex items-center justify-center mb-6 text-purple-500 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                            <Layers className="w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-bold text-zinc-100 mb-3">{t('items.emax.title')}</h3>
                        <p className="text-zinc-400 mb-4">{t('items.emax.desc')}</p>
                        <p className="text-xs font-mono text-zinc-500 border-t border-zinc-800 pt-4">
                            {t('items.emax.detail')}
                        </p>
                    </div>

                    {/* Implant */}
                    <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 hover:border-green-900/50 transition-all hover:shadow-lg hover:shadow-green-900/10 group">
                        <div className="w-12 h-12 bg-green-900/20 rounded-xl flex items-center justify-center mb-6 text-green-500 group-hover:bg-green-600 group-hover:text-white transition-colors">
                            <Anchor className="w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-bold text-zinc-100 mb-3">{t('items.implant.title')}</h3>
                        <p className="text-zinc-400 mb-4">{t('items.implant.desc')}</p>
                        <p className="text-xs font-mono text-zinc-500 border-t border-zinc-800 pt-4">
                            {t('items.implant.detail')}
                        </p>
                    </div>

                    {/* Digital */}
                    <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 hover:border-orange-900/50 transition-all hover:shadow-lg hover:shadow-orange-900/10 group">
                        <div className="w-12 h-12 bg-orange-900/20 rounded-xl flex items-center justify-center mb-6 text-orange-500 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                            <Monitor className="w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-bold text-zinc-100 mb-3">{t('items.digital.title')}</h3>
                        <p className="text-zinc-400 mb-4">{t('items.digital.desc')}</p>
                        <p className="text-xs font-mono text-zinc-500 border-t border-zinc-800 pt-4">
                            {t('items.digital.detail')}
                        </p>
                    </div>

                    {/* CAD/CAM */}
                    <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 hover:border-cyan-900/50 transition-all hover:shadow-lg hover:shadow-cyan-900/10 group">
                        <div className="w-12 h-12 bg-cyan-900/20 rounded-xl flex items-center justify-center mb-6 text-cyan-500 group-hover:bg-cyan-600 group-hover:text-white transition-colors">
                            <Cpu className="w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-bold text-zinc-100 mb-3">{t('items.cadcam.title')}</h3>
                        <p className="text-zinc-400 mb-4">{t('items.cadcam.desc')}</p>
                        <p className="text-xs font-mono text-zinc-500 border-t border-zinc-800 pt-4">
                            {t('items.cadcam.detail')}
                        </p>
                    </div>

                    {/* Ortho */}
                    <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 hover:border-pink-900/50 transition-all hover:shadow-lg hover:shadow-pink-900/10 group">
                        <div className="w-12 h-12 bg-pink-900/20 rounded-xl flex items-center justify-center mb-6 text-pink-500 group-hover:bg-pink-600 group-hover:text-white transition-colors">
                            <Smile className="w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-bold text-zinc-100 mb-3">{t('items.ortho.title')}</h3>
                        <p className="text-zinc-400 mb-4">{t('items.ortho.desc')}</p>
                        <p className="text-xs font-mono text-zinc-500 border-t border-zinc-800 pt-4">
                            {t('items.ortho.detail')}
                        </p>
                    </div>

                </div>
            </div>

            {/* Zigzag Showcase */}
            <ServiceShowcase />

            {/* Marquee Section */}
            <div className="pb-24">
                <div className="text-center mb-8">
                    <h2 className="text-xl font-bold text-zinc-500 uppercase tracking-widest">{t('marqueeTitle')}</h2>
                </div>
                <PortfolioMarquee />
            </div>
        </div>
    );
}
