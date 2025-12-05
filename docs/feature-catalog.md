# Ezgi Dental Lab - Feature Catalog & Governance

> **STATUS:** LIVING DOCUMENT
> **LINKED TO:** `PROJECT_CONTEXT.md`

## 1. Feature Proposal Template
*Yeni bir özellik önerirken bu şablonu kopyalayıp `docs/rfc/feature-00X-name.md` olarak kaydedin.*

```markdown
# [FEATURE-00X] Feature Name

## 1. Problem Statement
*Kısa ve net problem tanımı. Neden buna ihtiyacımız var?*

## 2. Proposed Solution
*Teknik yaklaşım, mimari değişiklikler ve kullanıcı akışı.*

## 3. Metadata
- **TAG:** [POC | RFC/MAJOR]
- **Owner:** @username
- **Target Date:** YYYY-MM-DD

## 4. Acceptance Criteria
- [ ] Criteria 1 (Ölçülebilir)
- [ ] Criteria 2

## 5. Minimal POC Steps
1. `git checkout -b poc/feature-name`
2. `npm install new-dependency`
3. ...

## 6. Required Dependencies
- `package-name` (vX.X.X)

## 7. Rollback Plan
*Tersine alma adımları. Örn: DB migration revert komutu.*
```

---

## 2. Feature Catalog (FUTURE / RFC ITEMS)
*`PROJECT_CONTEXT.md` içindeki FUTURE maddelerinin detaylandırılmış listesi.*

### [FEATURE-0001] Multi-Tenancy (Row-Level)
* **Status:** PLANNED
* **Risk Level:** HIGH (RFC/MAJOR)
* **Description:** Veritabanı seviyesinde her kliniğin verisinin izole edilmesi.
* **PR/Ref:** `TBD`

### [FEATURE-0002] 3D Viewer (React Three Fiber)
* **Status:** PLANNED
* **Risk Level:** MEDIUM (RFC/MAJOR)
* **Description:** STL/PLY dosyalarının tarayıcıda görüntülenmesi.
* **PR/Ref:** `TBD`

### [FEATURE-0003] Direct-to-S3 Upload
* **Status:** PLANNED
* **Risk Level:** MEDIUM (RFC/MAJOR)
* **Description:** Büyük dosyaların sunucuyu yormadan S3'e yüklenmesi.
* **PR/Ref:** `TBD`

### [FEATURE-0004] Prisma ORM Integration
* **Status:** POC REQUIRED
* **Risk Level:** LOW (POC)
* **Description:** Veritabanı şeması ve erişim katmanı.
* **PR/Ref:** `TBD`

### [FEATURE-0005] Auth.js v5 Implementation
* **Status:** POC REQUIRED
* **Risk Level:** HIGH (POC)
* **Description:** Kimlik doğrulama ve RBAC altyapısı.
* **PR/Ref:** `TBD`

---

## 3. Acceptance Criteria Examples

### [FEATURE-0001] Multi-Tenancy (Row-Level)
- [ ] `Tenant` tablosu oluşturulmuş ve `User`, `Case`, `Patient` tabloları ile ilişkilendirilmiş olmalı.
- [ ] `prisma.case.findMany()` sorgusu, `where: { tenantId }` olmadan çalıştırıldığında hata vermeli veya otomatik eklemeli (Prisma Extension).

### [FEATURE-0004] Prisma ORM (DAL)
- [ ] `src/data` klasörü dışında hiçbir dosyada `import { db }` bulunmamalı.
- [ ] Tüm veritabanı fonksiyonları, UI'ya ham veritabanı nesnesi değil, DTO (Data Transfer Object) dönmeli.

### [FEATURE-0005] Auth.js v5 POC
- [ ] `/portal` rotasına giriş yapmamış kullanıcı erişememeli (Middleware koruması).
- [ ] Giriş yapmış kullanıcının `session` nesnesinde `tenantId` ve `role` bilgisi bulunmalı.

### [FEATURE-0003] Presigned S3 Upload
- [ ] İstemci, sunucudan aldığı URL ile dosyayı doğrudan S3'e yükleyebilmeli (Network tab'da Next.js sunucusuna POST yok).
- [ ] Yükleme sonrası S3 Key bilgisi veritabanına kaydedilmeli.

### [FEATURE-0002] 3D Viewer POC
- [ ] 50MB+ boyutundaki bir STL dosyası, tarayıcıyı dondurmadan (Main thread blocking < 100ms) yüklenebilmeli.
- [ ] Viewer bileşeni sadece ihtiyaç duyulduğunda yüklenmeli (Lazy Loading).

---

## 4. Test & Rollout Templates (PR Checklist)

*PR açıklamanıza bu listeyi ekleyin:*

```markdown
## Rollout Checklist
- [ ] **E2E Scope:** Kritik kullanıcı akışları (Happy Path) test edildi mi?
- [ ] **Performance:** Lighthouse skoru > 90 (veya mevcut seviyenin altına düşmedi) mi?
- [ ] **Security:** Yeni eklenen bağımlılıklar `npm audit` ile tarandı mı?
- [ ] **Canary Plan:** Bu özellik önce sadece `BETA` kullanıcılarına mı açılacak?
- [ ] **Rollback:** `git revert` yeterli mi, yoksa DB migration revert gerekiyor mu?
```

---

## 5. CI-Audit Details (`verify-arch.js`)

*Sürekli Entegrasyon (CI) hattında çalışacak mimari kontrol scripti detayları.*

**Komut:** `node scripts/verify-arch.js`
**Hedef:** Projenin `PROJECT_CONTEXT.md` kurallarına uyduğunu doğrulamak.

### Rules & Exit Codes

| Kural | Kontrol | Seviye | Exit Code |
| :--- | :--- | :--- | :--- |
| **No Pages Router** | `src/pages` klasörü var mı? | **FAIL** | 1 |
| **No Forbidden Deps** | `package.json` içinde `redux`, `mobx` var mı? | **FAIL** | 1 |
| **DAL Existence** | `src/data` klasörü var mı? | **WARN** | 0 (Log only) |
| **Auth Lib** | `next-auth` veya `auth` paketi var mı? | **WARN** | 0 (Log only) |
| **Prisma Lib** | `prisma` paketi var mı? | **WARN** | 0 (Log only) |

*Not: **WARN** seviyesindeki kurallar, POC aşaması tamamlandığında **FAIL** seviyesine çekilecektir.*