Ezgi Dental Lab Projesi İçin Kapsamlı Teknik Araştırma ve Mimari Tasarım Raporu
Yönetici Özeti
Dental laboratuvar endüstrisi, geleneksel zanaatkarlık ile yüksek teknolojili dijital üretimin (CAD/CAM) kesişim noktasında, kritik bir dönüşüm sürecinden geçmektedir. Ezgi Dental Lab projesi, bu dönüşümü yönetmek, klinik ve laboratuvar arasındaki iletişim kopukluklarını gidermek ve üretim süreçlerini optimize etmek amacıyla tasarlanan yeni nesil bir Dental Laboratuvar Yönetim Sistemi'dir (DLMS). Bu rapor, söz konusu sistemin PROJECT_CONTEXT.md dosyasının oluşturulmasına temel teşkil edecek teknik, operasyonel ve mimari gereksinimleri en ince ayrıntısına kadar incelemektedir.
Rapor kapsamında, dental iş mantığının karmaşık yapısı, diş hekimliği notasyon sistemlerinin (FDI, Universal) veri tabanı düzeyinde nasıl normalize edileceği, Next.js 16'nın sunduğu devrim niteliğindeki Server Actions ve React Server Components (RSC) mimarisinin projeye entegrasyonu, Auth.js v5 ile kurgulanan çok katmanlı güvenlik protokolleri ve büyük boyutlu 3D tarama dosyalarının (STL/PLY) tarayıcı tabanlı görüntülenmesi için gerekli WebGL optimizasyonları ele alınmıştır. Özellikle, Çok Kiracılı (Multi-Tenant) SaaS mimarisi üzerinde durulmuş, veri izolasyonu ve rol tabanlı yetkilendirme (RBAC) stratejileri, KVKK ve HIPAA uyumluluğu gözetilerek detaylandırılmıştır. Bu doküman, Ezgi Dental Lab'in sadece bir sipariş takip sistemi değil, aynı zamanda klinik karar destek mekanizması olarak işlev görmesini sağlayacak teknik vizyonu ortaya koymaktadır.
________________
Bölüm 1: Diş Laboratuvarı İş Alanı ve Gereksinim Analizi
Diş protez üretimi, standart bir e-ticaret veya üretim bandı işleyişinden radikal biçimde ayrışır. Her bir üretim ("Vaka" veya "Case"), hastaya özel biyolojik parametrelere (renk, oklüzyon, materyal toleransı) göre şekillenen, geri dönüşü maliyetli ve zaman alıcı olan "tekil" bir projedir. Bu bölümde, sistemin desteklemesi gereken operasyonel iş akışları ve veri noktaları derinlemesine analiz edilmiştir.
1.1 Dental Laboratuvar Ekosistemi ve İş Akışı Döngüsü
Bir dental laboratuvarın operasyonel omurgası, klinikten gelen reçete (Order) ile laboratuvardan çıkan bitmiş protez arasındaki döngüsel etkileşime dayanır. Dijitalleşme ile birlikte bu süreç, fiziksel ölçülerin kargolanmasından, dijital tarama dosyalarının (intraoral scan) bulut üzerinden aktarılmasına evrilmiştir.
1.1.1 Vaka Kabul ve Triyaj (Case Intake & Triage)
Süreç, diş hekiminin sisteme giriş yapıp yeni bir "Vaka" oluşturmasıyla başlar. Geleneksel sistemlerdeki kağıt formların aksine, Ezgi Dental Lab sistemi "Akıllı Reçete" (Smart Rx) mantığıyla çalışmalıdır.
* Doğrulama: Hekim "Zirkonyum Köprü" seçeneğini işaretlediğinde, sistem en az iki dayanak (abutment) ve bir gövde (pontic) dişi seçilmesini zorunlu kılmalıdır.
* Dosya Bütünlüğü: Dijital ölçü dosyaları (STL) yüklenmeden vakanın "Gönderildi" statüsüne geçmesine izin verilmemelidir.
* Triyaj: Laboratuvar tarafında, gelen vakalar "Kabul Bekliyor" havuzuna düşer. Burada deneyimli bir teknisyen, gelen taramanın kalitesini (marjinlerin netliği, oklüzal aralık) kontrol eder. Eğer tarama yetersizse, vaka "Reddedildi" veya "Ek Bilgi İsteniyor" statüsüne çekilerek hekime anlık bildirim gönderilir. Bu aşama, hatalı üretimden kaynaklanan maliyetleri engellemek için kritiktir.3
1.1.2 Üretim Takibi ve Alt Durumlar (Workflow State Machine)
Dental üretim lineer değildir. Bir vaka, kalite kontrol (QC) aşamasında başarısız olup tekrar porselen fırınlamasına dönebilir. Bu nedenle, basit bir status string alanı yerine, sonlu durum makinesi (Finite State Machine - FSM) mantığı kurgulanmalıdır.
Ana Durum
	Alt Durumlar
	Açıklama
	TASLAK (DRAFT)
	Veri Girişi, Dosya Yükleme
	Hekim henüz siparişi onaylamadı.
	ONAY BEKLİYOR
	Triyaj, Finansal Onay
	Lab yöneticisi vakayı inceliyor.
	ÜRETİMDE (WIP)
	Model Döküm, CAD Tasarım, CAM Kazıma, Sinterleme, Seramik Yığma, Glaze
	Vaka üretim bandında. Her alt adım, bir teknisyene atanabilir.
	DURAKLATILDI
	Hekimden Bilgi Bekleniyor, Teknik Sorun
	Marjin belirsizliği veya eksik parça nedeniyle süreç durdu.
	PROVA (TRY-IN)
	Metal Prova, Bisküvi Prova
	Bitmemiş iş, hekime provaya gönderildi ve geri gelecek.
	TAMAMLANDI
	Son QC, Faturalama, Paketleme
	Üretim bitti, sevkiyata hazır.
	SEVK EDİLDİ
	Kuryede, Teslim Edildi
	Lojistik süreci.
	Bu durum geçişleri, sistemde "Audit Log" (Denetim Kaydı) olarak saklanmalıdır. Kimin, ne zaman, hangi sebeple durumu değiştirdiği, ISO 13485 ve FDA süreçleri için kritik bir izlenebilirlik gerekliliğidir.2
