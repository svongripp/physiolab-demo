# Physiolab — "Find your physio" concept demo

A small static proof-of-concept built for **Kenneth Lo** to look at. Two ideas:

1. **A "find your physio" front door** — let people search by what's bothering them
   (plus location, language, and funding), then deep-link straight into the right
   practitioner's Jane booking page. Today the website sends everyone to a location
   chooser and then into one of four separate Jane accounts, with no way to find the
   right *person* for their problem first.
2. **Service-specific SEO landing pages** — pages built around what people actually
   search for (e.g. "ICBC physiotherapy Vancouver"), which the current site doesn't have.
   Each one funnels into the finder.

> This is an idea to react to, not a finished product. If it's useful, your web
> provider can rebuild it properly inside the real site and CMS.

## What's here

| File | What it is |
|---|---|
| `index.html` | The "find your physio" finder — live filtering by condition / care type / location / language / funding |
| `icbc-physiotherapy-vancouver.html` | Sample SEO page — ICBC / car-accident recovery |
| `pinched-nerve-neck-pain-vancouver.html` | Sample SEO page — pinched nerve / neck pain, with a recovery timeline |
| `ims-dry-needling-vancouver.html` | Sample SEO page — IMS / Gunn dry needling |
| `spinal-decompression-vancouver.html` | Sample SEO page — spinal decompression |
| `assets/styles.css` | Shared styling (light default + dark toggle) |
| `assets/physios.js` | Practitioner data + the category taxonomy |
| `assets/finder.js` | Theme toggle + filter logic |

## View it locally

```sh
cd physiolab-demo
python3 -m http.server 8000
# then open http://localhost:8000
```

(Opening `index.html` directly as a file also works.)

## How the booking deep-links work

Each location is a **separate Jane account**:

| Location | Jane |
|---|---|
| Olympic Village | `thephysiolab.janeapp.com` |
| Keefer | `reformotiv.janeapp.com` |
| Hastings | `thephysiolabhastings.janeapp.com` |
| Little Mountain | `physiolablittlemountain.janeapp.com` |

Each "Book with …" button is a per-practitioner deep link —
`https://thephysiolab.janeapp.com/#/staff_member/<id>` — which lands the patient
directly on that person's booking page. **These are live, real deep links for the
Olympic Village roster** (staff IDs read from the booking site). The other three
locations would need their own IDs wired the same way.

## Honest caveats (please verify before any real use)

- **Practitioner tags are inferred** from public bios on the website + Olympic
  Village Jane page, June 2026. Treat every specialization tag as a draft.
- **Only the Olympic Village roster is populated.** The other three locations are
  stubbed — selecting them shows a placeholder. The real build would pull each
  location's roster.
- **Funding tags are illustrative.** (Notably, the demo reflects that one
  practitioner is private-pay only — exactly the kind of mismatch a good front door
  catches before someone books wrong.)
- The SEO pages are `noindex` here on purpose — they're a demo and shouldn't be
  crawled or compete with the live site. On the real domain they'd be indexable.
