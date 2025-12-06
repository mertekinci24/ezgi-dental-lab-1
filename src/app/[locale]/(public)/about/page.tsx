import { useTranslations } from 'next-intl';
import { Target, Eye, Users, Quote } from 'lucide-react';

export default function About() {
    const t = useTranslations('AboutPage');

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

            {/* Founder's Message (Bio) */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="bg-zinc-900 p-10 rounded-2xl border border-zinc-800 relative">
                    <Quote className="absolute top-8 left-8 w-12 h-12 text-blue-900/40" />
                    <div className="relative z-10">
                        <h2 className="text-2xl font-bold text-zinc-100 mb-6 flex items-center gap-3">
                            {t('bio.title')}
                        </h2>
                        <p className="text-lg text-zinc-400 leading-relaxed italic">
                            "{t('bio.text')}"
                        </p>
                    </div>
                </div>
            </div>

            {/* Mission & Vision Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Mission */}
                    <div className="bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800 hover:border-blue-900/50 transition-colors">
                        <div className="w-12 h-12 bg-blue-900/20 rounded-xl flex items-center justify-center mb-6 text-blue-500">
                            <Target className="w-6 h-6" />
                        </div>
                        <h2 className="text-2xl font-bold text-zinc-100 mb-4">{t('mission.title')}</h2>
                        <p className="text-zinc-400 leading-relaxed">
                            {t('mission.desc')}
                        </p>
                    </div>

                    {/* Vision */}
                    <div className="bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800 hover:border-purple-900/50 transition-colors">
                        <div className="w-12 h-12 bg-purple-900/20 rounded-xl flex items-center justify-center mb-6 text-purple-500">
                            <Eye className="w-6 h-6" />
                        </div>
                        <h2 className="text-2xl font-bold text-zinc-100 mb-4">{t('vision.title')}</h2>
                        <p className="text-zinc-400 leading-relaxed">
                            {t('vision.desc')}
                        </p>
                    </div>
                </div>
            </div>

            {/* Team Section Placeholder */}
            <div className="bg-zinc-900/30 py-24 border-t border-zinc-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-zinc-800 rounded-full mb-6 text-zinc-400">
                        <Users className="w-8 h-8" />
                    </div>
                    <h2 className="text-3xl font-bold text-zinc-100 mb-8">{t('team')}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-zinc-950 p-6 rounded-xl border border-zinc-800">
                                <div className="w-24 h-24 bg-zinc-800 rounded-full mx-auto mb-4"></div>
                                <div className="h-4 w-32 bg-zinc-800 rounded mx-auto mb-2"></div>
                                <div className="h-3 w-20 bg-zinc-900 rounded mx-auto"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
