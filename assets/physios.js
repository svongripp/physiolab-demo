/* Physiolab demo — practitioner dataset + taxonomy.
 *
 * SOURCE: built from the public Physiolab website + the Olympic Village Jane
 * roster (thephysiolab.janeapp.com), read June 2026. Specializations are drawn
 * from each practitioner's public bio. This is a PROOF OF CONCEPT — the team
 * should verify every tag and fill in the other three locations' rosters.
 *
 * DEEP LINKS: each location is a separate Jane account/subdomain. In production
 * each `book` link becomes a per-practitioner deep link of the form
 *   https://<subdomain>.janeapp.com/#/staff_member/<id>
 * which drops the patient straight onto that person's booking page. We don't
 * have the numeric staff IDs, so the demo links to the correct location's Jane
 * landing page (still the right account) and notes the deep-link upgrade.
 */

const JANE = {
  "olympic-village": "https://thephysiolab.janeapp.com",
  "keefer":          "https://reformotiv.janeapp.com",
  "hastings":        "https://thephysiolabhastings.janeapp.com",
  "little-mountain": "https://physiolablittlemountain.janeapp.com",
};

// Real Jane staff_member IDs for the Olympic Village account
// (thephysiolab.janeapp.com), read from the live booking site June 2026.
// Deep-link route confirmed from Jane's own markup: #/staff_member/<id>.
const STAFF_IDS = {
  "Kenneth Lo": 1, "Jackson Lam": 2, "Judy Chiu": 82, "Courtney Chan": 55,
  "Ernest Lo": 54, "Katie Wnuk": 33, "Alexia Lee": 64, "Kelly To": 79,
  "Jacky Shen": 49, "Mecca Clipsham": 45, "Asahi Ng": 78, "Leena Yamaguchi": 57,
  "Brandon Luu": 38, "Kurt Baker": 34, "Tina Luu": 9, "Samantha Johnson": 83,
  "Dr. DaYe Jeong": 13, "Jenessa Quan": 58, "Christine Bersabe": 81,
};

const TAXONOMY = {
  condition: {
    label: "I want help with…",
    options: {
      "neck-back":   "Neck & back pain",
      "nerve":       "Pinched nerve / sciatica",
      "headache-tmj":"Headaches & jaw (TMJ)",
      "upper-limb":  "Shoulder, elbow, wrist & hand",
      "dizziness":   "Dizziness, balance & concussion",
      "sports":      "Sports & performance",
      "running":     "Running & racquet sports",
      "pelvic":      "Pelvic health & pre/post-natal",
      "neuro":       "Post-surgery, stroke & neuro",
      "icbc":        "Car accident (ICBC)",
      "work":        "Work injury (WorkSafeBC)",
      "chronic":     "Chronic & persistent pain",
    },
  },
  discipline: {
    label: "Type of care",
    options: {
      "physio":      "Physiotherapy",
      "massage":     "Massage therapy",
      "chiro":       "Chiropractic",
      "acupuncture": "Acupuncture / TCM",
      "kin":         "Kinesiology / active rehab",
    },
  },
  location: {
    label: "Location",
    options: {
      "olympic-village": "Olympic Village",
      "keefer":          "Keefer",
      "hastings":        "Hastings",
      "little-mountain": "Little Mountain",
    },
  },
  language: {
    label: "Language",
    options: {
      "en": "English", "yue": "Cantonese", "cmn": "Mandarin",
      "ja": "Japanese", "tl": "Tagalog",
    },
  },
  funding: {
    label: "Funding accepted",
    options: {
      "icbc": "ICBC", "wsbc": "WorkSafeBC", "msp": "MSP", "private": "Private / extended health",
    },
  },
};

// Common funding profile for most clinicians (ICBC + WorkSafe + MSP + private).
const FULL_FUNDING = ["icbc", "wsbc", "msp", "private"];