1.2 Reçete (Rx) Veri Modellemesi ve Validasyon
Bir laboratuvar sipariş formu, sıradan bir e-ticaret siparişinden çok daha karmaşıktır. Hekimin istekleri, teknik bir şartname niteliğindedir. Bu verilerin yapılandırılmış (structured) olarak saklanması, veri madenciliği ve otomatik fiyatlandırma için elzemdir.
1.2.1 Restorasyon Hiyerarşisi
Ürün kataloğu düz bir liste olamaz. Hiyerarşik bir yapı gerektirir:
1. Kategori: Sabit (Fixed), Hareketli (Removable), İmplant Üstü, Ortodonti.
2. Alt Tip: Kron, Köprü, Veneer, Inlay, Onlay, Gece Plağı.
3. Materyal Ailesi:
   * Zirkonyum: Monolitik (Tam kontur) veya Cut-back (Porselen yığma).
   * Cam Seramik (E.max): Pres veya CAD blok.
   * Metal Destekli (PFM): Kıymetli, Yarı Kıymetli veya Baz Metal alaşım.
   * Geçici (PMMA): Uzun süreli veya kısa süreli.
4. Marka/Sistem: Katana, BruxZir, IPS e.max, Vita Suprinity.5
Sistem, hekimin "Zirkonyum" seçmesi durumunda, alt seçenek olarak "Monolitik" veya "Tabakalı" seçeneklerini dinamik olarak sunmalıdır. Bu, veritabanında ProductOption ve ProductOptionValue ilişkileriyle modellenmelidir.
1.2.2 Kritik Tercih Parametreleri
Bir restorasyonun başarısı, hekimin sübjektif tercihlerinin teknisyene doğru aktarılmasına bağlıdır. Bu parametreler veritabanında JSONB formatında veya normalize edilmiş EAV (Entity-Attribute-Value) tablolarında saklanabilir. Ezgi Dental Lab için, sorgulama performansı ve şema esnekliği dengesi açısından, bu tip "tercih" verilerinin rx_preferences adlı bir JSONB kolonunda tutulması önerilir.3
* Oklüzal Temas (Kapanış):
   * Hafif (Shimstock tutar)
   * Normal (Artikülasyon kağıdı iz bırakır)
   * Temas Yok (Out of occlusion)
* Arayüz Kontağı (Kontaktlar):
   * Noktasal
   * Geniş Yüzeyli
   * Sıkı (Tight)
   * Pasif
* Pontik Tasarımı (Gövde):
   * Ovate (Yumurta): Estetik bölgeler için, diş eti içine gömülür.
   * Ridge Lap (Eyer): Bukkalde temas, lingualde açık.
   * Hygienic (Hijyenik): Diş etine temas etmez (Posterior alt çene).
* Kenar Uyumu (Marjin):
   * Bıçak Sırtı (Knife Edge)
   * Basamak (Shoulder)
   * Metal Destekli (Metal Collar)
