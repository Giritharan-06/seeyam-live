# Full CMS Parity: Make Every Frontend Element Editable from LocalWP

Complete audit of the Next.js frontend vs. WordPress admin settings. This plan adds **every missing editable option** to LocalWP so you can control the entire website from `http://seeyam.local/wp-admin`.

---

## Parity Audit Results

### ✅ Already Editable in WordPress
| Element | WP Location |
|---------|-------------|
| Hero badge, headline, subtitle | Content tab |
| Hero YouTube video URL/title/subtitle/badge | Content tab |
| Stats counter (Engineers, Placement, Rating) | Content tab |
| Hiring partners list | Content tab |
| CTA banner title & subtitle | Content tab |
| Theme preset, colors, fonts, border radius | Appearance tab |
| SEO titles, meta description, OG image, analytics | SEO tab |
| All Courses, Branches, Placements, Reviews, Batches | WP Custom Post Types |

### 🔴 Still Hardcoded in Frontend (Needs WP Fields)

| # | Hardcoded Element | File | Current Value |
|---|-------------------|------|---------------|
| 1 | **Navbar trust badges** (3 text badges in top bar) | `Navbar.tsx:85,89,93` | "ISO 9001:2015 Certified Institute", "NASSCOM Aligned Tech Curriculum", "100% Placement Assurance" |
| 2 | **Navbar helpline phone** (fallback) | `Navbar.tsx:107` | "+91 89399 15577" |
| 3 | **Logo brand name** | `Logo.tsx:47-58` | "SEEYAM", "TECHNOLOGIES", tagline "IT Training • Certification • Placement" |
| 4 | **Hero value props** (3 bullet points) | `Hero.tsx:131,135,139` | "100% Placement Record", "Real-time Enterprise Labs", "Weekday & Weekend Batches" |
| 5 | **Featured courses section title** | `page.tsx:119,122` | "Trending Masterclasses" badge, "Featured IT Certification Programs" heading |
| 6 | **Placements section title** | `page.tsx:221,224` | "100% Placement Assurance" badge, "Recent Alumni Success Stories" heading |
| 7 | **Reviews section title** | `page.tsx:308,312` | Section heading (need to check) |
| 8 | **Branches section title** | `page.tsx:383,386` | "X Campuses Across South India", "Find Your Nearest Campus" |
| 9 | **Footer description** | `Footer.tsx:39` | Full paragraph about the company |
| 10 | **Footer trust badges** | `Footer.tsx:44,47` | "ISO 9001:2015 Certified", "NASSCOM Aligned" |
| 11 | **Footer contact info** | `Footer.tsx:118,124,129` | Phone, email, business hours |
| 12 | **Footer copyright** | `Footer.tsx:148` | "Seeyam Technologies Pvt. Ltd." |
| 13 | **Contact page FAQs** | `contact/page.tsx:24-45` | 5 hardcoded FAQ Q&A pairs |
| 14 | **About page: Trainers** | `about/page.tsx:30-63` | 4 trainer profiles (name, role, bio, avatar, tags) |
| 15 | **About page: Milestones** | `about/page.tsx:65-91` | 5 milestone entries (year, title, desc) |
| 16 | **About page: Mission & Vision** | `about/page.tsx:140-153` | Mission text, Vision text |
| 17 | **About page: "Why Choose" pillars** | `about/page.tsx:172+` | 5-6 advantage cards (title, desc) |
| 18 | **Social media links** | Not present | No Facebook/Instagram/LinkedIn/YouTube links anywhere |

---

## Proposed Changes

### 1. WordPress Plugin — New Settings Fields

#### [MODIFY] [seeyam-headless-cms.php](file:///d:/greens/wordpress-plugin/seeyam-headless-cms.php)

Add a **4th tab: "Brand & Footer"** and a **5th tab: "About & FAQs"** to the settings page:

**Tab 4 — Brand & Footer:**
- Logo brand name (e.g. "SEEYAM")
- Logo secondary text (e.g. "TECHNOLOGIES")  
- Logo tagline (e.g. "IT Training • Certification • Placement")
- Trust badge 1 text, Trust badge 2 text, Trust badge 3 text
- Default helpline phone number
- Footer company description paragraph
- Footer phone, email, business hours
- Footer copyright company name
- Social media URLs (Facebook, Instagram, LinkedIn, YouTube, Twitter/X)