const PRACTITIONERS = [
  { name: "Kenneth Lo", discipline: "physio", role: "Physiotherapist · FCAMPT",
    blurb: "Fellow of the Canadian Academy of Manipulative Therapy. Sports, motor-vehicle and work-related injuries with hands-on manual therapy.",
    conditions: ["neck-back", "nerve", "sports", "icbc", "work"],
    approaches: ["Manual therapy", "Manipulation (FCAMPT)"],
    languages: ["en"], funding: FULL_FUNDING, locations: ["olympic-village"] },

  { name: "Jackson Lam", discipline: "physio", role: "Physiotherapist · Gunn IMS",
    blurb: "TMJ dysfunction, headaches, neck and back pain, and sports injuries. Certified in medical acupuncture and Gunn IMS.",
    conditions: ["neck-back", "headache-tmj", "sports", "nerve"],
    approaches: ["IMS / dry needling", "Medical acupuncture"],
    languages: ["en"], funding: FULL_FUNDING, locations: ["olympic-village"] },

  { name: "Judy Chiu", discipline: "physio", role: "Physiotherapist · Vestibular",
    blurb: "Hand, wrist, elbow and shoulder injuries plus concussion and vestibular rehabilitation.",
    conditions: ["upper-limb", "dizziness", "neck-back"],
    approaches: ["Vestibular rehab", "Manual therapy"],
    languages: ["en", "yue", "cmn"], funding: FULL_FUNDING, locations: ["olympic-village"] },

  { name: "Courtney Chan", discipline: "physio", role: "Physiotherapist",
    blurb: "Musculoskeletal injuries, post-stroke, traumatic brain injury and post-surgical care, using clinical Pilates, manual therapy and dry needling.",
    conditions: ["neuro", "neck-back", "chronic"],
    approaches: ["Clinical Pilates", "Manual therapy", "Dry needling"],
    languages: ["en"], funding: FULL_FUNDING, locations: ["olympic-village"] },

  { name: "Ernest Lo", discipline: "physio", role: "Physiotherapist",
    blurb: "Neck pain, rotator cuff pathology and back pain.",
    conditions: ["neck-back", "upper-limb"],
    approaches: ["Manual therapy"],
    languages: ["en", "yue"], funding: FULL_FUNDING, locations: ["olympic-village"] },

  { name: "Katie Wnuk", discipline: "physio", role: "Physiotherapist · FCAMPT, Sport Dip.",
    blurb: "Sport Physiotherapy Canada Diploma and Fellow of the Canadian Academy of Manipulative Physiotherapy.",
    conditions: ["sports", "neck-back"],
    approaches: ["Manipulation (FCAMPT)", "Sport physiotherapy"],
    languages: ["en"], funding: ["private"], locations: ["olympic-village"] },

  { name: "Alexia Lee", discipline: "physio", role: "Physiotherapist · Clinical Pilates",
    blurb: "Combines education, manual therapy and exercise. Certified in clinical Pilates and running-injury treatment.",
    conditions: ["running", "neck-back"],
    approaches: ["Clinical Pilates", "Exercise rehab"],
    languages: ["en"], funding: FULL_FUNDING, locations: ["olympic-village"] },

  { name: "Kelly To", discipline: "physio", role: "Physiotherapist",
    blurb: "Special interest in running and racquet-sport-related injuries.",
    conditions: ["running", "sports"],
    approaches: ["Exercise rehab"],
    languages: ["en", "yue", "cmn"], funding: FULL_FUNDING, locations: ["olympic-village"] },

  { name: "Jacky Shen", discipline: "physio", role: "Physiotherapist · Dry needling",
    blurb: "Certified in biomedical dry needling and soft-tissue release.",
    conditions: ["neck-back", "sports", "chronic"],
    approaches: ["Dry needling", "Soft-tissue release"],
    languages: ["en", "yue"], funding: FULL_FUNDING, locations: ["olympic-village"] },

  { name: "Mecca Clipsham", discipline: "physio", role: "Physiotherapist · Pelvic floor",
    blurb: "Certified in pelvic floor levels 1–3. (Returning from maternity leave — confirm availability.)",
    conditions: ["pelvic"],
    approaches: ["Pelvic floor physiotherapy"],
    languages: ["en"], funding: FULL_FUNDING, locations: ["olympic-village"] },

  { name: "Asahi Ng", discipline: "physio", role: "Physiotherapist",
    blurb: "Advanced Integrated Musculoskeletal Level 1 Diploma. Assessment-led general MSK care.",
    conditions: ["neck-back", "sports", "upper-limb"],
    approaches: ["Manual therapy"],
    languages: ["en", "ja"], funding: FULL_FUNDING, locations: ["olympic-village"] },

  { name: "Leena Yamaguchi", discipline: "physio", role: "Physiotherapist · Exercise focus",
    blurb: "Builds exercise-focused rehabilitation programs (third-year osteopathy diploma student).",
    conditions: ["chronic", "neck-back"],
    approaches: ["Exercise rehab"],
    languages: ["en"], funding: FULL_FUNDING, locations: ["olympic-village"] },

  { name: "Brandon Luu", discipline: "chiro", role: "Chiropractor",
    blurb: "Doctor of Chiropractic using manual therapies, active care and education.",
    conditions: ["neck-back", "chronic"],
    approaches: ["Chiropractic adjustment", "Active care"],
    languages: ["en"], funding: ["icbc", "private"], locations: ["olympic-village"] },

  { name: "Kurt Baker", discipline: "massage", role: "Registered Massage Therapist",
    blurb: "Former CrossFit coach. Motor-vehicle injuries, desk-related tension and chronic pain.",
    conditions: ["icbc", "chronic", "neck-back"],
    approaches: ["Deep tissue", "Sports massage"],
    languages: ["en"], funding: ["icbc", "msp", "private"], locations: ["olympic-village"] },

  { name: "Tina Luu", discipline: "massage", role: "Registered Massage Therapist",
    blurb: "Chronic pain, sports-related injuries and pre/post-natal care. Certified in dermoneuromodulation and structural integration.",
    conditions: ["chronic", "sports", "pelvic"],
    approaches: ["Dermoneuromodulation", "Structural integration"],
    languages: ["en"], funding: ["icbc", "msp", "private"], locations: ["olympic-village"] },

  { name: "Samantha Johnson", discipline: "massage", role: "Registered Massage Therapist",
    blurb: "Myofascial release, Swedish, deep tissue, trigger-point therapy and PNF stretching.",
    conditions: ["chronic", "neck-back"],
    approaches: ["Myofascial release", "Trigger point"],
    languages: ["en"], funding: ["icbc", "msp", "private"], locations: ["olympic-village"] },

  { name: "Christine Bersabe", discipline: "massage", role: "Registered Massage Therapist",
    blurb: "Sports & performance care and chronic sports injuries, blending remedial and rehabilitative massage with strength exercise. (Does not offer ICBC or WorkSafe.)",
    conditions: ["sports", "chronic"],
    approaches: ["Sports massage", "Remedial massage"],
    languages: ["en", "tl"], funding: ["private"], locations: ["olympic-village"] },

  { name: "Dr. DaYe Jeong", discipline: "acupuncture", role: "Dr. of Traditional Chinese Medicine",
    blurb: "Digestive health, hormone balancing, stress management, pain management and women's health.",
    conditions: ["chronic", "pelvic"],
    approaches: ["Acupuncture", "TCM"],
    languages: ["en", "yue"], funding: ["private"], locations: ["olympic-village"] },

  { name: "Jenessa Quan", discipline: "kin", role: "Registered Kinesiologist",
    blurb: "Active rehab and return-to-function programming. Certified in Soft Tissue Release Level 1.",
    conditions: ["icbc", "work", "chronic", "sports"],
    approaches: ["Active rehab", "Soft-tissue release"],
    languages: ["en"], funding: ["icbc", "wsbc", "private"], locations: ["olympic-village"] },
];