1.2.3 Renk (Shade) Yönetimi
Renk seçimi, tek bir değerden ibaret değildir. Özellikle estetik ön bölge çalışmalarında "Renk Haritası" (Shade Map) kullanılır.
* Gövde Rengi (Body Shade): VITA A1, A2, B1 vb.
* Güdük Rengi (Stump Shade): Kesilmiş dişin rengi. Tam seramik restorasyonlarda (E.max, Zirkonyum), alttaki dişin rengi restorasyonun nihai rengini etkiler. Koyu bir güdük (örn. ND4) maskelenmelidir. Sistem, "Tam Seramik" seçildiğinde "Güdük Rengi" alanını zorunlu kılmalıdır.8
* Gingiva Rengi: Hareketli protezlerde diş eti rengi (Açık pembe, Damarlı, Koyu).
1.3 Lojistik ve Zamanlama Yönetimi
Dental laboratuvarlarda "Termin Tarihi" (Due Date) kutsaldır. Hastanın randevusu ayarlanmıştır ve gecikme kabul edilemez.
1.3.1 Saat Dilimi ve Teslimat Hassasiyeti
Küresel veya çok şubeli bir yapı hedefleniyorsa (Örn: Merkez İstanbul, Şube Berlin), zaman dilimi yönetimi kritik hale gelir.
* Sorun: Berlin'deki hekim, işi "Cuma 10:00"da ister. İstanbul'daki laboratuvar bunu kendi saatiyle "Cuma 12:00" olarak görmelidir. Ancak veritabanında bu tarih UTC olarak saklanmalıdır.
* Çözüm: Tenant veya Clinic tablosunda timezone bilgisi tutulmalı (örn: Europe/Berlin). Case tablosundaki dueDate UTC olarak saklanmalı, ancak arayüzde hekimin yerel saatine çevrilerek gösterilmelidir. Ayrıca, "Teslimat için Lojistik Süresi" (Shipping Buffer) hesaba katılmalıdır. Eğer kargo 24 saat sürüyorsa, laboratuvarın üretim bitiş tarihi, hekimin istediği tarihten 24 saat önce olmalıdır.9
________________
Bölüm 2: Klinik Veri Modellemesi ve Odontogram Mimarisi
Odontogram (Diş Şeması), dental yazılımların kalbidir. Bu, sadece bir görselleştirme aracı değil, aynı zamanda anatomik verilerin yapısal olarak saklandığı bir veritabanı bileşenidir. Ezgi Dental Lab projesi için, hem görsel doğruluğu hem de veri bütünlüğünü sağlayacak hibrit bir model önerilmektedir.
2.1 Diş Notasyon Sistemleri ve Veri Normalizasyonu
Dünyada yaygın olarak kullanılan üç ana diş numaralandırma sistemi vardır:
1. FDI (ISO 3950): Uluslararası standart. Ağız 4 kadrana bölünür (1-4). Dişler 11'den 48'e kadar numaralandırılır. (Örn: 11 = Sağ Üst Santral). Türkiye ve Avrupa'da standarttır.
2. Universal (ADA): ABD standardı. 1'den 32'ye kadar sıralı gider. (Örn: 8 = Sağ Üst Santral).
3. Palmer: Ortodontide yaygındır. Kadran sembolleri kullanılır.
Mimari Karar: Veritabanı katmanında kesinlikle FDI Sistemi integer olarak (11, 12... 48) kullanılmalıdır. Bu sistem, kadran ve diş sırasını matematiksel olarak ifade ettiği için (İlk basamak kadran, ikinci basamak diş) algoritmik işlemlere (örn: "tüm üst çene dişlerini bul") daha uygundur. Kullanıcı arayüzünde (UI), hekimin tercihine göre (User Preference) bu değerler anlık olarak Universal sisteme çevrilebilir.12
2.2 Odontogram Veri Yapısı (JSON Schema)
Her bir dişin durumu, ilişkisel bir veritabanı tablosunda (örn: Teeth tablosunda 32 satır) saklanmak yerine, Case tablosu içinde jsonb tipinde bir odontogram_state kolonunda saklanmalıdır. Bu, sorgu performansını artırır ve Vaka anındaki "snapshot"ı (anlık görüntü) korur.
Aşağıda, Ezgi Dental Lab için önerilen kapsamlı Odontogram JSON şeması yer almaktadır 15:


JSON




{
 "odontogramSchemaVersion": "1.0",
 "archView": "PERMANENT", // veya DECIDUOUS (Süt dişleri)
 "teeth": {
   "18": {
     "id": 18,
     "anatomy": { "quadrant": 1, "index": 8, "type": "MOLAR" },
     "status": "MISSING", // Diş eksik
     "notes": "Çekim 2023"
   },
   "16": {
     "id": 16,
     "anatomy": { "quadrant": 1, "index": 6, "type": "MOLAR" },
     "status": "PRESENT",
     "existingRestorations": ["AMALGAM_FILLING"],
     "plannedTreatment": {
       "type": "CROWN",
       "material": "ZIRCONIA_LAYERED",
       "marginDesign": "CHAMFER",
       "shade": "A2",
       "isAbutment": true, // Köprü ayağı
       "bridgeId": "br_uuid_001" // Hangi köprüye ait olduğu
     }
   },
   "15": {
     "id": 15,
     "anatomy": { "quadrant": 1, "index": 5, "type": "PREMOLAR" },
     "status": "MISSING",
     "plannedTreatment": {
       "type": "PONTIC", // Köprü gövdesi
       "material": "ZIRCONIA_LAYERED",
       "design": "OVATE",
       "bridgeId": "br_uuid_001"
     }
   },
   "14": {
     "id": 14,
     "anatomy": { "quadrant": 1, "index": 4, "type": "PREMOLAR" },
     "status": "PRESENT",
     "plannedTreatment": {
       "type": "CROWN",
       "material": "ZIRCONIA_LAYERED",
       "isAbutment": true,
       "bridgeId": "br_uuid_001"
     }
   }
 }
}

