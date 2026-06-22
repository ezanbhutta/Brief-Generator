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
  { key: "tea", label: "Tea & Tea Houses", aliases: ["tea", "tea house", "tea brand", "tea shop", "tisane", "oolong", "matcha", "loose leaf"] },
  { key: "bookstore", label: "Bookstores & Independent Publishing", aliases: ["bookstore", "bookshop", "independent bookstore", "books", "publishing", "reading room"] },
  { key: "theater", label: "Theater & Performing Arts", aliases: ["theater", "theatre", "performing arts", "drama", "playhouse", "stage", "theater company"] },
  { key: "vinyl", label: "Vinyl & Record Stores", aliases: ["vinyl", "record store", "records", "lp", "music shop", "record shop", "audiophile"] },
  { key: "stationery", label: "Stationery & Paper Goods", aliases: ["stationery", "paper", "pens", "notebooks", "stationery brand", "paper goods", "writing instruments"] },
  { key: "furniture", label: "Furniture", aliases: ["furniture", "chair", "sofa", "table", "furniture brand", "furniture maker"] },
  { key: "shoes", label: "Shoes & Footwear", aliases: ["shoes", "footwear", "sneakers", "boots", "shoemaker", "cobbler", "shoe brand"] },
  { key: "eyewear", label: "Eyewear", aliases: ["eyewear", "glasses", "sunglasses", "spectacles", "frames", "eyewear brand"] },
  { key: "antiques", label: "Antiques", aliases: ["antiques", "antique", "antique dealer", "antique shop", "collectibles", "auction", "estate"] },
  { key: "map", label: "Maps & Cartography", aliases: ["maps", "map", "cartography", "atlas", "mapping", "cartographer"] },
  { key: "agriculture", label: "Agriculture & AgTech", aliases: ["agriculture", "agtech", "farm", "farming", "agronomy", "ag", "crops", "agricultural"] },
  { key: "construction", label: "Construction", aliases: ["construction", "builder", "contractor", "general contractor", "construction services", "building services"] },
  { key: "dance", label: "Dance & Performance", aliases: ["dance", "ballet", "dance studio", "dance company", "choreography", "performance", "dance school"] },
  { key: "flowers", label: "Flowers & Floristry", aliases: ["flowers", "florist", "floristry", "floral", "flower shop", "floral design", "bouquets"] },
  { key: "distillery", label: "Distillery & Spirits", aliases: ["distillery", "spirits", "whiskey", "gin", "vodka", "rum", "distiller", "craft spirits"] },
  { key: "skateboarding", label: "Skateboarding", aliases: ["skateboard", "skateboarding", "skate", "skater", "skateshop", "skate brand"] },
  { key: "tattoo", label: "Tattoo", aliases: ["tattoo", "tattoo studio", "tattoo parlor", "ink", "tattoo artist", "tattoo shop"] },
  { key: "comics", label: "Comics & Graphic Novels", aliases: ["comics", "comic", "graphic novel", "comic book", "manga", "indie comics"] },
  { key: "perfume", label: "Perfume & Fragrance", aliases: ["perfume", "fragrance", "scent", "parfum", "perfumer", "cologne", "eau de parfum"] },
  { key: "plant-shop", label: "Plant Shops & Botanicals", aliases: ["plant shop", "plants", "houseplants", "botanical", "plant store", "foliage", "indoor plants"] },
  { key: "yoga", label: "Yoga & Movement", aliases: ["yoga", "yoga studio", "ashtanga", "hatha", "vinyasa", "yoga school", "movement studio"] },
  { key: "lighting", label: "Lighting & Lamps", aliases: ["lighting", "lamp", "lamps", "light fixture", "lighting design", "sconce", "pendant"] },
  { key: "knife", label: "Knives & Cutlery", aliases: ["knife", "knives", "kitchen knife", "cutlery", "chef knife", "blacksmith", "knife maker"] },
  { key: "soap", label: "Soap & Bathing", aliases: ["soap", "bar soap", "soapmaker", "bath soap", "handmade soap", "savonnerie"] },
  { key: "climbing", label: "Climbing & Mountaineering", aliases: ["climbing", "rock climbing", "mountaineering", "climbing gym", "alpinism", "bouldering"] },
  { key: "surfing", label: "Surfing & Surf Culture", aliases: ["surf", "surfing", "surfboard", "surf shop", "surfwear", "longboard", "shortboard"] },
  { key: "toys", label: "Toys & Games", aliases: ["toys", "toy", "toymaker", "board games", "plush toys", "wooden toys", "kids toys"] },
  { key: "locksmith", label: "Locksmith & Security", aliases: ["locksmith", "lock", "key", "security", "locksmiths", "key cutting", "lock & key"] },
  { key: "magic", label: "Magic & Conjuring", aliases: ["magic", "magician", "conjuring", "magic show", "illusion", "sleight of hand", "magic shop"] },
  { key: "pickling", label: "Pickling & Fermentation", aliases: ["pickle", "pickling", "fermentation", "pickled", "preserves", "kraut", "kimchi"] },
  { key: "woodworking", label: "Woodworking & Joinery", aliases: ["woodworking", "joinery", "carpentry shop", "wood shop", "woodworker", "fine furniture maker"] },
  { key: "knitting", label: "Knitting & Yarn", aliases: ["knitting", "knit", "yarn", "knitwear", "knit shop", "knitting brand", "hand-knit"] },
  { key: "shaving", label: "Shaving & Men's Grooming", aliases: ["shaving", "shave", "razor", "wet shaving", "barber", "men's grooming", "shaving brand"] },
  { key: "printing", label: "Printing & Letterpress", aliases: ["printing", "letterpress", "print shop", "printmaking", "fine printing", "offset", "screen printing"] },
  { key: "carpet", label: "Carpets & Rugs", aliases: ["carpet", "rug", "rugs", "carpet shop", "rug maker", "kilim", "persian rug"] },
  { key: "dermatology", label: "Dermatology & Skin Clinics", aliases: ["dermatology", "dermatologist", "skin clinic", "dermatology practice", "skin doctor"] },
  { key: "candles", label: "Candles & Home Fragrance", aliases: ["candles", "candle", "candlemaker", "scented candles", "soy candle", "home fragrance"] },
  { key: "pottery", label: "Pottery & Ceramics", aliases: ["pottery", "ceramics", "ceramic studio", "potter", "ceramic artist", "stoneware"] },
  { key: "butcher", label: "Butcher & Charcuterie", aliases: ["butcher", "butchery", "butcher shop", "charcuterie", "meat shop", "whole-animal butcher"] },
  { key: "gardening", label: "Gardening & Landscape", aliases: ["gardening", "garden", "landscape", "gardener", "landscape design", "garden design"] },
  { key: "zines", label: "Zines & Indie Publishing", aliases: ["zine", "zines", "indie publishing", "self-publishing", "fanzine", "mini-comic"] },
  { key: "comedy-club", label: "Comedy Clubs & Stand-up", aliases: ["comedy club", "stand-up", "comedy", "comedy venue", "improv", "comedy bar"] },
  { key: "recording-studio", label: "Recording Studios", aliases: ["recording studio", "studio", "audio studio", "mixing", "mastering", "music studio"] },
  { key: "dj", label: "DJ & Electronic Music", aliases: ["dj", "deejay", "electronic music", "mix", "electronic", "dj culture", "turntables"] },
  { key: "courier", label: "Courier & Same-Day Delivery", aliases: ["courier", "same-day delivery", "messenger", "courier service", "last-mile"] },
  { key: "aquarium", label: "Aquariums & Marine Life", aliases: ["aquarium", "marine aquarium", "fish tank", "public aquarium", "aquatic"] },
  { key: "beekeeping", label: "Beekeeping & Honey", aliases: ["beekeeping", "beekeeper", "apiary", "honey", "apiculture", "beehive", "raw honey"] },
  { key: "calligraphy", label: "Calligraphy & Lettering", aliases: ["calligraphy", "calligrapher", "hand lettering", "brush lettering", "scribe", "penmanship"] },
  { key: "picture-framing", label: "Picture Framing & Conservation", aliases: ["picture framing", "framer", "custom framing", "art framing", "frame shop"] },
  { key: "herbalism", label: "Herbalism & Apothecary", aliases: ["herbalism", "herbalist", "apothecary", "herbal medicine", "botanical medicine", "tincture"] },
  { key: "tailor", label: "Tailoring & Bespoke", aliases: ["tailor", "tailoring", "bespoke", "suit maker", "alterations", "custom tailoring"] },
  { key: "bowling", label: "Bowling Alleys & Lanes", aliases: ["bowling", "bowling alley", "lanes", "ten pin", "candlepin"] },
  { key: "kayaking", label: "Kayaking & Paddle Sports", aliases: ["kayak", "kayaking", "paddle", "paddle sports", "canoe", "sea kayak"] },
  { key: "blacksmith", label: "Blacksmithing & Forging", aliases: ["blacksmith", "smithing", "forge", "ironwork", "smithy", "anvil", "blacksmithing"] },
  { key: "fishmonger", label: "Fishmongers & Seafood", aliases: ["fishmonger", "seafood", "fish shop", "fresh fish", "fishmonger shop", "oyster bar"] },
  { key: "massage", label: "Massage Therapy", aliases: ["massage", "massage therapy", "massage therapist", "bodywork", "deep tissue", "swedish massage"] },
  { key: "glamping", label: "Glamping & Luxury Camping", aliases: ["glamping", "luxury camping", "safari tent", "yurt", "eco-resort"] },
  { key: "montessori", label: "Montessori & Alternative Schools", aliases: ["montessori", "alternative school", "waldorf", "reggio", "private school"] },
  { key: "jazz-club", label: "Jazz Clubs & Bars", aliases: ["jazz club", "jazz bar", "jazz", "live jazz", "jazz venue", "supper club"] },
  { key: "falconry", label: "Falconry & Hawking", aliases: ["falconry", "falconer", "hawking", "raptor", "falcon", "bird of prey"] },
  { key: "ice-cream", label: "Ice Cream & Gelato", aliases: ["ice cream", "gelato", "sorbet", "ice cream shop", "soft serve", "frozen yogurt"] },
  { key: "motorcycle", label: "Motorcycles & Moto Culture", aliases: ["motorcycle", "motorbike", "moto", "bike", "cafe racer", "motorcycle brand"] },
  { key: "bookbinding", label: "Bookbinding & Restoration", aliases: ["bookbinding", "bookbinder", "binding", "book restoration", "hand binding"] },
  { key: "hostel", label: "Hostels & Budget Travel", aliases: ["hostel", "hostels", "budget travel", "backpacker", "dormitory", "hostel brand"] },
  { key: "embroidery", label: "Embroidery & Needlework", aliases: ["embroidery", "needlework", "cross-stitch", "embroiderer", "sampler", "hand-stitching"] },
  { key: "hair-salon", label: "Hair Salons & Barbering", aliases: ["hair salon", "salon", "hairdresser", "hair stylist", "barber", "barbershop"] },
  { key: "bbq", label: "BBQ & Smokehouse", aliases: ["bbq", "barbecue", "smokehouse", "smoker", "brisket", "smoked meat", "bbq joint"] },
  { key: "kombucha", label: "Kombucha & Fermented Drinks", aliases: ["kombucha", "fermented drink", "water kefir", "ginger beer", "fermented beverage"] },
  { key: "golf", label: "Golf & Country Clubs", aliases: ["golf", "golf club", "golf course", "country club", "links", "golf brand"] },
  { key: "opera", label: "Opera & Classical Vocal", aliases: ["opera", "opera house", "opera company", "classical voice", "libretto"] },
  { key: "ev-charging", label: "EV Charging Networks", aliases: ["ev", "ev charging", "electric vehicle", "charger", "charging station", "ev infrastructure"] },
  { key: "car-detailing", label: "Car Detailing & Auto Care", aliases: ["car detailing", "detailing", "auto detail", "car wash", "ceramic coating", "paint protection"] },
  { key: "gutter-cleaning", label: "Gutter Cleaning & Roof", aliases: ["gutter cleaning", "gutters", "roof cleaning", "downspout", "gutter service"] },
  { key: "chimney-sweep", label: "Chimney Sweeps & Fireplace", aliases: ["chimney sweep", "chimney", "fireplace", "hearth", "chimney cleaning"] },
  { key: "painter", label: "Residential Painters", aliases: ["painter", "painting", "house painter", "painting contractor", "residential painting"] },
  { key: "meditation", label: "Meditation Studios & Apps", aliases: ["meditation", "meditation studio", "mindfulness", "zen", "vipassana", "meditation app"] },
  { key: "naturopath", label: "Naturopathy & Functional Medicine", aliases: ["naturopath", "naturopathy", "functional medicine", "integrative medicine"] },
  { key: "breathwork", label: "Breathwork & Pranayama", aliases: ["breathwork", "breath", "pranayama", "wim hof", "holotropic", "breathing practice"] },
  { key: "sleep-clinic", label: "Sleep Clinics & Insomnia", aliases: ["sleep clinic", "sleep", "insomnia", "sleep specialist", "sleep study", "sleep medicine"] },
  { key: "hat-maker", label: "Hat Makers & Milliners", aliases: ["hat", "hats", "hatmaker", "milliner", "hat shop", "headwear"] },
  { key: "cheese-shop", label: "Cheese Shops & Mongers", aliases: ["cheese shop", "cheesemonger", "cheese", "fromagerie", "affineur", "cheese counter"] },
  { key: "sausage-maker", label: "Charcuterie & Sausage", aliases: ["sausage", "sausage maker", "charcuterie", "salumi", "salami", "wurst", "cured meats"] },
  { key: "vegan-cafe", label: "Vegan & Plant-Based Cafés", aliases: ["vegan", "vegan cafe", "plant-based", "vegan restaurant", "vegetarian"] },
  { key: "sparkling-water", label: "Sparkling Water", aliases: ["sparkling water", "seltzer", "soda water", "carbonated water", "mineral water"] },
  { key: "smoothie", label: "Smoothies & Juice Bars", aliases: ["smoothie", "juice bar", "cold-pressed juice", "smoothie bar", "juicery"] },
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
