'use client';
import { Construction } from 'lucide-react';

export default function ComingSoon({ title }: { title: string }) {
    return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-zinc-500">
            <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mb-4 border border-zinc-800">
                <Construction className="w-8 h-8 text-yellow-500" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">{title}</h2>
            <p className="text-sm">Bu modül geliştirme aşamasındadır.</p>
        </div>
    );
}