2.3 Köprü (Bridge) ve İmplant Mantığı
Dental yazılımların en çok zorlandığı alan "Köprü" mantığıdır. Bir köprü, birden fazla dişi birbirine bağlayan tek bir protezdir.
* Veri Bütünlüğü: Sistem, bir köprü tanımlandığında (bridgeId), köprünün bileşenlerinin (ayaklar ve gövdeler) bitişik olduğunu doğrulamalıdır. 16 ve 14 numara ayak ise, 15 numara mutlaka gövde (pontic) olmalıdır.
* Konnektörler: Odontogram görselleştirmesinde, bu dişler arasında "konnektör" (bağlantı) çizgileri çizilmelidir. bridgeId alanı, React bileşeninin hangi dişleri görsel olarak gruplayacağını belirler.
İmplant Mantığı:
Eğer treatment.type === 'IMPLANT_CROWN' ise, sistem ek veri alanlarını (meta-data) zorunlu kılmalıdır:
* implantBrand: (Örn: Straumann, Nobel Biocare)
* implantDiameter: (Örn: 4.1mm RN)
* abutmentType: (Örn: Custom TiBase, Screw-Retained).3
2.4 Yüzey (Surface) Bazlı İşlemler
Dolgular veya Inlay/Onlay restorasyonları için dişin tamamı değil, yüzeyleri (Mesial, Distal, Occlusal, Buccal, Lingual - MODBL) hedeflenir. Odontogram verisi surfaces: şeklinde bir dizi içermelidir. React tarafında, her dişin SVG'si bu 5 yüzeye bölünmüş alt yollardan (path) oluşmalı ve gelen veriye göre ilgili yüzeyler boyanmalıdır.18
________________
Bölüm 3: Modern Web Mimarisi: Next.js 16 ve React Server Components
Ezgi Dental Lab projesinin teknik altyapısı, performans, SEO (kısmen) ve en önemlisi geliştirici deneyimi ve tip güvenliği (type-safety) açısından Next.js 16 App Router mimarisi üzerine kurulmalıdır. Bu seçim, projenin uzun ömürlü ve ölçeklenebilir olmasını sağlar.
3.1 App Router ve React Server Components (RSC) Stratejisi
Geleneksel React uygulamalarında (SPA), sayfa yüklendiğinde tarayıcıda dönen "loading spinner"lar ve ardışık API çağrıları (waterfall) kullanıcı deneyimini düşürür. RSC mimarisi ile veri çekme işlemi (data fetching) sunucuda gerçekleşir.
Ezgi Dental Lab Örneği:
vaka/[id]/page.tsx sayfası render edilirken:
1. Veritabanından vaka detayları,
2. İlişkili hasta bilgileri,
3. S3'ten dosya listesi,
4. Finansal geçmiş,
tek bir sunucu turunda (round-trip) çekilir ve istemciye hazır HTML + minimal JS (hydration için) olarak gönderilir. Bu, özellikle internet bağlantısı yavaş olabilen laboratuvar ortamlarında sayfa açılış hızını dramatik şekilde artırır.20
3.2 Server Actions ile Form Yönetimi
Next.js 16 ile gelen Server Actions, API endpoint'i yazma zorunluluğunu ortadan kaldırır. Form gönderimleri (Submission), doğrudan sunucuda çalışan asenkron fonksiyonlara bağlanır.
Geleneksel Yöntem:
   1. Form onSubmit tetiklenir.
   2. fetch('/api/create-case', { body: JSON.stringify(data) }) çağrılır.
   3. API endpoint'i veriyi alır, doğrular, DB'ye yazar.
   4. İstemciye 200 OK döner.
Server Actions Yöntemi:


TypeScript




// actions/create-case.ts
'use server'

import { z } from 'zod';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';

// Zod şeması ile backend validasyonu
const CaseSchema = z.object({
 patientName: z.string().min(2),
 restorationType: z.enum(),
 teeth: z.array(z.number()),
 //...
});

export async function createCaseAction(prevState: any, formData: FormData) {
 const session = await auth();
 if (!session) return { message: "Yetkisiz Erişim" };

 // FormData'yı nesneye çevir ve doğrula
 const rawData = Object.fromEntries(formData.entries());
 //... karmaşık veri dönüşümleri...
 
 const validated = CaseSchema.safeParse(processedData);
 if (!validated.success) {
   return { errors: validated.error.flatten().fieldErrors };
 }

 // Veritabanı İşlemi
 const newCase = await db.case.create({
   data: {
    ...validated.data,
     dentistId: session.user.id,
     tenantId: session.user.tenantId
   }
 });

 // Cache Invalidation (Önbellek Temizleme)
 // Bu komut, ilgili hekimin dashboard'unu sunucuda yeniden render eder.
 revalidatePath('/dashboard/cases');
 
 redirect(`/dashboard/cases/${newCase.id}`);
}

Bu yapı, tip güvenliğini (Type Safety) uçtan uca sağlar ve istemci tarafındaki JavaScript kodunu (bundle size) azaltır.22
3.3 Gelişmiş Önbellekleme (Advanced Caching)
Dental veriler sık değişmez (örn: bir vakanın detayları). Next.js'in unstable_cache fonksiyonu ile veritabanı sorguları agresif bir şekilde önbelleğe alınmalıdır.
   * Strateji: getCaseDetails(id) fonksiyonu ['case-id'] etiketiyle (tag) önbelleğe alınır.
   * Invalidation: Bir teknisyen vaka durumunu güncellediğinde, revalidateTag('case-id') çağrılır. Bu sayede, veritabanına gereksiz sorgu atılmaz, ancak veri değiştiğinde anında güncellenir. Bu, sistemin yüksek trafik altında (binlerce vaka) performanslı çalışmasını sağlar.21
________________
Bölüm 4: Güvenlik Stratejisi: Auth.js ve Rol Tabanlı Erişim Denetimi (RBAC)
Hasta Sağlık Bilgileri (PHI - Protected Health Information) barındıran bir sistemde güvenlik "eklenti" değil, mimarinin temelidir. Auth.js v5 (NextAuth), Next.js App Router ile tam uyumlu çalışarak bu güvenliği sağlar.
4.1 Kimlik Doğrulama (Authentication) Akışı
Sistem, çoklu giriş yöntemlerini desteklemelidir:
   * Credentials (E-posta/Şifre): Standart kullanıcılar için.
   * Magic Links: Şifre unutma veya hızlı giriş için e-posta tabanlı linkler.
   * Kurumsal SSO (Opsiyonel): Büyük hastane zincirleri için OIDC entegrasyonu.
