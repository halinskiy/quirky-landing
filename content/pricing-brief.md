# Quirky — Pricing Brief for Copywriter

**Author:** 3mpq-economist
**Date:** 2026-05-31
**Reads before:** copywriter writes any pricing section, tier labels, CTA buttons, or footnotes.
**Model locked:** one-time unlock, Free + Pro. Do not change this decision.

---

## 1. Decided price: $16.99 one-time (Pro unlock)

Anchor price: **$16.99**. This is the single number to use everywhere.

Rationale is in section 4. The range examined was $14.99-$19.99; $16.99 is the optimal point inside it.

---

## 2. Competitive context

Prices verified May 2026.

| Tool | What it does | Price | Model | Notes |
|---|---|---|---|---|
| [CleanShot X](https://cleanshot.com/pricing) | Screenshots + annotation + cloud | $29 one-time | One-time + $19/yr update renewal | Single-purpose (capture/annotate). Direct only; no MAS version noted on pricing page. |
| [PixelSnap 2](https://pixelsnap.com/buy) | Pixel measurement only | $39 one-time (1 Mac) | One-time | Single mode. Direct only + Setapp. Student discount 30%, CleanShot X users 20%. |
| TextSniper | OCR from screenshots | $7.99 direct / $11.99 MAS | One-time | Single mode. Setapp also. |
| ColorSlurp | Color picker + palettes | $7.99 one-time (Pro IAP) | Free + one-time IAP in MAS | Single mode, basic. Subscription alt at $19.99/yr. |
| Sip | Color picker | $29.99/yr | Subscription only | Single mode. Setapp also. |
| Raycast | Launcher with extension ecosystem | Free core / $8/mo Pro | Freemium + subscription | Not a capture tool. Relevant as "developer's Swiss Army knife" frame competitor. |

### Where Quirky sits

Quirky is priced BELOW every multi-feature tool in this set:

- TextSniper (OCR only): $7.99-$11.99 for one mode.
- ColorSlurp (color only): $7.99 for one mode.
- PixelSnap (measurement only): $39 for one mode.

Quirky Pro gives the developer or designer five modes in one capture gesture for $16.99. The value argument writes itself: buying TextSniper + ColorSlurp + PixelSnap separately costs $57-$59 on direct, $7.99 + $7.99 + $39. Quirky is less than a third of that for a superset of those workflows (plus DOM and SVG extraction that none of them offer).

CleanShot X at $29 is the natural price ceiling anchor in the buyer's mind. Quirky at $16.99 lands comfortably below it while delivering complementary functionality (different job: extraction vs capture/annotation).

Raycast is free. This matters because some of Quirky's audience already has Raycast. Frame: Quirky does the screen-capture-to-clipboard job that Raycast extensions cannot; they coexist.

---

## 3. Free vs Pro split

The split must feel generous, not a demo. Users are already live; a stingy free tier will generate bad reviews.

**Free tier includes:**

- OCR (Apple Vision, offline) -- the highest-value single mode for the widest audience
- HEX (eyedropper, one pixel color)
- SPX (pixel measurement with edge detection)
- Mode pill UI (the floating switcher) visible and functional for all 3 free modes
- Menu-bar icon + hotkey (cmd+shift+1) always active

**Pro tier adds ($16.99 one-time):**

- DOM extraction (browser element / selector via AppleScript)
- SVG extraction (icon source from browser page)
- All 5 modes active simultaneously (Tab cycles through all five, not just three)
- Future modes (any extraction mode added post-1.0)

### Rationale for this split

**Why OCR is free:** OCR is the reason most people try the app. Gating it makes free feel broken. TextSniper charges $7.99 for OCR alone; Quirky giving it free is a strong differentiating statement.

**Why HEX and SPX are free:** They complete the "I need a number right now" workflow. A dev debugging CSS gets color + measurement + text for free. That is a complete, useful app. The free user has no reason to leave a bad review.

**Why DOM and SVG are Pro:** These two modes require AppleScript automation across browsers -- the technically most complex feature set, the highest-value for the developer workflow, and meaningfully differentiated from everything else on the market. They are also the features that cannot be in the App Store build (sandbox restriction). Gating them in Pro is honest: they require more from the OS (Automation permission prompt), and they are the reason a developer opens their wallet.

**App Store implication:** App Store build ships OCR + HEX + SPX. No Pro unlock in the App Store build at all (DOM/SVG are not available in sandbox). This is not a problem; it means App Store customers get a fully functional free tool, no upsell possible, no confusion. Honest footnote needed on the landing page.

---

## 4. Exact price $16.99 -- rationale

### Cost model (solo dev, UK, this is a side project shipping to live users)

Fixed monthly costs (ASSUMPTION -- Kostya to verify):

| Item | Monthly est. |
|---|---|
| Apple Developer Program | $8.25/mo ($99/yr amortized) |
| Domain + hosting (Vercel hobby / GH Pages) | ~$0-12/mo |
| Code signing / notarization infrastructure | $0 (included in Apple Dev) |
| Sparkle feed hosting | $0 (GitHub) |
| Total fixed | ~$8-20/mo |

Variable per-sale costs at $16.99 Direct (DMG):

| Fee | Amount |
|---|---|
| Paddle / Gumroad / Lemon Squeezy (ASSUMPTION -- direct payment processor TBD) | ~5-10% + $0.50 = ~$1.20-2.20 |
| Net per Direct sale at $16.99 | ~$14.79-15.79 |

Variable per-sale costs at $16.99 App Store (15% Small Business rate -- Kostya qualifies as new developer earning under $1M):

| Fee | Amount |
|---|---|
| Apple 15% commission | $2.55 |
| Net per MAS sale at $16.99 | $14.44 |

ASSUMPTION: Kostya qualifies for Apple's Small Business Program (15% rate, not 30%) because he is a new developer with App Store proceeds well under $1M/yr. He must enroll explicitly at [developer.apple.com/app-store/small-business-program/](https://developer.apple.com/app-store/small-business-program/). If he does not enroll, the rate is 30% and net MAS drops to $11.89 -- still viable but 18% lower.

### Sales needed for meaningful income

ASSUMPTION "meaningful" = covering fixed costs + producing side income of 500 GBP (~$625 USD/mo at May 2026 rates). Total monthly target: $633-645.

| Scenario | Sales needed/mo | Notes |
|---|---|---|
| Break-even (fixed costs only) | 1-2 sales | Trivially low threshold |
| Side income $500/mo net | ~35 Direct sales | At $14.79/sale net |
| Side income $1,000/mo net | ~69 Direct sales | At $14.79/sale net |
| Side income $2,000/mo net | ~137 Direct sales | Realistic "small indie success" |

At $14.99 (lower bound): 35 sales = $524 net. At $19.99 (upper bound): 35 sales = $700 net.

### Why $16.99 and not $14.99 or $19.99

$14.99 leaves 13% net on the table vs $16.99 for no psychological benefit -- both are sub-$20, both clear the "impulse buy" threshold developers use (roughly "costs less than two hours of my time"). The additional $2 per sale at $16.99 vs $14.99 is $70/mo at 35 sales -- meaningful for a solo dev.

$19.99 crosses a cognitive line. In developer tool markets, $19.99 reads as "premium tier" and invites comparison to PixelSnap's $39 (one mode) or TextSniper's $11.99 (one mode). At $19.99, the "five modes for less than one competitor" argument still works, but the "friendly" frame weakens slightly. The Quirky brand is explicitly warm, not premium-positioned.

$16.99 is the sweet spot: below the $20 barrier, above the "feels cheap" $14.99, and it hits a specific psychological note -- it's an unusual price, not a round number. Unusual prices are slightly harder to dismiss as arbitrary and signal that the developer thought about it. (ASSUMPTION -- this is a soft behavioral-pricing heuristic, not hard data.)

### App Store vs Direct pricing

**Recommendation: identical price on both channels ($16.99).**

Rationale: the App Store build is a subset product (3 modes, no DOM/SVG). Charging less for it would be confusing and undersell the Direct version's value. Charging the same for a subset is defensible because: the user who buys on the App Store gets what they paid for; the user who wants all 5 modes knows to buy Direct. A price difference would require the landing page to explain it, which adds friction and complexity.

Do NOT create a Direct discount. The landing page should simply present two download paths and note the mode difference honestly. The pricing UI shows one price ($16.99 Pro unlock) with a footnote: "App Store build includes OCR, HEX, and SPX. DOM and SVG require the Direct download."

---

## 5. Breakeven timeline (Direct channel, new app)

ASSUMPTION: these are conservative first-year estimates for a notarized macOS utility launched by a solo dev with no existing audience. Based on comparable solo macOS utility launches observed in indie dev communities (Hacker News Show HH, IndieHackers), not verified hard data.

| Month | Realistic sales | Net revenue | Cumulative |
|---|---|---|---|
| 1 (launch month) | 30-80 | $443-$1,183 | $443-$1,183 |
| 2-3 | 10-25/mo | $148-$370/mo | $739-$1,923 |
| 4-6 | 5-15/mo | $74-$222/mo | $962-$2,589 |
| 7-12 | 3-10/mo | $44-$148/mo | $1,226-$3,477 |

Launch spike is real but short. A new macOS utility with a Show HN post, Twitter/X announcement, and Product Hunt launch can realistically hit 50-150 first-week sales. After the spike, organic discovery from MAS search and direct site SEO drives a much lower floor (3-15 sales/mo). The math for break-even (covering $8-20/mo fixed) is trivially easy. The math for $500/mo sustained income requires either a second product or a content/distribution effort.

**Risk flags:**
1. Single product, single platform. No recurring revenue. If sales dry up, income stops. Mitigation: free tier creates a large installed base that seeds word-of-mouth and future version upgrades.
2. App Store sandbox limitation means DOM/SVG modes cannot be unlocked on MAS. MAS users get a free 3-mode tool with no upgrade path. This is honest but means MAS is purely a discovery/brand channel, not a revenue channel at scale.
3. No email list, no existing audience. Launch spike depends entirely on one-time PR (Product Hunt, HN, Twitter). Without capturing emails at launch, month 2+ is structurally weak. RECOMMENDATION: add email capture to the landing page (newsletter opt-in or "notify me of updates") before launch.

---

## 6. Microcopy anchors for the copywriter

### Tier names

- Free tier: **Quirky** (or "Quirky Free" in fine print only -- the primary name is just Quirky)
- Pro tier: **Quirky Pro**
- Do NOT use: Starter, Basic, Essential, Plus, Premium, Advanced, Lite, Standard

### What this price signals to the buyer

$16.99 one-time says: "a real tool made by a real person, priced like they respect both of our time." It is below the impulse-purchase threshold for a developer ($20 = two minutes of billable time at $60/hr). It is above "toy app" territory ($2.99). It signals craft without signaling corporate.

### Language this price supports

- "Once, not monthly" -- emphasize finality; no subscription anxiety
- "Yours forever" -- lifetime ownership framing
- "Built by one person" -- solo-dev authenticity
- "Less than a fancy coffee run" -- relatable, not cringe
- "Five tools in one gesture" -- value density argument
- "Works on macOS 13 and later" -- specific, honest

### Language this price does NOT support

- "Investment" -- that word belongs at $99+
- "Premium" -- banned by project NEVER list
- "Affordable" -- condescending at $16.99; just state the price
- "Cheap" -- do not use
- "Discount" / "deal" -- this is not a sale, it's the price
- "Lifetime deal" -- LTD connotations from AppSumo deals; avoid; say "one-time" instead

### CTA button copy guidance

**Primary CTA (Direct download):**
- "Download for Mac" (clean, factual)
- "Get Quirky -- $16.99" (price-in-button if showing on Pro card)
- Below button: "macOS 13+ -- Apple Silicon and Intel -- 4.2 MB"

ASSUMPTION: file size 4.2 MB is a placeholder. Kostya must supply the actual DMG size before copywriter finalizes the sub-button line.

**Secondary CTA (App Store):**
- "Download on the App Store" (Apple's required phrasing for the MAS badge)
- Below: "Includes OCR, HEX, and SPX" (honest mode list)

**Free tier CTA:**
- "Download free" or "Get Quirky"
- No asterisk, no "limited time free" -- free is permanent

### Footnote guidance for pricing section

Required footnotes (copywriter writes final wording, but these facts must be present):

1. "App Store build includes OCR, HEX, and SPX. DOM and SVG extraction require the direct download. Both builds are free to try."
2. "One-time purchase. No subscription. Updates included for version 1.x."
3. Refund policy: ASSUMPTION -- standard is 14-30 days, Kostya to confirm. If using Paddle/Gumroad: platform handles refunds. If MAS: Apple's standard 14-day window.

### Voice calibration against competitors at this tier

At $16.99, your voice peers are indie solo-dev tools like TextSniper, ColorSlurp Pro, and small utilities from developers like Sindre Sorhus. Their copy is:
- Short: 1-2 sentences per feature, not paragraphs
- Factual: what it does, not how it makes you feel
- First-person occasional: "I built this because..." is credible at solo-dev scale
- No corporate plural: "we built" when it's one person is false; "I built" is honest and builds trust

Do not write like CleanShot X (professional, polished, slightly corporate even at indie scale). Write like the friend who texted you "hey I made this thing, try it."

---

## 7. What to avoid (project-wide, reinforced here)

From `research/product-truth.md` NEVER list, reinforced for pricing context:

- No em-dash, en-dash, middle-dot, bullet in copy (ASCII hyphens only if needed)
- Banned: seamless, powerful, robust, cutting-edge, supercharge, unlock, leverage, next-gen, revolutionary, magical, AI-powered, premium, enterprise-grade, industry-leading, best-in-class
- No fake testimonials, no invented case studies
- "unlock" is banned -- do not write "unlock Pro features"; write "get all five modes" or "go Pro"
- "powerful" is banned -- do not write "powerful OCR"; write "reads text off anything on your screen"
