'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronRight, ChevronLeft, Check } from 'lucide-react';
import StepPatient from './steps/StepPatient';
import StepOdontogram from './steps/StepOdontogram';
import StepMaterial from './steps/StepMaterial';
import StepPreferences from './steps/StepPreferences';
import StepReview from './steps/StepReview';
import { submitCase } from '@/actions/create-case';
import { useRouter } from '@/i18n/routing';

type WizardState = {
    step: number;
    patient: { name: string; gender: string; age: string; caseType: string };
    selectedTeeth: number[];
    material: string;
    shades: { body: string; stump: string };
    preferences: { occlusion: string; contact: string; margin: string; notes?: string };
    dueDate: Date;
};

export default function CreateCaseWizard() {
    const t = useTranslations('Portal.NewCase');
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [state, setState] = useState<WizardState>({
        step: 1,
        patient: { name: '', gender: '', age: '', caseType: 'fixed' },
        selectedTeeth: [],
        material: '',
        shades: { body: '', stump: '' },
        preferences: { occlusion: 'light', contact: 'point', margin: 'shoulder', notes: '' },
        dueDate: new Date()
    });

    const updatePatient = (key: string, value: any) => {
        setState(prev => ({ ...prev, patient: { ...prev.patient, [key]: value } }));
    };

    const toggleTooth = (tooth: number) => {
        setState(prev => {
            const exists = prev.selectedTeeth.includes(tooth);
            return {
                ...prev,
                selectedTeeth: exists
                    ? prev.selectedTeeth.filter(t => t !== tooth)
                    : [...prev.selectedTeeth, tooth]
            };
        });
    };

    const updateMaterial = (value: string) => {
        setState(prev => ({ ...prev, material: value }));
    };

    const updateShade = (key: string, value: string) => {
        setState(prev => ({ ...prev, shades: { ...prev.shades, [key]: value } }));
    };

    const updatePreference = (key: string, value: string) => {
        setState(prev => ({ ...prev, preferences: { ...prev.preferences, [key]: value } }));
    };

    const validateStep = (step: number): boolean => {
        switch (step) {
            case 1:
                return !!state.patient.name && !!state.patient.gender;
            case 2:
                return state.selectedTeeth.length > 0;
            case 3:
                return !!state.material && !!state.shades.body;
            default:
                return true;
        }
    };

    const nextStep = () => {
        if (validateStep(state.step)) {
            setState(prev => ({ ...prev, step: Math.min(prev.step + 1, 5) }));
        } else {
            alert('Lütfen zorunlu alanları doldurunuz.');
        }
    };

    const prevStep = () => {
        setState(prev => ({ ...prev, step: Math.max(prev.step - 1, 1) }));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const result = await submitCase({
                patient: state.patient,
                selectedTeeth: state.selectedTeeth,
                material: state.material,
                shades: state.shades,
                preferences: state.preferences,
                dueDate: state.dueDate
            });

            if (result.success) {
                router.push('/portal');
                router.refresh();
            } else {
                alert('Hata: ' + result.message);
            }
        } catch (error) {
            console.error(error);
            alert('Beklenmeyen bir hata oluştu.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const steps = ['patient', 'odontogram', 'material', 'preferences', 'review'];

    return (
        <div className="max-w-4xl mx-auto">
            {/* Stepper Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-zinc-100 mb-6">{t('title')}</h1>
                <div className="flex items-center justify-between relative">
                    <div className="absolute left-0 top-1/2 w-full h-1 bg-zinc-800 -z-10 rounded-full"></div>
                    {steps.map((stepKey, index) => {
                        const stepNum = index + 1;
                        const isActive = stepNum === state.step;
                        const isCompleted = stepNum < state.step;

                        return (
                            <div key={stepKey} className="flex flex-col items-center gap-2 bg-zinc-950 px-2">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50 scale-110' :
                                    isCompleted ? 'bg-green-500 text-zinc-950' :
                                        'bg-zinc-800 text-zinc-500'
                                    }`}>
                                    {isCompleted ? <Check className="w-5 h-5" /> : stepNum}
                                </div>
                                <span className={`text-xs font-medium ${isActive ? 'text-blue-400' : 'text-zinc-500'
                                    }`}>
                                    {t(`steps.${stepKey}`)}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Content Card */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-8 shadow-xl">
                {state.step === 1 && <StepPatient data={state.patient} updateData={updatePatient} />}
                {state.step === 2 && <StepOdontogram selectedTeeth={state.selectedTeeth} toggleTooth={toggleTooth} />}
                {state.step === 3 && <StepMaterial material={state.material} shades={state.shades} updateMaterial={updateMaterial} updateShade={updateShade} />}
                {state.step === 4 && <StepPreferences preferences={state.preferences} updatePreference={updatePreference} />}
                {state.step === 5 && <StepReview data={state} />}

                {/* Actions */}
                <div className="flex justify-between mt-8 pt-6 border-t border-zinc-800">
                    <button
                        onClick={prevStep}
                        disabled={state.step === 1 || isSubmitting}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${state.step === 1
                            ? 'text-zinc-600 cursor-not-allowed'
                            : 'text-zinc-300 hover:bg-zinc-900'
                            }`}
                    >
                        <ChevronLeft className="w-5 h-5" />
                        {t('actions.back')}
                    </button>

                    {state.step < 5 ? (
                        <button
                            onClick={nextStep}
                            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors shadow-lg shadow-blue-900/20"
                        >
                            {t('actions.next')}
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-500 text-white rounded-lg font-medium transition-colors shadow-lg shadow-green-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                            ) : (
                                <Check className="w-5 h-5" />
                            )}
                            {isSubmitting ? t('actions.submitting') : t('actions.submit')}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