Auth.js v5 yapılandırması (auth.ts), kullanıcı oturum açtığında JWT (JSON Web Token) içerisine kullanıcının Rolü (Role) ve Kiracı Kimliğini (Tenant ID) gömmelidir. Bu, her istekte veritabanına gidip "bu kullanıcı kim?" diye sormayı engeller.25


TypeScript




// auth.ts içindeki callback örneği
callbacks: {
 async jwt({ token, user }) {
   if (user) {
     token.role = user.role;
     token.tenantId = user.tenantId; // Çok kiracılı yapı için kritik
   }
   return token;
 },
 async session({ session, token }) {
   session.user.role = token.role;
   session.user.tenantId = token.tenantId;
   return session;
 }
}

4.2 Rol Matrisi ve Yetkilendirme (Authorization)
Ezgi Dental Lab için tanımlanması gereken asgari roller şunlardır:
Rol
	Erişim Alanı
	İzinler
	Kısıtlamalar
	SYSTEM_ADMIN
	Tüm Sistem
	Her şeye erişim.
	Yok.
	LAB_OWNER
	Laboratuvar
	Finansallar, Personel, Ayarlar.
	Sistem ayarlarına erişemez.
	LAB_TECH
	Laboratuvar
	Vaka Görüntüleme, Durum Güncelleme.
	Fiyatları ve faturaları göremez.
	CLINIC_ADMIN
	Klinik
	Klinik Vakaları, Faturalar, Hekim Yönetimi.
	Diğer kliniklerin verilerine erişemez.
	DENTIST
	Klinik
	Kendi Vakaları, Yeni Vaka Oluşturma.
	Diğer hekimlerin vakalarını göremez.
	4.3 Veri Erişim Katmanı (Data Access Layer - DAL) ve DTO Deseni
Güvenliğin kod tabanına yayılmasını önlemek ve merkezi bir noktada yönetmek için DAL (Data Access Layer) deseni uygulanmalıdır. Bileşenler (Components) doğrudan Prisma'yı çağırmaz; DAL fonksiyonlarını çağırır.
DTO (Data Transfer Object) ile Veri Sızmasını Önleme:
Next.js RSC payload'larında hassas verilerin (örn: lab_cost_price - laboratuvarın maliyeti) istemciye gitmemesi gerekir.


TypeScript




// src/data/cases.ts
import 'server-only';
import { cache } from 'react';
import { auth } from '@/auth';

export const getCaseDTO = cache(async (caseId: string) => {
 const session = await auth();
 const data = await db.case.findUnique({ where: { id: caseId } });

 // 1. Yetki Kontrolü: Tenant Isolation
 if (data.tenantId!== session.user.tenantId) throw new Error("Erişim Reddedildi");

 // 2. Rol Kontrolü: Alan Filtreleme
 const isTechnician = session.user.role === 'LAB_TECH';

 // 3. DTO Dönüşümü
 return {
   id: data.id,
   patientName: data.patientName,
   status: data.status,
   // Teknisyen ise fiyatı gizle, değilse göster
   price: isTechnician? undefined : data.price, 
   internalNotes: isTechnician? data.techNotes : undefined
 };
});

Bu yapı, price alanının teknisyenin tarayıcısına asla ulaşmamasını, ağ trafiğinde (Network tab) bile görünmemesini garanti eder.27
________________
Bölüm 5: Veri Tabanı Tasarımı ve Çok Kiracılı (Multi-Tenant) Yapı
Veritabanı olarak PostgreSQL ve ORM olarak Prisma kullanılacaktır. Sistemin en kritik mimari kararı, çoklu klinik ve laboratuvar yapısının nasıl yönetileceğidir.
5.1 Çok Kiracılılık Stratejisi: Satır Düzeyinde Ayrım (Row-Level Multi-Tenancy)
Her klinik için ayrı bir veritabanı veya ayrı bir şema (Schema-per-tenant) oluşturmak, binlerce klinik hedefleyen bir SaaS için operasyonel olarak yönetilemez (migration sorunları, bağlantı havuzu limitleri). Bu nedenle, Satır Düzeyinde Ayrım tercih edilmelidir. Her kritik tabloda (Patient, Case, Invoice) bir tenantId kolonu bulunur.29
5.2 Prisma Şema Tasarımı
Aşağıda, dental iş mantığını kapsayan temel Prisma şeması yer almaktadır:


Code snippet




// schema.prisma

// ENUM'lar: Durum makinesi ve Roller
enum Role { SYSTEM_ADMIN, LAB_ADMIN, LAB_TECH, CLINIC_ADMIN, DENTIST }
enum CaseStatus { DRAFT, SUBMITTED, RECEIVED, IN_PRODUCTION, HOLD, QC_PASSED, SHIPPED, COMPLETED }
enum RestorationCategory { FIXED, REMOVABLE, IMPLANT, ORTHO }

// TENANT: Klinik veya Laboratuvar Organizasyonu
model Tenant {
 id            String   @id @default(uuid())
 name          String
 type          String   // "CLINIC" or "LAB"
 domain        String?  @unique // Subdomain routing için (ornek.ezgilab.com)
 timezone      String   @default("Europe/Istanbul") // Termin tarihleri için kritik
 users         User
 patients      Patient
 cases         Case
}

