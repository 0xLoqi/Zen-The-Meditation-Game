# Zen – Economy & Rewards Specification (v0.9)

> **Audience:** engineers, designers, PM (single‑player)
> **Purpose:** single source of truth for every lever that pays or charges a user.  *If it isn’t in here it doesn’t ship.*

---

## 1. Glossary
| Term | Definition |
|------|------------|
| **Token (🪙)** | Primary soft‑currency. Earned by actions, spent on Glowbags & cosmetics. |
| **Glowbag** | Loot container that drops Tokens *and sometimes* cosmetics. Four tiers: Common, Rare, Epic, Legendary. |
| **Spin Wheel** | Post‑action RNG wheel that pays Tokens (mostly) & sometimes bags. |
| **XP** | Progression meter (ungameable, granted *only* by validated meditation minutes). |
| **GlowPoint** | Social kudos metric (Like count) used solely for Profile‑of‑the‑Month (POTM). |
| **Mini Zenni** | Player avatar; composed of base sprite + modular cosmetics. |

---

## 2. Core Loops

### 2.1 Daily Habit Loop
```
Meditate ➜ Spin Wheel ➜ Earn Tokens ➜ Save or Buy Common Glowbag
Repeat tomorrow (streak ↑)  
```
- **Post‑med wheel** provides immediate gratification.
- **Streak multiplier** increases Wheel token payout (table §5).

### 2.2 Quest / Achievement Loop
```
Complete Quest / Achievement ➜ High‑odds Spin ➜ Rare/Epic Glowbag ➜ New Cosmetic ➜ Flex in Friend Den
```
- Quests reset daily; Achievements are one‑off.

### 2.3 Social Loop
```
Visit Friend Den ➜ Like spam ➜ GlowPoints for friend (no tokens) ➜ POTM contest ➜ Prestige cosmetic
```

### 2.4 Economy Balancer
```
Token SOURCES: Wheel, Glowbags, events
Token SINKS: Buying Glowbags, store cosmetics, Streak Saver, trading fee, Legendary bag IAP
```

---

## 3. Token Earnings
| Action | Base Tokens | Notes |
|--------|-------------|-------|
| Validated meditation | 25 | 1‑min min; +5 per extra minute (cap 60) |
| Spin Wheel (daily)   | 20‑50 | RNG; multiplier applies |
| Quest (per slot)     | 15‑40 | Depends on difficulty |
| Achievement (tiered)| 100 / 250 / 500 | One‑off |
| Like (first per friend / day) | *0* | No tokens (pure social) |

### 3.1 Streak Multiplier
`tokensEarned = base × multiplier` where
`multiplier = min(1 + 0.05*(streakDay −1), 1.5)` (caps day 11)

---

## 4. Spin Wheel
| Slice | Prob % | Reward |
|-------|--------|--------|
| 1‑6   | 60     | 25‑50 Tokens |
| 7‑8   | 20     | +20 Bonus Tokens |
| 9     | 15     | Common Glowbag |
| 10    | 5      | Rare Glowbag |

- **One free spin** after first validated session each day.  
- Plus subscribers may buy 1 extra spin for **50 Tokens**.

---

## 5. Glowbag Tiers & Loot Tables
| Tier | Cost (Token) | Obtain | Tokens (rng) | Cosmetic Drop Chances | Notes |
|------|--------------|--------|--------------|-----------------------|-------|
| **Common** | 50 | Store, Wheel | 25‑40 | 0 % | Daily churn |
| **Rare** | 200 | Store, 7‑day streak, quests | 60‑90 | 1 % Common cosmetic | Entry prestige |
| **Epic** | 600 | Store, Epic quest, Plus Daily | 100‑140 | 9 % Rare, 1 % Epic | Core excitement |
| **Legendary** | 2500 or \$4.99 | IAP, 30‑day streak, POTM | 250‑350 | 50 % Epic, 10 % Legendary | Monetisation anchor |

*Opening a bag gives Tokens **plus** cosmetic if RNG hits.*

---

## 6. Cosmetic Categories & Rarity Caps
| Slot | Common | Rare | Epic | Legendary |
|------|--------|------|------|-----------|
| Headgear | ✓ | ✓ | ✓ | ✓ |
| Face     | ✓ | ✓ | ✓ |  – |
| Aura     |  – | ✓ | ✓ | ✓ |
| Outfit   | ✓ | ✓ | ✓ | ✓ |
| Accessory| ✓ | ✓ | ✓ |  – |
| Companion|  – |  – | ✓ | ✓ |
| Background| ✓ | ✓ |  – |  – |
| Border   |  – | ✓ | ✓ |  – |
| Vibe Sign| ✓ | ✓ |  – |  – |

---

## 7. Marketplace & Trading
- **Unlock at Level 5.**
- Listings cost **25 Tokens** (burned). 3 % seller fee (burn).
- Cosmetics are **soulbound for 24 h** after drop to prevent bot flip.
- Legendary & Event items have **hard supply caps**; first edition tag retained through trades.

---

## 8. Anti‑Cheat & XP
- Meditation counted only if **AppState==active** throughout *(see FocusLock module)*.
- Face‑tracking future upgrade → will scale XP multiplier but never Tokens.
- XP formula: `xp = validatedMinutes × 10 × (1+friendCoopBonus)`.

---

## 9. Future Levers
| Planned | ETA | Notes |
|---------|-----|-------|
| Seasons framework | Q3 | Rotating quest pool, limited cosmetics |
| Fashion contest (vote) | Q3 | Entry fee 100 Tokens; winners share 25 % token pot |
| Secret 1×1 cosmetic | Q4 | Highest monthly XP earner |

---

## 10. Changelog
| Version | Date | Author | Notes |
|---------|------|--------|-------|
| 0.9 | 2025‑04‑26 | ChatGPT o3 | Initial consolidated spec