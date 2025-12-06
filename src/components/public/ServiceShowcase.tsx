'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import Image from 'next/image';

const FEATURES = [
    {
        id: 1,
        title: "CAD/CAM Hassasiyeti",
        subtitle: "MİKRON SEVİYESİNDE UYUM",
        desc: "5 eksenli modern kazıma ünitelerimizle mikron seviyesinde uyum. İnsan hatasını ortadan kaldıran tam dijital iş akışı.",
        points: ["5 Eksenli CNC", "Dijital Tarama", "Hatasız Marjin"],
        image: "/images/services/cad-cam-hassasiyeti.avif"
    },
    {
        id: 2,
        title: "Zirkonyum Estetiği",
        subtitle: "DOĞAL DİŞ YANSIMASI",
        desc: "Işık geçirgenliği doğal dişi birebir taklit eden, yüksek dayanıklılığa sahip monolitik ve tabakalı zirkonyum çözümleri.",
        points: ["Yüksek Translusens", "1200 MPa Dayanıklılık", "Biyouyumlu"],
        image: "/images/services/zirkonyum-estetigi.avif"
    },
    {
        id: 3,
        title: "İmplant Üstü Çözümler",
        subtitle: "GÜÇLÜ ALTYAPI",
        desc: "Vidalı veya simante hibrit yapılar. Tüm majör implant markalarıyla tam uyumlu orijinal bağlantı parçaları.",
        points: ["Custom Abutment", "All-on-4 / All-on-6", "Hibrit Barlar"],
        image: "/images/services/implant-cozumleri.avif"
    },
    {
        id: 4,
        title: "E.max Laminate",
        subtitle: "MİNİMAL İNVAZİV",
        desc: "Mükemmel estetik için lityum disilikat cam seramik. İnce yapısıyla doğal diş dokusunu korurken maksimum estetik sağlar.",
        points: ["Yüksek Estetik", "Dayanıklı Yapı", "Doğal Görünüm"],
        image: "/images/services/emax-laminate.jpg"
    },
    {
        id: 5,
        title: "Dijital Gülüş Tasarımı",
        subtitle: "TEDAVİ ÖNCESİ VİZYON",
        desc: "Hastanıza sonucu göstermeden işe başlamayın. Yüz hatlarına uygun sanal planlama ve Mock-up üretimi.",
        points: ["3D Mock-up", "Yüz Analizi", "Hasta İknası"],
        image: "/images/services/dijital-gulus-tasarimi.avif"
    },
    {
        id: 6,
        title: "Şeffaf Plaklar",
        subtitle: "ORTHO & BRUKSİZM",
        desc: "Telsiz ortodonti ve gece plakları için 3D baskı teknolojisi ile üretilen hassas ve konforlu plaklar.",
        points: ["Görünmez Tedavi", "Konforlu Kullanım", "Hızlı Üretim"],
        image: "/images/services/seffaf-plaklar.jpg"
    }
];

// FeatureCard (Geri Scroll Destekli)
function FeatureCard({ item, setFeatureId, activeId, index }: { item: typeof FEATURES[0], setFeatureId: (id: number) => void, activeId: number, index: number }) {
    const ref = useRef<HTMLDivElement>(null);
    // Tetikleme hassasiyetini artırdık
    const isInView = useInView(ref, { margin: "-50% 0px -50% 0px" });

    useEffect(() => {
        if (isInView) {
            // Ekrana girince Aktif yap
            setFeatureId(item.id);
        } else if (activeId === item.id) {
            // Eğer aktif kart buysa ve ekrandan çıkıyorsa...
            const rect = ref.current?.getBoundingClientRect();
            // Eğer kart aşağı doğru kayıp gittiyse (Yani kullanıcı YUKARI scroll yaptıysa)
            if (rect && rect.top > window.innerHeight / 2) {
                // Bir önceki kartı aktif et
                setFeatureId(Math.max(1, item.id - 1));
            }
        }
    }, [isInView, item.id, activeId, setFeatureId]);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="sticky bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-xl mb-8 z-10"
            style={{
                top: `${150 + (index * 40)}px`, // Stacking mesafesi artırıldı (40px)
                minHeight: '350px'
            }}
        >
            <div className="flex items-center gap-4 mb-4">
                <span className="text-blue-500 text-xs font-bold tracking-widest uppercase bg-blue-900/20 px-2 py-1 rounded">
                    {item.subtitle}
                </span>
            </div>

            <h3 className="text-2xl font-bold text-white mb-4">
                {item.title}
            </h3>

            <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                {item.desc}
            </p>

            <div className="border-t border-zinc-800 pt-4">
                <ul className="space-y-2">
                    {item.points.slice(0, 3).map((point, i) => (
                        <li key={i} className="flex items-center gap-2 text-zinc-500 text-xs">
                            <CheckCircle2 className="w-4 h-4 text-blue-500" />
                            <span>{point}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </motion.div>
    );
}

export default function ServiceShowcase() {
    const [activeFeatureId, setActiveFeatureId] = useState(1);

    return (
        <section className="bg-zinc-950 py-24">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">

                    {/* SOL KOLON (Sticky Image Container) */}
                    <div className="hidden lg:block w-1/2 h-[500px] sticky top-32 z-0">
                        <div className="relative w-full h-full rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-2xl">
                            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent z-10" />

                            {FEATURES.map((item) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: activeFeatureId === item.id ? 1 : 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="absolute inset-0"
                                >
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        unoptimized={false}
                                    />
                                </motion.div>
                            ))}

                            {/* Başlık Overlay */}
                            <div className="absolute bottom-8 left-8 z-20">
                                <motion.p
                                    key={activeFeatureId}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="text-3xl font-bold text-white"
                                >
                                    {FEATURES.find(f => f.id === activeFeatureId)?.title}
                                </motion.p>
                            </div>
                        </div>
                    </div>

                    {/* SAĞ KOLON (Stacked Cards) */}
                    <div className="w-full lg:w-1/2 pb-24 relative">
                        {FEATURES.map((item, index) => (
                            <FeatureCard
                                key={item.id}
                                item={item}
                                setFeatureId={setActiveFeatureId}
                                activeId={activeFeatureId}
                                index={index}
                            />
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
}