// USER: Sistem Kullanıcıları
model User {
 id        String @id @default(uuid())
 email     String @unique
 password  String
 role      Role
 tenantId  String
 tenant    Tenant @relation(fields: [tenantId], references: [id])
}

// PATIENT: Hasta Bilgileri
model Patient {
 id        String   @id @default(uuid())
 fullName  String
 dob       DateTime
 gender    String
 tenantId  String
 tenant    Tenant   @relation(fields: [tenantId], references: [id])
 cases     Case
 
 @@index([tenantId]) // Performans için index
}

// CASE: Ana Vaka Tablosu
model Case {
 id              String      @id @default(uuid())
 caseNumber      Int         @default(autoincrement()) // İnsan tarafından okunabilir ID (Örn: 10245)
 status          CaseStatus  @default(DRAFT)
 
 // İlişkiler
 dentistId       String
 dentist         User        @relation(fields: [dentistId], references: [id])
 patientId       String
 patient         Patient     @relation(fields: [patientId], references: [id])
 tenantId        String      // Vakanın ait olduğu Klinik
 tenant          Tenant      @relation(fields: [tenantId], references: [id])
 
 // Zamanlama
 createdAt       DateTime    @default(now())
 dueDate         DateTime    // Hekimin istediği tarih (UTC)
 scheduledDate   DateTime?   // Laboratuvarın planladığı tarih (UTC)
 
 // Veri Blobları
 odontogramData  Json        // Bölüm 2.2'deki JSON yapısı
 rxPreferences   Json        // Oklüzyon, kontakt tercihleri
 
 // İlişkili Tablolar
 products        CaseProduct
 attachments     Attachment
 auditLogs       AuditLog
}

// CASE PRODUCT: Fatura Kalemleri ve Ürünler
model CaseProduct {
 id          String  @id @default(uuid())
 caseId      String
 case        Case    @relation(fields: [caseId], references: [id])
 name        String  // "Zirconia Crown"
 toothNumbers Int  //  - Hangi dişlere uygulandığı
 price       Decimal
}

5.3 Prisma Client Extensions ile Güvenlik
Geliştiricilerin yanlışlıkla where: { tenantId } filtresini unutmasını engellemek için Prisma Client Extensions kullanılmalıdır. Bu özellik, findMany gibi sorgulara otomatik olarak tenant filtresi ekleyen global bir middleware gibi çalışır.32
________________
Bölüm 6: 3D Görüntüleme Teknolojileri ve Büyük Dosya Yönetimi
Ezgi Dental Lab, sadece metin tabanlı bir sistem değil, görsel bir platformdur. Hekimler ve teknisyenler, tarayıcı üzerinden 3 boyutlu tarama dosyalarını (STL, PLY, OBJ) inceleyebilmelidir.
6.1 Büyük Dosya Yükleme Mimarisi (Direct-to-S3)
İntraoral tarayıcı çıktıları (özellikle renkli PLY dosyaları) 100MB-500MB boyutlarına ulaşabilir. Bu dosyaları Next.js sunucusu üzerinden geçirmek (proxy) sunucuyu kilitler ve bant genişliğini tüketir.
Çözüm: Presigned URL Yöntemi
   1. İstemci (Client): Dosya seçildiğinde sunucuya dosya adını ve boyutunu bildirir.
   2. Sunucu (Server Action): AWS S3 SDK'sını kullanarak, o dosyaya özel, 15 dakika geçerli, yazma izinli (PUT) bir Presigned URL üretir.
   3. İstemci: Tarayıcı, dosyayı doğrudan bu URL'e PUT isteği ile AWS S3'e yükler. Next.js sunucusu bypass edilir.
   4. Kayıt: Yükleme bittiğinde, dosyanın S3 yolu (Key) veritabanına Attachment olarak kaydedilir.34
6.2 React Three Fiber (R3F) ile WebGL Görüntüleme
Three.js kütüphanesinin React sarmalayıcısı olan @react-three/fiber, deklaratif bir şekilde 3D sahneler oluşturmayı sağlar.
Performans Optimizasyonları:
   1. Draco Sıkıştırması: STL dosyaları metin tabanlı veya ham ikili (binary) formatta olup çok yer kaplar. Google'ın Draco formatı, 3D geometrileri %90-%95 oranında sıkıştırır. Sunucu tarafında (örneğin bir AWS Lambda fonksiyonu ile) yüklenen STL dosyaları .glb (Draco) formatına çevrilmeli ve istemciye bu sıkıştırılmış versiyon sunulmalıdır.37
   2. On-Demand Rendering: <Canvas frameloop="demand"> ayarı kullanılmalıdır. Standart oyun döngüsü (60 FPS) yerine, sadece kullanıcı modeli çevirdiğinde (orbit controls) render alınır. Bu, diş hekiminin laptop pilini korur.39
   3. LOD (Level of Detail): Görüntüleyici için modelin poligon sayısı azaltılabilir (Decimation). Üretim için orijinal yüksek çözünürlüklü dosya saklanırken, web viewer için 1-2MB'lık düşük poligonlu versiyon gösterilebilir.
Örnek Görüntüleyici Bileşeni:


TypeScript




