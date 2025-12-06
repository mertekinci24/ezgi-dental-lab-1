'use client';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const ITEMS = [
    { id: 1, text: "Zirconia Multi-Layer" },
    { id: 2, text: "E.max Press" },
    { id: 3, text: "Implant Abutments" },
    { id: 4, text: "Digital Smile Design" },
    { id: 5, text: "Hybrid Dentures" },
];

export default function PortfolioMarquee() {
    return (
        <div className="relative flex overflow-hidden bg-zinc-950 border-y border-zinc-800 py-8">
            <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-r from-zinc-950 via-transparent to-zinc-950" />
            <motion.div
                className="flex gap-16 whitespace-nowrap"
                animate={{ x: [0, -1000] }}
                transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
            >
                {[...ITEMS, ...ITEMS, ...ITEMS].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 text-2xl font-bold text-zinc-700">
                        <span>{item.text}</span>
                        <ArrowRight className="w-6 h-6 opacity-20" />
                    </div>
                ))}
            </motion.div>
        </div>
    );
}