**Tab 5 — About & FAQs:**
- About page hero badge, heading, subheading
- Mission statement text
- Vision statement text
- "Why Choose" pillar cards (repeater: title + description, up to 6)
- Trainer profiles (repeater: name, role, experience, bio, avatar URL, tags)
- Company milestones (repeater: year, title, description)
- FAQ entries (repeater: question + answer, up to 10)

**Tab 3 (Content) — Add Section Headings:**
- Featured courses section badge text + heading
- Placements section badge text + heading
- Reviews section badge text + heading
- Branches section badge text + heading
- Hero value prop 1, 2, 3 texts

Update `get_default_settings()` with all new defaults.
Update `get_site_settings()` and `get_all_platform_data()` to return the new fields.

---

### 2. Next.js TypeScript Types

#### [MODIFY] [wordpress.ts](file:///d:/greens/lib/wordpress.ts)

Add all new fields to the `PlatformSettings` interface and `getDefaultSettings()`.

---

### 3. Frontend Components — Wire to `siteSettings`

#### [MODIFY] [Logo.tsx](file:///d:/greens/components/Logo.tsx)
Read brand name, secondary text, and tagline from `siteSettings`.

#### [MODIFY] [Navbar.tsx](file:///d:/greens/components/Navbar.tsx)
Read trust badge texts and fallback helpline phone from `siteSettings`.

#### [MODIFY] [Hero.tsx](file:///d:/greens/components/Hero.tsx)
Read value prop texts from `siteSettings`.

#### [MODIFY] [page.tsx](file:///d:/greens/app/(public)/page.tsx)
Read section heading texts from `siteSettings` for featured courses, placements, reviews, branches sections.

#### [MODIFY] [Footer.tsx](file:///d:/greens/components/Footer.tsx)
Read company description, contact info, copyright, trust badges, and social links from `siteSettings`.

#### [MODIFY] [contact/page.tsx](file:///d:/greens/app/(public)/contact/page.tsx)
Read FAQ entries from `siteSettings` instead of hardcoded array.

#### [MODIFY] [about/page.tsx](file:///d:/greens/app/(public)/about/page.tsx)
Read mission, vision, trainers, milestones, and "why choose" pillars from `siteSettings`.

---

### 4. WordPress Admin — Quick Access Links

#### [MODIFY] [seeyam-headless-cms.php](file:///d:/greens/wordpress-plugin/seeyam-headless-cms.php)

Add a **"🌐 View Live Website"** button/link to `http://localhost:3000` at the top of every settings tab, and a dashboard widget with direct links to:
- View Homepage → `http://localhost:3000`
- View Courses → `http://localhost:3000/courses`
- View About → `http://localhost:3000/about`
- View Contact → `http://localhost:3000/contact`

---

## User Review Required

> [!IMPORTANT]
> **New tabs in WP admin**: This adds 2 new tabs ("Brand & Footer" and "About & FAQs") to the existing 3-tab settings page. All hardcoded content will become editable without changing the visual design.

> [!WARNING]
> **About page trainers/milestones**: Currently these are hardcoded arrays. They'll be stored as JSON strings in WP options, editable via repeater-style UI fields in the admin. The user can add/remove/reorder entries.

## Open Questions

> [!IMPORTANT]
> 1. **Social media links** — Which platforms do you use? (Facebook, Instagram, LinkedIn, YouTube, Twitter/X?) Should they appear in the footer or both navbar and footer?
> 2. **About page "Why Choose" section** — Currently has ~5 cards with hardcoded text. Should the number of cards be flexible (add/remove from WP)?

---

## Verification Plan

### Automated Tests
- `npm run build` — Verify no TypeScript errors after adding new PlatformSettings fields
- Copy updated plugin to `F:\seeyam\app\public\wp-content\mu-plugins\` and verify WP loads without PHP errors

### Manual Verification
- Open WP admin → Seeyam Settings → verify all 5 tabs render correctly
- Change a value (e.g. Logo brand name) → Save → Refresh Next.js site → verify the change appears
- Open browser and verify every page (homepage, about, contact, courses, placements, reviews, branches) still renders correctly
