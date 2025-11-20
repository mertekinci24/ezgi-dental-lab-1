import { useTranslations } from 'next-intl';
import { Upload, Save } from 'lucide-react';

export default function NewCase() {
    const t = useTranslations('Portal.NewCase');

    return (
        <div className="min-h-screen bg-surface-alt p-8">
            <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg border border-primary/10 overflow-hidden">
                <div className="bg-primary p-6">
                    <h1 className="text-2xl font-bold text-white">{t('title')}</h1>
                </div>

                <form className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-foreground/70 mb-2">{t('patientName')}</label>
                            <input type="text" className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground/70 mb-2">{t('toothNumber')}</label>
                            <input type="text" placeholder="e.g., 11, 21" className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-foreground/70 mb-2">{t('restorationType')}</label>
                            <select className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white">
                                <option value="crown">{t('types.crown')}</option>
                                <option value="bridge">{t('types.bridge')}</option>
                                <option value="implant">{t('types.implant')}</option>
                                <option value="veneer">{t('types.veneer')}</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground/70 mb-2">{t('shade')}</label>
                            <input type="text" placeholder="e.g., A2" className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground/70 mb-2">{t('notes')}</label>
                        <textarea rows={4} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"></textarea>
                    </div>

                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer bg-surface-alt/50">
                        <Upload className="w-10 h-10 text-primary/50 mx-auto mb-4" />
                        <p className="text-foreground/60 font-medium">{t('upload')}</p>
                        <p className="text-xs text-foreground/40 mt-2">STL, PLY, OBJ (Max 50MB)</p>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button type="button" className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-lg flex items-center gap-2 shadow-lg transition-colors font-medium">
                            <Save className="w-5 h-5" />
                            {t('submit')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
