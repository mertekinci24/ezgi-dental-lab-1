'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stage, OrbitControls } from '@react-three/drei';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { useLoader } from '@react-three/fiber';
import { Loader2, AlertCircle, RotateCcw } from 'lucide-react';

function Model({ url }: { url: string }) {
    const geometry = useLoader(STLLoader, url);
    return (
        <mesh geometry={geometry} castShadow receiveShadow>
            <meshStandardMaterial color="#e4e4e7" roughness={0.5} metalness={0.1} />
        </mesh>
    );
}

export default function ThreeDViewer({ url, onClose }: { url: string; onClose: () => void }) {
    const [error, setError] = useState(false);

    // Mock URL veya Geçersiz URL Kontrolü
    if (url.includes("MOCK") || url === "#") {
        return (
            <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-12 text-center flex flex-col items-center justify-center h-[400px]">
                <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                    <AlertCircle className="w-8 h-8 text-yellow-500" />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">Önizleme Kullanılamıyor</h3>
                <p className="text-zinc-400 text-sm max-w-md">
                    Bu dosya "Simülasyon Modu"nda yüklendiği için 3D verisi içermemektedir. Gerçek önizleme için S3 bağlantısı gereklidir.
                </p>
                <button onClick={onClose} className="mt-6 text-zinc-300 hover:text-white underline text-sm">
                    Kapat
                </button>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-zinc-900 rounded-xl border border-red-900/50 p-12 text-center h-[400px] flex flex-col items-center justify-center">
                <AlertCircle className="w-10 h-10 text-red-500 mb-4" />
                <p className="text-red-200">Dosya formatı desteklenmiyor veya dosya bozuk.</p>
                <button onClick={onClose} className="mt-4 text-zinc-400 hover:text-white text-sm">Geri Dön</button>
            </div>
        );
    }

    return (
        <div className="relative h-[500px] w-full bg-zinc-950 rounded-xl border border-zinc-800 overflow-hidden">
            <div className="absolute top-4 right-4 z-10">
                <button onClick={onClose} className="bg-zinc-800 hover:bg-zinc-700 text-white p-2 rounded-lg text-xs transition-colors">
                    Kapat
                </button>
            </div>

            <Suspense fallback={
                <div className="absolute inset-0 flex items-center justify-center text-white gap-3">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                    <span className="text-sm">Model Yükleniyor...</span>
                </div>
            }>
                <ErrorBoundary fallback={() => setError(true)}>
                    <Canvas shadows dpr={[1, 2]} camera={{ fov: 50, position: [0, 0, 100] }}>
                        <Stage environment="city" intensity={0.6}>
                            <Model url={url} />
                        </Stage>
                        <OrbitControls makeDefault />
                    </Canvas>
                </ErrorBoundary>
            </Suspense>

            <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur text-zinc-400 text-[10px] px-3 py-2 rounded border border-zinc-800">
                Sol Tık: Döndür | Sağ Tık: Taşı | Tekerlek: Yaklaş
            </div>
        </div>
    );
}

class ErrorBoundary extends React.Component<{ fallback: () => void, children: React.ReactNode }> {
    state = { hasError: false };
    static getDerivedStateFromError() { return { hasError: true }; }
    componentDidCatch() { this.props.fallback(); }
    render() { return this.state.hasError ? null : this.props.children; }
}
