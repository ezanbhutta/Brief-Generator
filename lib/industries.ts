export interface IndustryEntry {
  key: string;
  label: string;
  aliases: string[];
}

export const INDUSTRIES: IndustryEntry[] = [
  { key: "coffee", label: "Coffee & Cafés", aliases: ["coffee", "cafe", "café", "espresso", "specialty coffee", "coffee shop", "roaster", "roastery", "barista", "coffee bar", "third wave coffee"] },
  { key: "restaurants", label: "Restaurants", aliases: ["restaurant", "restaurants", "dining", "bistro", "eatery", "kitchen", "chef", "fine dining", "casual dining"] },
  { key: "fashion", label: "Fashion & Apparel", aliases: ["fashion", "apparel", "clothing", "streetwear", "menswear", "womenswear", "designer", "boutique", "fashion brand"] },
  { key: "skincare", label: "Skincare & Beauty", aliases: ["skincare", "skin care", "beauty", "cosmetics", "makeup", "serum", "facial", "skincare brand", "clean beauty"] },
  { key: "fitness", label: "Fitness & Gyms", aliases: ["fitness", "gym", "workout", "training", "personal trainer", "studio", "pilates", "crossfit", "strength", "boxing"] },
  { key: "fintech", label: "Fintech & Payments", aliases: ["fintech", "finance", "payments", "banking", "neobank", "credit", "lending", "wallet", "investment app", "financial app"] },
  { key: "saas", label: "SaaS & Software", aliases: ["saas", "software", "app", "platform", "tool", "b2b software", "productivity software", "workflow"] },
  { key: "ecommerce", label: "E-commerce", aliases: ["ecommerce", "e-commerce", "online store", "dtc", "direct to consumer", "shopify", "marketplace", "retail"] },
  { key: "real-estate", label: "Real Estate", aliases: ["real estate", "realty", "property", "homes", "housing", "broker", "agent", "real estate agency", "proptech"] },
  { key: "healthcare", label: "Healthcare & Clinics", aliases: ["healthcare", "health care", "clinic", "doctor", "medical", "primary care", "hospital", "physician"] },
  { key: "consulting", label: "Consulting", aliases: ["consulting", "consultancy", "advisory", "strategy firm", "management consulting", "consultant"] },
  { key: "edtech", label: "EdTech & Online Learning", aliases: ["edtech", "education", "online learning", "courses", "school", "tutoring", "learning platform", "elearning"] },
  { key: "hospitality", label: "Hospitality & Hotels", aliases: ["hospitality", "hotel", "hotels", "boutique hotel", "resort", "inn", "lodge", "guesthouse", "bnb"] },
  { key: "automotive", label: "Automotive", aliases: ["automotive", "auto", "car", "cars", "automobile", "ev", "electric vehicle", "auto brand", "car brand"] },
  { key: "legal", label: "Legal & Law", aliases: ["legal", "law", "law firm", "attorney", "lawyer", "legaltech", "legal services"] },
  { key: "gaming", label: "Gaming & Esports", aliases: ["gaming", "video games", "games", "esports", "game studio", "indie games", "mobile gaming"] },
  { key: "music", label: "Music & Audio", aliases: ["music", "audio", "record label", "musician", "band", "streaming music", "podcast network"] },
  { key: "travel", label: "Travel & Tourism", aliases: ["travel", "tourism", "trip", "vacations", "tours", "travel brand", "travel agency"] },
  { key: "jewelry", label: "Jewelry", aliases: ["jewelry", "jewellery", "fine jewelry", "rings", "earrings", "necklace", "diamonds", "jeweler"] },
  { key: "pet-care", label: "Pets & Pet Care", aliases: ["pet", "pets", "pet care", "pet food", "vet", "veterinary", "dog", "cat", "pet brand", "pet grooming"] },
  { key: "kids-baby", label: "Kids & Baby", aliases: ["kids", "baby", "children", "toddler", "babywear", "kidswear", "parenting", "kids brand", "baby brand"] },
  { key: "b2b-services", label: "B2B Services", aliases: ["b2b", "business services", "enterprise services", "professional services", "b2b brand"] },
  { key: "agency", label: "Creative Agency", aliases: ["agency", "creative agency", "branding agency", "design studio", "design agency", "ad agency"] },
  { key: "marketing", label: "Marketing & Growth", aliases: ["marketing", "growth", "performance marketing", "marketing agency", "growth marketing"] },
  { key: "wellness", label: "Wellness", aliases: ["wellness", "holistic", "wellbeing", "mindfulness", "meditation app", "wellness brand"] },
  { key: "spa", label: "Spa & Bodywork", aliases: ["spa", "massage", "bodywork", "day spa", "wellness spa", "thermal"] },
  { key: "home-goods", label: "Home Goods", aliases: ["home goods", "homewares", "kitchenware", "tableware", "candles", "home brand"] },
  { key: "interior-design", label: "Interior Design", aliases: ["interior design", "interiors", "decorator", "interior designer", "home staging"] },
  { key: "architecture", label: "Architecture", aliases: ["architecture", "architectural", "architect", "architecture studio", "design and build"] },
  { key: "photography", label: "Photography", aliases: ["photography", "photographer", "studio", "wedding photography", "commercial photography"] },
  { key: "podcast", label: "Podcasts & Audio Shows", aliases: ["podcast", "podcasts", "show", "audio show", "podcast network"] },
  { key: "newsletter", label: "Newsletters & Independent Media", aliases: ["newsletter", "newsletters", "substack", "independent media", "blog", "writing"] },
  { key: "ngo", label: "Non-Profit & NGO", aliases: ["ngo", "non profit", "nonprofit", "charity", "foundation", "social impact"] },
  { key: "sports", label: "Sports & Athletics", aliases: ["sports", "athletics", "team", "sports brand", "athletic", "athlete"] },
  { key: "cycling", label: "Cycling", aliases: ["cycling", "bike", "bicycle", "cyclist", "bikes", "bike brand", "road bike"] },
  { key: "outdoor", label: "Outdoor & Adventure", aliases: ["outdoor", "outdoors", "adventure", "hiking", "camping", "outdoor brand", "outdoor gear"] },
  { key: "food-delivery", label: "Food Delivery", aliases: ["food delivery", "delivery", "meal delivery", "meal kit", "ghost kitchen"] },
  { key: "grocery", label: "Grocery & Convenience", aliases: ["grocery", "groceries", "supermarket", "corner store", "convenience", "grocer"] },
  { key: "bakery", label: "Bakery", aliases: ["bakery", "bakeries", "baker", "bread", "patisserie", "pastries", "sourdough"] },
  { key: "wine", label: "Wine", aliases: ["wine", "winery", "vineyard", "natural wine", "wine bar", "sommelier"] },
  { key: "brewery", label: "Brewery & Beer", aliases: ["brewery", "beer", "craft beer", "microbrewery", "taproom", "brewing"] },
  { key: "cannabis", label: "Cannabis", aliases: ["cannabis", "weed", "marijuana", "thc", "cbd", "dispensary", "cannabis brand"] },
  { key: "mental-health", label: "Mental Health", aliases: ["mental health", "therapy", "counseling", "therapist", "mental wellness", "mental health app"] },
  { key: "telehealth", label: "Telehealth", aliases: ["telehealth", "telemedicine", "virtual care", "online doctor", "digital health"] },
  { key: "biotech", label: "Biotech & Life Sciences", aliases: ["biotech", "biotechnology", "life sciences", "pharma", "pharmaceutical", "bioscience"] },
  { key: "cybersecurity", label: "Cybersecurity", aliases: ["cybersecurity", "cyber security", "security", "infosec", "security platform", "security software"] },
  { key: "devtools", label: "Developer Tools", aliases: ["devtools", "developer tools", "developer platform", "dev tools", "ci cd", "api platform"] },
  { key: "ai-tools", label: "AI Tools & Products", aliases: ["ai", "artificial intelligence", "ai tool", "ai product", "ai platform", "ml", "machine learning", "llm", "ai startup"] },
  { key: "robotics", label: "Robotics", aliases: ["robotics", "robots", "robot", "automation hardware", "robotic"] },
  { key: "sustainability", label: "Sustainability & Climate", aliases: ["sustainability", "climate", "green", "eco", "clean energy", "climate tech", "carbon"] },
  { key: "dental", label: "Dental & Orthodontic", aliases: ["dental", "dentist", "orthodontic", "dental practice", "dental office", "dental clinic", "orthodontist"] },
  { key: "insurance", label: "Insurance", aliases: ["insurance", "insurer", "broker", "insurtech", "insurance broker", "underwriter"] },
  { key: "logistics", label: "Logistics & Freight", aliases: ["logistics", "freight", "shipping", "last-mile", "supply chain", "carrier", "3pl"] },
  { key: "events", label: "Events & Production", aliases: ["events", "event production", "conference", "wedding planning", "event planning", "event company"] },
  { key: "chocolate", label: "Chocolate", aliases: ["chocolate", "chocolatier", "cacao", "chocolate maker", "bean-to-bar", "fine chocolate"] },
  { key: "dairy", label: "Dairy", aliases: ["dairy", "milk", "cheese", "yogurt", "creamery", "dairy brand", "butter"] },
  { key: "optometry", label: "Optometry & Eye Care", aliases: ["optometry", "optometrist", "eye care", "eyewear", "optical", "vision", "ophthalmology"] },
  { key: "vet", label: "Veterinary Care", aliases: ["vet", "veterinary", "animal hospital", "pet hospital", "vet clinic", "veterinarian", "animal care"] },
  { key: "museum", label: "Museums & Cultural Institutions", aliases: ["museum", "museums", "cultural institution", "gallery", "exhibition", "archives", "heritage"] },
  { key: "watches", label: "Watches & Horology", aliases: ["watches", "watch", "watchmaker", "horology", "timepiece", "watchmaking", "wristwatch"] },
];

