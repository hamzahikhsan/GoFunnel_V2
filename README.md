# GoFunnel v2 — Prototype (Meta Overview + Automated Reports)

Prototype interface untuk interview 16 Juni 2026. Dibangun dari tiga dokumen di
`../Study Case/`:

- **GoFunnel_v2_Build_Brief.md** — scope, layout spec, sample data (§4 di-hardcode persis)
- **GoFunnel_v2_Style_Reference_Mercury.md** — semua keputusan visual; token CSS §2.1 di-copy literal ke `src/index.css`
- **GoFunnel_v2_PRD.md** — perilaku, hierarki informasi, logika metrik (§3, §5.2, §6, App. A)

## Menjalankan

```bash
npm install
npm run dev      # http://localhost:5173
```

Desktop 1440px, light-mode only (sesuai scope Brief §1).

## Halaman

1. **Command Center** (default landing, PRD §5.1) — Today strip jujur (spend "—"
   sebelum sync, bukan "$0.00 ↑0%"), Helios Daily Brief, Needs Attention queue
   dengan deep-link, funnel snapshot, quick actions.
2. **Meta Insights → Meta Overview** (hero, §5.2) — Tier 0 narrative bar →
   Tier 1 KPI row → funnel strip → chart row → secondary metrics →
   daily breakdown (collapsed; group presets + compare Δ).
3. **Meta Insights → Ads Manager** (§5.3) — tabel campaign yang totalnya
   rekonsiliasi persis dengan Overview, baris *Unattributed* bergaya khusus
   + link ke Inbox, drill-in side panel per baris.
4. **Meta Insights → Creatives** (FR-A3) — kartu creative dengan hook rate,
   watch time, dan tag Scale/Refresh/Pause turunan goal.
5. **Calls** (§5.4) — 3 tab satu basis hitung, score pill + rubric tooltip,
   stage humanized ("Missed meeting"), detail panel (recording, transcript,
   score breakdown), filter needs-review.
6. **Pipeline** (§5.5) — stage bar horizontal, badge Unknown source + bulk
   resolve ke Inbox, lead panel dengan touchpoint timeline.
7. **Payments** (§5.6) — Logs (total = $7,497.00, sama dengan KPI Overview)
   + Export CSV yang benar-benar mengunduh, Orphaned dengan suggested-match
   + total KPI, Cohorts retensi nyata (unattributed dikecualikan + link Inbox),
   LTV & Churn dengan judgment label dari Goals + status breakdown.
8. **Attribution Inbox** (§5.7) — queue 18 orphaned payments ($129,946 persis),
   evidence panel, ranked match + confidence, attach/dismiss **berfungsi**
   dengan undo dan write-back ke Attribution Health.
9. **Helios** (§5.8) — history, pinned insights, ranked drivers,
   "Make this a recurring insight" → Automated Reports (FR-X3).
10. **Goals & Alerts** (§5.11) — 3 grup, target/warning/red-alert, status pill,
    "Set goal" affordance, alert log.
11. **Automated Reports** (§5.9) — template gallery + status cards lifecycle
    jujur + **report builder** penuh (klik template / New Report / fix
    recipient): blok library, AI assistant, recipients chip, schedule,
    timezone IANA searchable (FR-G8), checklist gating Publish (FR-R4),
    Publish menambah report ke list.
12. **Meta Insights → Segmented Insights** (FR-A4) — 5 dimensi (Gender/Age/
    Device/Platform/Placement) dengan label humanized, best/worst cards,
    setiap dimensi menjumlah persis ke total Overview.
13. **Meta Insights → Historical** (FR-A5) — Daily/Weekly/Monthly dengan
    subtotal, kolom Canceled berisi count sebenarnya.
14. **Dashboards** (§5.10) — canvas + metric picker: search, kategori
    collapsible, favorites, recents, deskripsi plain-language (FR-D2);
    add/remove component berfungsi.
15. **Theme** (FR-G9, DS-2) — 4 preset accent yang benar-benar menukar token
    (seluruh UI berubah), dark mode opt-in fungsional dari token yang sama,
    tabel token live values.
16. **Goals quick-fill** — mengisi 7 goal kosong dari rata-rata 30 hari
    (badge "Suggested" + evidence di tooltip), undo satu klik; "Set goal"
    per baris juga berfungsi.

Sidebar memuat indikator **Attribution Health 11% · 18 items** permanen (FR-AI3).

## Keputusan kunci (untuk presentasi)

- **Satu sumber angka** (`src/data/gofunnel.js`): KPI, funnel, chart, dan kolom
  MTD tabel semuanya diturunkan dari deret harian yang sama — headline ROAS
  1.24x = ROAS tabel by construction (PRD NFR-2).
- **Chart rasio = cumulative MTD**: garis Cost/Call, CC/Call, AOV, CAC berakhir
  persis di nilai headline — bukti visual "single calculation service".
- **Calls Booked "+17 calls", bukan "+850%"** — basis < 10 pakai absolute (FR-G2).
- **"—" untuk pembagian nol** (CPM/CPC/CTR/ROAS Jun 6), tidak pernah "↑0%".
- **Warna semantic hanya untuk status vs goal** (pill KPI, conditional formatting
  ROAS < 1 / Cost per Call di atas goal); sisanya monokrom + satu aksen indigo.
- **Semua angka `tabular-nums`, rata kanan** di tabel; tanggal "Jun 1" (en-US).
- **Tooltip rumus** di setiap KPI/metrik via `title` attribute.

## Checklist Build Brief §3

Semua item terpenuhi — tidak ada rate > 100%, tidak ada ↑0%/+850%, ROAS satu
sumber, polaritas konsisten, sidebar aktif accent-soft (light), lolos semua
DON'T di Style Reference §3 (tanpa gradien, glassmorphism, icon warna-warni,
bold 700, radius mainan, area fill pekat, emoji).

## Catatan teknis

- `vite.config.js` memaksa `NODE_ENV` yang benar per command — environment
  dengan `NODE_ENV=production` global merusak react-refresh saat dev.
- `.npmrc` berisi `include=dev` karena alasan yang sama (npm melewatkan
  devDependencies bila `NODE_ENV=production`).
- `shot.js` — helper screenshot dev-only (puppeteer-core + Chrome lokal):
  `node shot.js out.png [fullPage] [prepareScript]`.
