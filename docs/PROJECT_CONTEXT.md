# Ezgi Dental Lab - Project Architecture & Governance Context

> **STATUS:** LOCKED (Final Architecture)
> **LAST UPDATE:** 2025-12-03
> **OWNER:** Tech Lead

## Change Summary
1.  **Mimari Kilitlendi:** Proje mimarisi Next.js 16 App Router, Server Actions ve Tailwind CSS v4 olarak sabitlendi.
2.  **Yönetişim (Governance):** RFC süreci, PR kontrol listesi ve CI denetim standartları eklendi.
3.  **Kapsam Ayrıştırıldı:** Mevcut uygulama (Frontend Prototip) ile Hedef Mimari (Full-Stack SaaS) ve Gelecek Planları (Future) netleştirildi.

---

## A. CURRENT IMPLEMENTATION
*Aşağıdaki maddeler mevcut kod tabanında doğrulanmıştır ve değiştirilemez.*

1.  **Framework:** Next.js 16.0.3 (App Router, Turbopack aktif).
2.  **Language:** TypeScript 5.x (Strict mode).
3.  **Styling:** Tailwind CSS v4 (PostCSS entegrasyonlu).
4.  **Internationalization:** `next-intl` (Routing `/tr`, `/en` şeklinde, JSON tabanlı sözlükler).
5.  **Component Architecture:** React Server Components (RSC) varsayılan. Client etkileşimi için `"use client"` direktifi.
6.  **State Management:** Yerel React State (`useState`, `useReducer`). Global store yok.
7.  **Data Source:** Mock Data (Bileşenler içinde sabit diziler).
8.  **Auth:** Mevcut değil (Public erişim).
9.  **Database:** Mevcut değil.
10. **UI Library:** Özel bileşenler (Custom components), `lucide-react` ikon seti.

---

## B. FINAL ARCHITECTURE (Allowed / Locked)
*Bu maddeler mevcut kodla uyumludur ve projenin nihai hedefini temsil eder. Uygulanabilir.*

1.  **Data Access Layer (DAL)** `TAG: SAFE`
    *   **Açıklama:** Tüm veritabanı erişimi `src/data` klasörü altında izole edilmelidir. Bileşenler asla doğrudan DB çağırmamalıdır.
    *   **Acceptance Criteria:** `src/data/*.ts` dosyaları haricinde `db` import'u olmamalı. Fonksiyonlar DTO (Data Transfer Object) dönmeli.
    *   **Minimal POC:** `src/data/cases.ts` oluştur, mock veriyi buradan type-safe bir interface ile döndür.

2.  **Server Actions** `TAG: SAFE`
    *   **Açıklama:** Form gönderimleri ve veri mutasyonları `src/actions` altında toplanmalıdır.
    *   **Acceptance Criteria:** Tüm action dosyaları `"use server"` ile başlamalı. Zod ile input validasyonu yapılmalı.
    *   **Minimal POC:** `src/actions/create-case.ts` oluştur, form verisini alıp konsola basan ve `revalidatePath` yapan bir action yaz.

3.  **Prisma ORM** `TAG: POC`
    *   **Açıklama:** PostgreSQL veritabanı erişimi için standart ORM.
    *   **Acceptance Criteria:** `schema.prisma` dosyası kök dizinde olmalı. Migration geçmişi tutarlı olmalı.
    *   **Minimal POC:** `npm install prisma`. SQLite ile `Case` modeli oluştur. `npx prisma db push` ile lokal DB oluştur.

4.  **Auth.js v5** `TAG: POC`
    *   **Açıklama:** Kimlik doğrulama ve Rol Tabanlı Erişim (RBAC).
    *   **Acceptance Criteria:** `auth.ts` yapılandırması. Middleware ile `/portal` rotalarının korunması.
    *   **Minimal POC:** `npm install next-auth@beta`. Credentials provider ile dummy (hardcoded) kullanıcı girişi yap.

---

## C. BLACKLIST
*Kesinlikle yapılmayacaklar. Tartışmaya kapalıdır.*