// components/3d/Viewer.tsx
'use client';
import { Canvas } from '@react-three/fiber';
import { useGLTF, Stage, OrbitControls } from '@react-three/drei';

function Model({ url }) {
 const { scene } = useGLTF(url); // Draco decoder otomatik devreye girer
 return <primitive object={scene} />;
}

export default function DentalViewer({ modelUrl }) {
 return (
   <Canvas frameloop="demand" dpr={}>
     <Stage intensity={0.5} environment="city">
       <Model url={modelUrl} />
     </Stage>
     <OrbitControls />
   </Canvas>
 );
}

________________
Bölüm 7: Entegrasyon ve Çıktı Yönetimi
Sistemin dış dünya ile etkileşimi, faturalama ve etiketleme süreçlerini içerir.
7.1 Barkod ve QR Kodlu Etiketleme
Laboratuvar içinde fiziksel iş takibi "Tava" (Pan) sistemiyle yapılır. Her vaka için bir barkodlu etiket basılmalıdır.
   * Teknoloji: react-pdf kütüphanesi kullanılarak sunucuda veya istemcide PDF etiketler oluşturulur.
   * İçerik: Etiket üzerinde Hasta Adı, Vaka ID, Diş Numaraları ve bir QR Kod bulunmalıdır. Teknisyen, elindeki tablet ile QR kodu okuttuğunda, sistemdeki vaka detay sayfasına yönlendirilir.40
7.2 Faturalama ve PDF Oluşturma
Hekimlere ay sonunda toplu fatura veya vaka bazlı fatura kesilebilir. Fatura PDF'leri de dinamik olarak oluşturulmalı ve içinde uygulanan işlemlerin detaylı dökümü (Diş 11: Zirkonyum Kron - $100) yer almalıdır.
________________
Sonuç ve Uygulama Yol Haritası
Bu rapor, Ezgi Dental Lab projesinin teknik iskeletini oluşturmaktadır. Önerilen mimari; Next.js 16 ve Server Actions ile modern ve hızlı, Auth.js ve DAL deseni ile güvenli, Prisma ve Multi-Tenant yapı ile ölçeklenebilir, R3F ve S3 entegrasyonu ile görsel açıdan zengindir.
Önerilen Geliştirme Fazları:
   1. Faz 0: PROJECT_CONTEXT.md dosyasının bu rapor ışığında oluşturulması.
   2. Faz 1 (Çekirdek): Veritabanı şemasının kurulması, Auth.js entegrasyonu ve Multi-tenant altyapısının (Tenant/User modelleri) kodlanması.
   3. Faz 2 (İş Mantığı): Vaka oluşturma formları, Odontogram bileşeni ve Reçete (Rx) validasyonları.
   4. Faz 3 (Görselleştirme): S3 yükleme altyapısı ve 3D Viewer entegrasyonu.
   5. Faz 4 (Operasyon): Dashboard, Durum yönetimi ve PDF/Etiket çıktıları.