export const INDUSTRY_KEYS = INDUSTRIES.map((i) => i.key);

function normalize(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, " ").trim();
}

function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  const dp: number[] = new Array(b.length + 1);
  for (let j = 0; j <= b.length; j++) dp[j] = j;
  for (let i = 1; i <= a.length; i++) {
    let prev = dp[0];
    dp[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = dp[j];
      dp[j] = a[i - 1] === b[j - 1] ? prev : Math.min(prev, dp[j], dp[j - 1]) + 1;
      prev = tmp;
    }
  }
  return dp[b.length];
}

export interface IndustryMatch {
  entry: IndustryEntry;
  confidence: "exact" | "alias" | "fuzzy";
  distance?: number;
}

export function resolveIndustry(input: string): IndustryMatch | null {
  const q = normalize(input);
  if (!q) return null;

  for (const entry of INDUSTRIES) {
    if (entry.key === q || normalize(entry.label) === q) {
      return { entry, confidence: "exact" };
    }
  }

  for (const entry of INDUSTRIES) {
    for (const alias of entry.aliases) {
      if (normalize(alias) === q) {
        return { entry, confidence: "alias" };
      }
    }
  }

  for (const entry of INDUSTRIES) {
    for (const alias of entry.aliases) {
      const a = normalize(alias);
      if (a.includes(q) || q.includes(a)) {
        return { entry, confidence: "alias" };
      }
    }
  }

  let best: { entry: IndustryEntry; distance: number } | null = null;
  for (const entry of INDUSTRIES) {
    const candidates = [entry.key, normalize(entry.label), ...entry.aliases.map(normalize)];
    for (const c of candidates) {
      const d = levenshtein(q, c);
      if (!best || d < best.distance) best = { entry, distance: d };
    }
  }
  if (best && best.distance <= Math.max(3, Math.floor(q.length * 0.4))) {
    return { entry: best.entry, confidence: "fuzzy", distance: best.distance };
  }
  return null;
}