1.  **Pages Router:** `src/pages` klasörü kullanımı yasaktır. Sadece App Router.
2.  **Global Client State:** Redux, MobX, Zustand gibi kütüphaneler yasaktır. Sunucu durumu (Server State) ve URL parametreleri kullanılacaktır.
3.  **Runtime CSS:** Styled Components, Emotion vb. yasaktır. Sadece Tailwind CSS.
4.  **Direct DB Access in UI:** UI bileşenleri içinde SQL veya Prisma sorgusu yazılamaz.
5.  **jQuery / DOM Manipulation:** React sanal DOM dışına çıkmak yasaktır.

---

## D. FUTURE / RFC ITEMS
*Yüksek riskli veya uzun vadeli maddeler. RFC (Request for Comments) süreci olmadan başlanamaz.*

1.  **Multi-Tenancy (Row-Level)** `TAG: RFC/MAJOR`
    *   **Risk:** Veri sızıntısı (Data Leak). Yanlış implementasyon bir kliniğin başka kliniği görmesine yol açar.
    *   **Gereklilik:** Kapsamlı test planı ve güvenlik denetimi.

2.  **3D Viewer (React Three Fiber)** `TAG: RFC/MAJOR`
    *   **Risk:** Performans düşüşü ve Bundle Size şişmesi.
    *   **Gereklilik:** WebGL performans testleri ve Lazy Loading stratejisi.

3.  **Direct-to-S3 Upload** `TAG: RFC/MAJOR`
    *   **Risk:** Güvenlik (Presigned URL yönetimi) ve Maliyet.
    *   **Gereklilik:** AWS IAM politika onayı.

---

## E. GOVERNANCE & CHANGE POLICY
*Bu kurallar zorunludur (REQUIRED).*

1.  **Owner:** Tech Lead
2.  **Review Cadence:** Her 6 haftada bir mimari gözden geçirme.
3.  **RFC Process:**
    *   Yüksek riskli (TAG: RFC/MAJOR) değişiklikler için `docs/rfc/00X-feature-name.md` oluşturulur.
    *   POC Branch (`poc/feature`) üzerinde prototip yapılır.
    *   Technical Review sonrası onaylanırsa `main` branch'e merge edilir.
4.  **Acceptance Gates:**
    *   **CI Doc-Audit:** Proje yapısının bu dokümana uygunluğu script ile kontrol edilmelidir.
    *   **Test Coverage:** Kritik iş akışları (örn: Vaka Girişi) için %100 E2E test kapsamı.

---

## F. CI-AUDIT RECOMMENDATION
*Aşağıdaki mantığı içeren bir script (`scripts/verify-arch.js`) CI hattına eklenmelidir.*

```text
VERIFY:
1. "src/pages" klasörü YOK MU? (Varsa FAIL)
2. "redux", "mobx" bağımlılıkları YOK MU? (Varsa FAIL)
3. "prisma" bağımlılığı VAR MI? (Yoksa WARN - POC aşamasında)
4. "next-auth" bağımlılığı VAR MI? (Yoksa WARN - POC aşamasında)
5. "src/data" klasörü VAR MI? (Yoksa WARN - DAL eksik)
```

---

## G. Developer Checklist
*PR açarken kontrol edilecekler:*

1.  [ ] Branch ismi `feat/`, `fix/` veya `poc/` ile başlıyor mu?
2.  [ ] Yapılan değişiklik `PROJECT_CONTEXT.md` içindeki "Allowed" maddelere uygun mu?
3.  [ ] Eğer "RFC/MAJOR" bir değişiklik ise, ilgili RFC dokümanı eklendi mi?
4.  [ ] Rollback planı (tersine alma adımları) PR açıklamasında mevcut mu?
5.  [ ] Yeni eklenen kütüphaneler "Blacklist"te değil mi?

---

## H. PR & Commit Guidelines

**Commit Message:**
`docs: finalize PROJECT_CONTEXT.md as final architecture with governance`

**PR Description:**
PROJECT_CONTEXT.md updated to serve as the definitive project architecture and governance source. Current implementation documented, final architecture locked to items compatible with the codebase; high-risk items moved to FUTURE/RFC. Governance, acceptance criteria and developer checklist added.