Ezgi Dental Lab, bu strateji ile sadece bir yazılım değil, dental üretimin dijital omurgasını inşa edecektir.
Works cited
   1. 5 Best Dental Lab Case Management Software Options - AvaDent Digital Dental Solutions, accessed December 2, 2025, https://www.avadent.com/dental-lab-case-management-software/
   2. Dental Lab Case Checklists And Photos, accessed December 2, 2025, https://www.mctechdentallab.com/Case-Checklists
   3. Lab to Dent Your Smart Assistant - Dental Lab Software, accessed December 2, 2025, https://labtodent.com/
   4. 10: Class I, II, and VI Direct Composite Restorations and Other Tooth-Colored Restorations, accessed December 2, 2025, https://pocketdentistry.com/10-class-i-ii-and-vi-direct-composite-restorations-and-other-tooth-colored-restorations/
   5. Fixed Restoration Type Chart - Rotsaert Dental Laboratory, accessed December 2, 2025, https://rotsaertdental.com/index.php/products-and-services/fixed-restorations/fixed-restoration-type-chart/
   6. Ultimate Dental Rx Form, accessed December 2, 2025, https://ultimatedentallab.com/wp-content/uploads/2021/08/Ultimate-Dental-Rx-Form-1.pdf
   7. Solutions Dental Lab - Case Entry and Attachments - YouTube, accessed December 2, 2025, https://www.youtube.com/watch?v=QYStdmCfXRU
   8. Essential Time Zone Handling For Digital Scheduling Success - myshyft.com, accessed December 2, 2025, https://www.myshyft.com/blog/calendar-time-zone-formatting/
   9. Mastering Timezones in Your Appointment App: A Backend Guide | by Saniaalikhan, accessed December 2, 2025, https://saniaalikhan224.medium.com/mastering-timezones-in-your-appointment-app-a-backend-guide-089cddb562c2
   10. Handling time zones in distributed systems, Part 1 | javamagazine - Oracle Blogs, accessed December 2, 2025, https://blogs.oracle.com/javamagazine/java-timezone-part-1/
   11. The illustration of FDI World Dental Federation notation. The system... | Download Scientific Diagram - ResearchGate, accessed December 2, 2025, https://www.researchgate.net/figure/The-illustration-of-FDI-World-Dental-Federation-notation-The-system-designates-each_fig1_359614391
   12. Introduction of “qpdb” teeth numbering system - PMC - PubMed Central, accessed December 2, 2025, https://pmc.ncbi.nlm.nih.gov/articles/PMC10827761/
   13. Thesis: Design and development of an interactive dental chart - Theseus, accessed December 2, 2025, https://www.theseus.fi/bitstream/10024/795409/2/Holmnas_Staffan.pdf
   14. Listen First, Code Later: Case Study of a Dental App - DEV Community, accessed December 2, 2025, https://dev.to/zendev2112/listen-first-code-later-case-study-of-a-dental-app-1d74
   15. RestorationTooth3-example-dental-procedure - JSON Representation - Dental Data Exchange v2.0.0-ballot - HL7 FHIR Specification, accessed December 2, 2025, http://build.fhir.org/ig/HL7/dental-data-exchange/branches/master/Procedure-RestorationTooth3-example-dental-procedure.json.html
   16. Database structure for a tooth chart - Stack Overflow, accessed December 2, 2025, https://stackoverflow.com/questions/26276604/database-structure-for-a-tooth-chart
   17. React Odontogram | Peerlist, accessed December 2, 2025, https://peerlist.io/biomathcode/project/react-odontogram
   18. How to set and get data from an odontogram in react js? - Stack Overflow, accessed December 2, 2025, https://stackoverflow.com/questions/71847608/how-to-set-and-get-data-from-an-odontogram-in-react-js
   19. Guides: Forms - Next.js, accessed December 2, 2025, https://nextjs.org/docs/pages/guides/forms
   20. Next.js 16, accessed December 2, 2025, https://nextjs.org/blog/next-16
   21. Server Actions and Mutations - Data Fetching - Next.js, accessed December 2, 2025, https://nextjs.org/docs/14/app/building-your-application/data-fetching/server-actions-and-mutations
   22. How to create forms with Server Actions - Next.js, accessed December 2, 2025, https://nextjs.org/docs/app/guides/forms
   23. How to Use Server Actions in Next js with Best Practices | by debug_senpai - Medium, accessed December 2, 2025, https://medium.com/@jigsz6391/how-to-use-server-actions-in-next-js-with-best-practices-958050a44233
   24. Role-based access control in middleware using Auth.js v5 · nextauthjs next-auth · Discussion #9609 - GitHub, accessed December 2, 2025, https://github.com/nextauthjs/next-auth/discussions/9609
   25. Migrating to v5 - Auth.js, accessed December 2, 2025, https://authjs.dev/getting-started/migrating-to-v5
   26. Guides: Data Security - Next.js, accessed December 2, 2025, https://nextjs.org/docs/app/guides/data-security
   27. Understanding the Data Access Layer in Next.js | by Ayush Sharma | Nov, 2025 | Medium, accessed December 2, 2025, https://medium.com/@cyberboyayush/understanding-the-data-access-layer-in-next-js-fdea1db77ed8
   28. Building Multi-Tenant RAG Applications With PostgreSQL: Choosing the Right Approach, accessed December 2, 2025, https://www.tigerdata.com/blog/building-multi-tenant-rag-applications-with-postgresql-choosing-the-right-approach
   29. Designing Your Postgres Database for Multi-tenancy | Crunchy Data Blog, accessed December 2, 2025, https://www.crunchydata.com/blog/designing-your-postgres-database-for-multi-tenancy
   30. performance - PostgreSQL's schemas for multi-tenant applications - Stack Overflow, accessed December 2, 2025, https://stackoverflow.com/questions/44524364/postgresqls-schemas-for-multi-tenant-applications
   31. Prisma Client Just Became a Lot More Flexible: Prisma Client Extensions (Preview), accessed December 2, 2025, https://www.prisma.io/blog/client-extensions-preview-8t3w27xkrxxn
   32. Prisma Client Extensions: Use Cases and Pitfalls | ZenStack, accessed December 2, 2025, https://zenstack.dev/blog/prisma-client-extensions
   33. Uploading large objects to Amazon S3 using multipart upload and transfer acceleration, accessed December 2, 2025, https://aws.amazon.com/blogs/compute/uploading-large-objects-to-amazon-s3-using-multipart-upload-and-transfer-acceleration/
   34. The Ultimate Guide to File Uploads in Next.js (S3, Presigned URLs, Dropzone) - YouTube, accessed December 2, 2025, https://www.youtube.com/watch?v=83bECYmPbI4
   35. Building a File Storage With Next.js, PostgreSQL, and Minio S3, accessed December 2, 2025, https://www.alexefimenko.com/posts/file-storage-nextjs-postgres-s3
   36. Building Efficient Three.js Scenes: Optimize Performance While Maintaining Quality, accessed December 2, 2025, https://tympanus.net/codrops/2025/02/11/building-efficient-three-js-scenes-optimize-performance-while-maintaining-quality/
   37. Want to increase my page speed by optimizing three js code - Questions, accessed December 2, 2025, https://discourse.threejs.org/t/want-to-increase-my-page-speed-by-optimizing-three-js-code/86976
   38. Scaling performance - React Three Fiber, accessed December 2, 2025, https://r3f.docs.pmnd.rs/advanced/scaling-performance
   39. Generating PDF Invoices: Our Approach | Midday, accessed December 2, 2025, https://midday.ai/updates/invoice-pdf/
   40. How to implement qr-code inside a pdf file - javascript - Stack Overflow, accessed December 2, 2025, https://stackoverflow.com/questions/75749351/how-to-implement-qr-code-inside-a-pdf-file