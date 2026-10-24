export type WorkCategory = "Campaign" | "Social" | "Packaging" | "Web" | "Print" | "Exhibition" | "Strategy";
export type WorkImage = { src: string; w: number; h: number; caption: string; alt: string };
export type Work = {
  slug: string;
  client: string;
  title: string;
  category: WorkCategory;
  format: string;
  summary: string;
  description: string;
  deliverables: string[];
  credit?: string;
  size: "lg" | "md" | "wide" | "sm";
  cover: { layout: "fill" | "fan" | "pair" | "stack"; pick: number[]; tone: string; fit?: "contain" };
  images: WorkImage[];
};

const shot = (slug: string, n: number, w: number, h: number, caption: string, alt: string): WorkImage => ({ src: `/images/work/${slug}/${String(n).padStart(2, "0")}.jpg`, w, h, caption, alt });

export const workCategories: WorkCategory[] = ["Campaign", "Social", "Packaging", "Web", "Print", "Exhibition", "Strategy"];

export const works: Work[] = [
  {
    slug: "flipkart-minutes",
    client: "Flipkart Minutes",
    title: "Regional launch creatives",
    category: "Campaign",
    format: "813 × 813 mm",
    summary: "A first-order offer carried into stores in three languages.",
    description: "Campaign creatives for Flipkart Minutes' first-order offer: ₹100 off orders above ₹299. A 32-inch in-store creative and a scan-to-order standee, each adapted into Tamil, Malayalam and Telugu so the offer reads naturally in every region.",
    deliverables: ["32-inch in-store creative", "Scan-to-order standee", "Tamil, Malayalam & Telugu adaptations"],
    size: "lg",
    cover: { layout: "pair", pick: [0, 3], tone: "#2a080d" },
    images: [
      shot("flipkart-minutes", 1, 2000, 2000, "32-inch creative · Tamil", "Flipkart Minutes 32-inch in-store creative in Tamil offering ₹100 off a first order above ₹299, over a flat-lay of drinks, snacks and skincare"),
      shot("flipkart-minutes", 2, 2000, 2000, "32-inch creative · Malayalam", "The ₹100-off in-store creative adapted into Malayalam"),
      shot("flipkart-minutes", 3, 2000, 2000, "32-inch creative · Telugu", "The ₹100-off in-store creative adapted into Telugu"),
      shot("flipkart-minutes", 4, 938, 2000, "Standee back · Tamil", "Red Flipkart Minutes standee in Tamil with a scan-to-order QR code, zero-fee badges and an SBI debit card offer"),
      shot("flipkart-minutes", 5, 938, 2000, "Standee back · Malayalam", "The scan-to-order standee adapted into Malayalam"),
      shot("flipkart-minutes", 6, 938, 2000, "Standee back · Telugu", "The scan-to-order standee adapted into Telugu"),
    ],
  },
  {
    slug: "sehat-social",
    client: "Sehat Skin & Hair Clinic",
    title: "Treatment explainers for social",
    category: "Social",
    format: "1080 × 1350",
    summary: "Clinical treatments explained in a calm, consistent visual voice.",
    description: "Instagram posts and carousel covers for Sehat: treatment explainers for microneedling, GFC, skinboosters, Kizhi, Natool therapy and face cupping, plus heritage stories like '1947: care was a ritual'. Each one names the problem a patient feels, answers it with clear callouts and closes on a single booking CTA.",
    deliverables: ["Static posts", "Carousel covers", "Myth-vs-fact formats", "Booking CTAs"],
    size: "md",
    cover: { layout: "fan", pick: [6, 8, 0], tone: "#0d2524" },
    images: [
      shot("sehat-social", 1, 1206, 1505, "Benefits of microneedling", "Sehat post on the benefits of microneedling with callouts around a treatment close-up"),
      shot("sehat-social", 2, 1206, 1499, "Natool therapy · Carousel cover", "Dark carousel cover for Natool, a Unani therapy, asking about stress, sleep and brain fog"),
      shot("sehat-social", 3, 1206, 1487, "GFC hair density · Myth vs fact", "Myth-versus-fact post explaining GFC hair treatment"),
      shot("sehat-social", 4, 1206, 1490, "GFC for facial rejuvenation", "Post listing the benefits of GFC therapy for the face"),
      shot("sehat-social", 5, 1206, 1503, "Kizhi therapy", "Kizhi therapy post showing who can benefit, on a warm dark background"),
      shot("sehat-social", 6, 1206, 1493, "Who can use skinboosters", "Skinboosters post with callouts on a close-up of skin"),
      shot("sehat-social", 7, 1206, 1497, "3 reasons to choose face cupping", "Carousel cover titled 3 reasons to choose face cupping"),
      shot("sehat-social", 8, 1206, 1503, "Why choose microneedling", "Microneedling post with benefit callouts around a portrait"),
      shot("sehat-social", 9, 1080, 1350, "1947 · Care was a ritual", "Sehat heritage post: a woman in a cream sari oiling her hair in warm window light, headline 1947, care was a ritual"),
    ],
  },
  {
    slug: "dr-talats-ads",
    client: "Dr Talat's",
    title: "Product ad creatives",
    category: "Social",
    format: "1080 × 1350",
    summary: "One clear benefit per ad, with the product as the hero.",
    description: "Social ads for three Dr Talat's products: Immune Pro-Vit, the Neem & Tulsi face wash and Kashmir honey. Each ad leads with one benefit people can feel (energy, clear skin, pure ingredients) and builds the whole frame around the product.",
    deliverables: ["Social ad creatives", "Product compositing", "Headlines"],
    size: "md",
    cover: { layout: "fan", pick: [1, 0, 2], tone: "#1d2a1b" },
    images: [
      shot("dr-talats-ads", 1, 1170, 1507, "Immune Pro-Vit · From drained to driven", "Dr Talat's Immune Pro-Vit ad: a tired runner and a sprinting runner on a track, headline From drained to driven, immunity that keeps you going"),
      shot("dr-talats-ads", 2, 1206, 1506, "Neem & Tulsi face wash · Breakouts", "Ad for the Dr Talat's Neem and Tulsi face wash among fresh leaves, headline Breakouts don't stand a chance"),
      shot("dr-talats-ads", 3, 1206, 1499, "Kashmir honey · Benefits", "Dr Talat's Kashmir honey jar with callouts for antioxidants, natural energy and digestion, headline Benefits of Kashmir honey"),
    ],
  },
  {
    slug: "drtalats-web",
    client: "Dr Talat's",
    title: "drtalats.com website creatives",
    category: "Web",
    format: "Website banners & page visuals",
    summary: "Homepage, philosophy page and product banners for the new drtalats.com.",
    description: "Creatives for the new drtalats.com: a homepage hero built around the full product range, an 'Our philosophy' banner and page image, a 'How we compare' chart against generic brands and DIY remedies, and banners for Talbina, the Immune range and Hijama cupping.",
    deliverables: ["Homepage hero", "Philosophy page visuals", "Comparison chart", "Product & treatment banners"],
    size: "wide",
    cover: { layout: "fill", pick: [0], tone: "#f6e8cf" },
    images: [
      shot("drtalats-web", 1, 2000, 1255, "Homepage hero · Authentic remedies, timeless benefits", "Dr Talat's homepage hero: Authentic remedies, timeless benefits, with the product range on a podium among fresh fruit and herbs"),
      shot("drtalats-web", 2, 1406, 1156, "Our philosophy · Homepage banner", "Our philosophy banner: a hand holding a bottle of Nannari sharbat among lemon slices, with Unani based, superior quality and doctor approved icons"),
      shot("drtalats-web", 3, 1841, 2000, "Our philosophy · Page image", "A stone mortar and pestle with saffron and a red hibiscus flower beside glass lab beakers"),
      shot("drtalats-web", 4, 2000, 796, "How we compare", "Comparison chart: Dr Talat's Unani formulas against generic brands and DIY remedies on holistic healing, doctor testing, personalisation, proven ingredients and purity"),
      shot("drtalats-web", 5, 2000, 689, "Talbina · Nourish your heart, naturally", "Dr Talat's Talbina website banner: Nourish your heart, naturally, with 20% off using code WELCOME20"),
      shot("drtalats-web", 6, 2000, 689, "Immune range · When the season changes", "Dr Talat's Immune range banner among autumn leaves: when the season changes, your defense shouldn't, 20% off"),
      shot("drtalats-web", 7, 1920, 900, "Hijama cupping · Treatment banner", "Hijama cupping banner: a regimental therapy that helps detoxify the body and restore balance, starting from ₹100"),
    ],
  },
  {
    slug: "woocommerce",
    client: "Dr Talat's",
    title: "WooCommerce AI product visuals",
    category: "Web",
    format: "Store banners · 2.9 : 1",
    summary: "AI product visuals that let a whole store launch without a photoshoot.",
    description: "Product banners and store visuals for the Dr Talat's WooCommerce store, generated with AI and finished by hand, so the full range went live without a traditional product photoshoot. Each banner pairs one product with one promise and a clear offer, from Nannari sharbat and Hyzin hair oil to the gel range and Kashmir honey. Shown with the live drtalats.com store and the sehatclinic.com site.",
    deliverables: ["AI product visuals", "Store banners", "Offers & CTAs", "Live store"],
    size: "wide",
    cover: { layout: "stack", pick: [2, 3], tone: "#2a1712" },
    images: [
      shot("woocommerce", 1, 2000, 1115, "drtalats.com · Live store", "drtalats.com homepage: Back in stock, your favourite 5-in-1 shampoo is back, under the store menu"),
      shot("woocommerce", 2, 2000, 1112, "sehatclinic.com · Clinic site", "sehatclinic.com homepage: Best skin and hair care clinic in Chennai, with a flat 10% off treatments banner"),
      shot("woocommerce", 3, 2000, 690, "Nannari sharbat · Flat 20% off", "Nannari sharbat bottle beside an iced glass and dried roots: Cool your body, refresh your soul, flat 20% off"),
      shot("woocommerce", 4, 2000, 690, "Hyzin hair oil · Revive your hair naturally", "Hyzin hair oil bottle with almonds and a dropper: Revive your hair naturally, now at 20% off"),
      shot("woocommerce", 5, 1450, 500, "Gold face wash · Glow Gold or Glow Home", "Gold face wash tube on a sandstone ledge: Glow Gold or Glow Home, zero sulphates, all shine"),
      shot("woocommerce", 6, 1450, 500, "Gel range · Breakouts? Burnout?", "Aloecu gel, Neem and Tulsi face wash and Skinglo gel on mossy stones: Breakouts? Burnout? We've got gel for that"),
      shot("woocommerce", 7, 1450, 500, "Saffron honey gel · Skincare once reserved for royalty", "Saffron honey gel jar with saffron strands: skincare once reserved for royalty, add luxury to your ritual"),
      shot("woocommerce", 8, 1450, 500, "Honey range · This is what power tastes like", "Three Dr Talat's honey jars on a wooden table with a cup of tea: This is what power tastes like"),
    ],
  },
  {
    slug: "drtalats-launches",
    client: "Dr Talat's",
    title: "Talbina & 5-in-1 shampoo launch",
    category: "Campaign",
    format: "1500 × 1500 · web banners",
    summary: "Two launches told through their ingredients.",
    description: "Launch creatives for Talbina, a Sunnah breakfast of slow-cooked barley, and the 5-in-1 shampoo. Each launch leads with the ingredients and the numbers that matter (11.8 g protein and 0 g added sugar for Talbina; 8% henna, 5% amla and 6% hibiscus for the shampoo), finished with web banners and a 'from a Unani doctor's pharmacy' story.",
    deliverables: ["Product hero visuals", "Ingredient breakdowns", "Web banners"],
    size: "wide",
    cover: { layout: "pair", pick: [0, 3], tone: "#3b2416" },
    images: [
      shot("drtalats-launches", 1, 1500, 1500, "Talbina · Barley, slow-cooked into comfort", "Talbina tub beside a bowl of barley porridge with dates and nuts: 11.8 g protein per 100 g, 0 g added sugar, 5 whole ingredients"),
      shot("drtalats-launches", 2, 1500, 1500, "Talbina · Five ingredients, nothing else", "Barley, almonds, cashews, pistachios and dates laid out in a row under the line Five ingredients. Nothing else."),
      shot("drtalats-launches", 3, 1464, 600, "Talbina · Web banner", "Talbina web banner: A Sunnah breakfast, slow-cooked into comfort"),
      shot("drtalats-launches", 4, 1500, 1500, "5-in-1 shampoo · Henna, amla and hibiscus in one wash", "Dr Talat's 5-in-1 shampoo bottle with coconut, hibiscus and aloe: 8% henna extract, 6% hibiscus extract, 180 ml"),
      shot("drtalats-launches", 5, 1500, 1500, "5-in-1 shampoo · The formula, in percentages", "Ingredient layout: henna 8%, amla 5%, hibiscus 6%, coconut water 8% and aloe vera, each with its benefit"),
      shot("drtalats-launches", 6, 1464, 600, "From a Unani doctor's pharmacy", "Dark brown banner with apothecary jars: From a Unani doctor's pharmacy, doctor-formulated, GMP-certified, licensed Unani"),
    ],
  },
  {
    slug: "ayush-2026",
    client: "Dr Talat's",
    title: "Ayush 2026 exhibition stall",
    category: "Exhibition",
    format: "5 × 2 m stall",
    summary: "Brand graphics for a herbal-wellness stall at Ayush 2026.",
    description: "Stall branding for Dr Talat's at Ayush 2026. The 5 × 2 m booth leads with '30+ years of expertise in herbal wellness' and '250+ licensed products', backed by #healingfromwithin and #unaniwellness side panels and a branded counter.",
    deliverables: ["Backdrop wall graphics", "Side panels", "Counter branding"],
    credit: "3D visualisation by Regal Exhibitions (R.T.S)",
    size: "wide",
    cover: { layout: "fill", pick: [0], tone: "#575757" },
    images: [
      shot("ayush-2026", 1, 2000, 1414, "Front view", "3D render of the Dr Talat's stall front with a backdrop reading 30+ years of expertise in herbal wellness"),
      shot("ayush-2026", 2, 2000, 1414, "Three-quarter view", "Angled view of the stall with product shelves and the side panel"),
      shot("ayush-2026", 3, 2000, 1414, "Side view", "The stall seen from the other side, with display shelving and seating"),
      shot("ayush-2026", 4, 2000, 1414, "Elevations · 5 × 2 × 3.5 m", "Front, left and right elevations of the 5 by 2 metre stall, 3.5 metres high"),
      shot("ayush-2026", 5, 2000, 1414, "Top plan", "Top-down plan of the stall layout"),
    ],
  },
  {
    slug: "reels-thumbnails",
    client: "Dr Talat's + creators",
    title: "Reels & Shorts thumbnails",
    category: "Social",
    format: "1080 × 1920",
    summary: "A cover system built to stop the scroll on doctor-led video.",
    description: "Vertical covers for Reels and YouTube Shorts. A repeatable system (a question as the hook, the doctor as the anchor, one hot accent colour) keeps an ongoing video series recognisable at thumbnail size.",
    deliverables: ["Reels covers", "Shorts thumbnails", "Hook typography", "Repeatable layout system"],
    size: "sm",
    cover: { layout: "fan", pick: [4, 0, 5], tone: "#0b2122" },
    images: [
      shot("thumbnails", 1, 720, 1280, "Do you know the secret?", "Thumbnail with Dr Talat and the headline Do you know the secret?"),
      shot("thumbnails", 2, 720, 1280, "Don't brush it off as 'just dandruff'", "Thumbnail about dandruff featuring Dr Talat"),
      shot("thumbnails", 3, 720, 1280, "What is summer doing to your skin?", "Thumbnail asking what summer is really doing to your skin"),
      shot("thumbnails", 4, 720, 1280, "3 oils, shampoo changed, still no results?", "Thumbnail with a large orange 3 asking about oils and shampoo with no results"),
      shot("thumbnails", 5, 720, 1280, "The scalp reset", "Scalp treatment thumbnail titled The scalp reset"),
      shot("thumbnails", 6, 720, 1280, "Your hair deserves more", "Aroma hair therapy thumbnail: your hair deserves more than just oil and shampoo"),
      shot("thumbnails", 7, 720, 1280, "Pimple gone, will it be back?", "Thumbnail asking whether a pimple will be back in a few days"),
      shot("thumbnails", 8, 720, 1280, "Dandruff · Alternate layout", "Alternate layout of the dandruff thumbnail"),
      shot("thumbnails", 9, 720, 1280, "The greatest swimmer ever?", "Podcast-style thumbnail: the greatest swimmer ever? 23 Olympic golds!"),
    ],
  },
  {
    slug: "run-your-rhythm",
    client: "Dr Talat's",
    title: "Run Your Rhythm merch kit",
    category: "Packaging",
    format: "Tote, pouches, bottles, cards",
    summary: "A wellness merch kit built around one line.",
    description: "Merchandise built around one line, Run Your Rhythm: a canvas tote with a scan-to-shop QR code, translucent Rhythm pouches, Skin Fuel bottles and thank-you cards that carry the brand promise, Wellness. Energy. You.",
    deliverables: ["Tote bag", "Pouches", "Bottle labels", "Thank-you cards"],
    size: "sm",
    cover: { layout: "fill", pick: [0], tone: "#e9e6e1" },
    images: [
      shot("run-your-rhythm", 1, 1678, 1117, "The kit · Tote, pouches, bottle and cap", "Dr Talat's merch flat-lay: canvas tote, juice bottle, cap and zip pouches"),
      shot("run-your-rhythm", 2, 1080, 1350, "Tote bag · Scan-to-shop QR", "Person carrying a canvas tote printed with the brand line and a QR code"),
      shot("run-your-rhythm", 3, 895, 1107, "Rhythm pouches", "Four translucent zip pouches in grey, yellow, pink and lilac printed with Rhythm"),
      shot("run-your-rhythm", 4, 1119, 1114, "Skin Fuel bottles", "Row of clear Skin Fuel bottles with black caps, one filled with amber juice"),
      shot("run-your-rhythm", 5, 1290, 1291, "Thank-you cards · Wellness. Energy. You.", "Dr Talat's thank-you cards and arch-shaped inserts reading Feel the vitality, feel the balance"),
    ],
  },
  {
    slug: "sehat-promotions",
    client: "Sehat Skin & Hair Clinic",
    title: "Treatment promotions",
    category: "Campaign",
    format: "24 × 36 in poster · web banners",
    summary: "A GFC hair-regrowth poster and treatment offer banners.",
    description: "Promotions for Sehat's treatments: a 24 × 36 inch clinic poster for GFC hair regrowth therapy that explains what GFC does in four steps and promises results in 5–6 sessions, plus offer banners for Dhara de-stress therapy and skin and hair care.",
    deliverables: ["Clinic poster", "Offer banners"],
    size: "sm",
    cover: { layout: "fill", pick: [0], tone: "#f4ede6", fit: "contain" },
    images: [
      shot("sehat-promotions", 1, 1600, 2400, "GFC therapy · Regrow your hair naturally", "Sehat poster: Regrow your hair naturally with GFC therapy, with what GFC can do and results in 5 to 6 sessions"),
      shot("sehat-promotions", 2, 1000, 672, "De-stress Dhara therapy · 10% off", "Clinic offer banner: overworked mind, exhausted body? De-stress treatment and steam with Dhara therapy, 10% off premium treatments"),
      shot("sehat-promotions", 3, 1000, 672, "Skin & hair care · Flat 10% off", "Clinic offer banner: revitalise your skin and hair with expert care, flat 10% off premium treatments"),
    ],
  },
  {
    slug: "drtalats-print",
    client: "Dr Talat's",
    title: "Flyer & clinic standee",
    category: "Print",
    format: "A5 flyer · standee",
    summary: "An A5 flyer for the new look and a standee for Dr Talat Salim.",
    description: "Print for Dr Talat's: an A5 flyer announcing the new look, 200+ licensed products and the brand story, with the full product list on the back, plus a clinic standee introducing Dr Talat Salim, Unani cosmetic physician and Hijama specialist, at Ali Medical Center.",
    deliverables: ["A5 flyer", "Product list", "Clinic standee"],
    size: "sm",
    cover: { layout: "pair", pick: [0, 3], tone: "#efe4d6" },
    images: [
      shot("drtalats-print", 1, 1410, 2000, "A5 flyer · Front", "Flyer front: 20+ years of expertise in herbal wellness, the new look, 200+ licensed products, with the product range and a QR code to drtalats.com"),
      shot("drtalats-print", 2, 1410, 2000, "A5 flyer · About us", "Flyer page: Modern living, natural wellness, with honey jars, about us, our promise and a return to rhythm"),
      shot("drtalats-print", 3, 1410, 2000, "A5 flyer · Product list", "The full Dr Talat's product list arranged in columns by category"),
      shot("drtalats-print", 4, 960, 2400, "Clinic standee · Ali Medical Center", "Clinic standee: Struggling with hair and skin issues? Advanced Unani solutions from Dr Talat Salim, with the conditions she treats"),
    ],
  },
  {
    slug: "rzu",
    client: "RZU",
    title: "Brand identity & carton",
    category: "Packaging",
    format: "Identity + carton dieline",
    summary: "A monogram identity and a skincare carton in two colourways.",
    description: "Identity and packaging for RZU (Real · Zeal · Unfiltered): a stacked monogram that holds up on a canvas tote, and a Skinglow cream carton in two colourways with every ingredient, direction and regulatory line placed on the dieline.",
    deliverables: ["Monogram & identity", "Carton dieline", "Two colourways", "Merchandise"],
    size: "sm",
    cover: { layout: "fill", pick: [0], tone: "#ece6dc" },
    images: [
      shot("rzu", 1, 1122, 1402, "Identity · Monogram on a tote", "Canvas tote bag hanging on a wall, printed with the RZU monogram and the line Real, Zeal, Unfiltered"),
      shot("rzu", 2, 1240, 882, "Skinglow carton · Pink and orange", "Flat Skinglow cream carton dieline in the pink and orange colourway"),
      shot("rzu", 3, 1240, 882, "Skinglow carton · Blue and yellow", "Flat Skinglow cream carton dieline in the blue and yellow colourway"),
    ],
  },
  {
    slug: "fog-lamps",
    client: "Hiways · Gear X Global",
    title: "Fog lamp packaging",
    category: "Packaging",
    format: "Retail box + key visual",
    summary: "Two retail boxes for dual laser LED fog lights.",
    description: "Retail packaging for two dual laser LED fog projector lights: a moody night-drive key visual for Hiways, and a clean, feature-led box for Gear X Global where every spec becomes an icon.",
    deliverables: ["Retail box design", "Feature icon set", "Key visual"],
    size: "sm",
    cover: { layout: "pair", pick: [0, 1], tone: "#0e1a1d" },
    images: [
      shot("fog-lamps", 1, 1122, 1402, "Hiways · Night-drive key visual", "Hiways fog projector light box in front of an SUV with its fog lights on, in a misty tunnel"),
      shot("fog-lamps", 2, 1121, 1403, "Gear X Global · Feature-led box", "White Gear X Global dual laser LED fog projector light box with orange feature icons and specs such as 120 W and 30,000 hours"),
    ],
  },
  {
    slug: "sehat-calendar",
    client: "Sehat Skin & Hair Clinic",
    title: "Instagram content calendar",
    category: "Strategy",
    format: "Oct 2026 · 10 pages",
    summary: "A month of Instagram, planned post by post.",
    description: "October 2026 planned end to end: 15 feed posts made of 5 static posters, 3 carousels and 7 Reels. Statics and carousels build trust first, Reels take over after Oct 15 and Stories run on top, with post concepts, captions, hashtag sets and a two-session batch shoot plan.",
    deliverables: ["Monthly content plan", "Post concepts & CTAs", "Captions & hashtag sets", "Batch production plan"],
    size: "wide",
    cover: { layout: "fill", pick: [0], tone: "#141414" },
    images: [
      shot("sehat-calendar", 1, 2000, 1415, "Cover · The month in numbers", "Cover of the Sehat October 2026 Instagram content calendar: 15 feed posts, 5 static posters, 3 carousels and 7 Reels"),
      shot("sehat-calendar", 2, 2000, 1415, "Four rules the calendar runs on", "Page listing the four rules of the calendar and the month's posting rhythm"),
      shot("sehat-calendar", 3, 2000, 1415, "October at a glance", "Month grid showing which post goes out on which day"),
      shot("sehat-calendar", 4, 2000, 1415, "Post details · Oct 1–5", "Post concepts and calls to action for October 1 to 5"),
      shot("sehat-calendar", 5, 2000, 1415, "Post details · Oct 7–13", "Post concepts and calls to action for October 7 to 13"),
      shot("sehat-calendar", 6, 2000, 1415, "Post details · Oct 15–21", "Post concepts and calls to action for October 15 to 21"),
      shot("sehat-calendar", 7, 2000, 1415, "Post details · Oct 23–30", "Post concepts and calls to action for October 23 to 30"),
      shot("sehat-calendar", 8, 2000, 1415, "The Stories layer", "Plan for Instagram Stories running alongside the feed"),
      shot("sehat-calendar", 9, 2000, 1415, "Captions & hashtags", "Caption formula and hashtag sets"),
      shot("sehat-calendar", 10, 2000, 1415, "Batch production & measuring", "Two-session batch shoot plan and the metrics to watch"),
    ],
  },
  {
    slug: "alkaline-water",
    client: "TBC Sky Lounge · Fusion Mont",
    title: "Premium water labels",
    category: "Packaging",
    format: "750 ml bottle label",
    summary: "Two alkaline water labels and the launch visuals around them.",
    description: "Labels and launch visuals for two premium alkaline waters: a tropical, record-sleeve label for TBC Sky Lounge and a clean, type-led B12 range for Fusion Mont Cool Waters.",
    deliverables: ["Bottle labels", "Launch creatives", "Product mock-ups"],
    size: "wide",
    cover: { layout: "fill", pick: [1], tone: "#f2c6b6" },
    images: [
      shot("alkaline-water", 1, 1206, 788, "TBC Sky Lounge · Tropical Vibes", "TBC Sky Lounge alkaline water bottles among tropical leaves with the words Tropical Vibes"),
      shot("alkaline-water", 2, 1206, 793, "Fusion Mont · Hydrate. Rejuvenate. Thrive.", "Fusion Mont alkaline water bottles over large red type reading Hydrate Rejuvenate Thrive"),
    ],
  },
  {
    slug: "sippit",
    client: "Sippit",
    title: "Juice bottle packaging",
    category: "Packaging",
    format: "Bottle label system",
    summary: "Flavour-coded labels for a fresh-juice range.",
    description: "Bottle labels for Sippit's juice range. Each flavour gets its own fruit-led colour and splash on a shared layout, finished with a playful 'Bliss in Every Sip!' line and the brand's logo lockups.",
    deliverables: ["Bottle labels", "Flavour colour system", "Lifestyle mock-ups"],
    size: "sm",
    cover: { layout: "pair", pick: [0, 1], tone: "#d9531e" },
    images: [
      shot("sippit", 1, 1074, 1600, "Lychee", "Hand holding a Sippit Lychee juice bottle, with the Sippit logo on white and on orange"),
      shot("sippit", 2, 1054, 1600, "Blueberry", "Hand holding a Sippit Blueberry juice bottle with the Sippit logo lockups"),
    ],
  },
  {
    slug: "masala-cookies",
    client: "Fasta Pizza",
    title: "Masala cookies pouch",
    category: "Packaging",
    format: "100 g stand-up pouch",
    summary: "A warm, snackable pouch with the cookie front and centre.",
    description: "A stand-up pouch for Fasta Pizza's masala cookies: deep maroon, a bold orange product name and an oversized cookie up front, with spicy, buttery and crunchy called out at a glance.",
    deliverables: ["Pouch design", "Product mock-up"],
    size: "sm",
    cover: { layout: "fill", pick: [0], tone: "#5a1d1a" },
    images: [shot("masala-cookies", 1, 1124, 1399, "Masala cookies · 100 g pouch", "Maroon stand-up pouch for Fasta Pizza masala cookies, spicy, buttery and crunchy, 100 g, with a large cookie on the front")],
  },
  {
    slug: "neem-aura",
    client: "Mahira's",
    title: "Neem Aura soap carton",
    category: "Packaging",
    format: "70 g soap carton",
    summary: "A botanical carton for a neem and holy basil soap.",
    description: "A carton for Mahira's Neem Aura soap: fresh greens, fine botanical line art and a bold product name, with the neem and holy basil leaves doing the talking.",
    deliverables: ["Carton design", "Product mock-up"],
    size: "sm",
    cover: { layout: "fill", pick: [0], tone: "#d8cbb5" },
    images: [shot("neem-aura", 1, 2000, 1333, "Neem Aura · Carton and bar", "Green Neem Aura soap bar beside its white carton printed with neem and holy basil leaves, on a wooden tray")],
  },
];

/* Short-form video: full reels load only in the player; cards loop a 6-second muted preview. */
export type Reel = { n: string; client: string; title: string; kind: string; duration: string; src: string; preview: string; poster: string };
const reel = (n: number, client: string, title: string, kind: string, duration: string): Reel => {
  const id = String(n).padStart(2, "0");
  return { n: id, client, title, kind, duration, src: `/videos/short-form/${id}.mp4`, preview: `/videos/short-form/${id}-preview.mp4`, poster: `/images/work/short-form/${id}.jpg` };
};

export const reels: Reel[] = [
  reel(7, "Dr Talat's", "Website launch teaser · Dubai", "Launch teaser", "0:08"),
  reel(1, "Sehat", "How cupping therapy works", "Animated explainer", "0:11"),
  reel(2, "Dr Talat's", "Arq-e-Ajeeb product reel", "Product reel", "0:33"),
  reel(3, "Dr Talat's", "Hair care with Dr Talat Salim", "Doctor-led reel", "1:13"),
  reel(4, "Sehat", "Hijama therapy: a patient story", "Testimonial", "0:25"),
  reel(5, "Design tips", "Skip Pinterest: try Behance and Dribbble", "Creator reel", "0:41"),
  reel(6, "Sehat", "A patient's treatment story", "Testimonial", "1:41"),
];

export const caseStudies = [
  { slug: "ev-charge-finder", href: "/work/ev-charge-finder" },
  { slug: "fitness-app-study", href: "/work/fitness-app-study" },
];

export const roles = [
  {
    period: "Nov 2024 — Present",
    title: "Brand Designer / Graphic Designer",
    company: "Dr Talat's",
    place: "Dubai & Chennai clinics",
    summary: "Lead end-to-end creative for Dr Talat's Dubai Clinic, Chennai Clinic and brand: branding, promotions, banner and print creatives, packaging and label design, social media, UGC content, product shoots and digital experiences.",
    points: ["Creative strategies, campaign concepts, copy and shoot scripts", "Directing productions for one visual voice online and offline", "Website and blog creatives, with AI tools speeding up ideation and production"],
    tags: ["Branding", "Packaging & labels", "Social & UGC", "Product shoots", "AI production"],
  },
  {
    period: "Jul 2023 — Oct 2024",
    title: "Branding / Advertising Designer",
    company: "Edge Studios",
    place: "",
    summary: "Led branding and advertising design for premium clients including Beam Suntory, Courtyard by Marriott, Pind Restaurant, JP Hotels and healthcare brands.",
    points: ["Campaign visuals, brand collateral, promotional materials, signage and print, from concept to execution", "Managed client requirements and coordinated with print vendors", "Kept visual quality consistent across advertising and physical touchpoints"],
    tags: ["Advertising", "Brand collateral", "Signage", "Print production"],
  },
  {
    period: "1 year",
    title: "Jr. Agency Graphic Designer",
    company: "INFWO Social Media",
    place: "Social media agency",
    summary: "Produced social media posts, ads, stories and banners for multiple clients at once, adapting layouts, content and visual direction to each brand's guidelines while delivering high-volume work under tight deadlines.",
    points: [],
    tags: ["Social posts", "Ads", "Stories", "Banners"],
  },
];

export const brands = ["Dr Talat's", "Sehat Skin & Hair Clinic", "Beam Suntory", "Courtyard by Marriott", "Pind Restaurant", "JP Hotels", "Flipkart Minutes", "Sippit", "Fusion Mont", "TBC Sky Lounge", "RZU", "Hiways", "Gear X Global", "Fasta Pizza", "Mahira's"];

export const education = [
  { title: "BBA", school: "Vels University", kind: "Degree" },
  { title: "UI/UX Design", school: "Aspira UI UX Design Institute", kind: "6-month programme" },
  { title: "Graphic Designing", school: "Apollo Computer Education", kind: "Course" },
  { title: "Diploma in Computer Applications", school: "NSDL", kind: "Diploma" },
  { title: "12th Standard", school: "B.O.S.S.E", kind: "School" },
];

export const certifications = ["UI/UX Design", "Graphic Design", "Computer Applications"];

export const skillGroups = [
  { title: "Brand & visual", text: "Identities, layouts and print-ready artwork.", items: ["Brand design", "Brand identity", "Brand strategy", "Visual design", "Typography", "Layout & hierarchy", "Print production", "Presentation design"] },
  { title: "Content & creative", text: "Ideas, scripts and shoots for social and campaigns.", items: ["Creative direction", "Content strategy", "Content ideas", "Content writing for shoots", "Scripting", "Social media", "AI creative production"] },
  { title: "UX / UI", text: "Research-led product design, from interviews to prototype.", items: ["User research", "Personas", "Competitor analysis", "Information architecture", "Prototyping", "Usability testing"] },
];

/* Neon cubes are the client's renders; a tool without `cube` falls back to the code-built cube. */
export type Tool = { abbr: string; name: string; maker: string; use: string; color: string; cube?: string };

export const tools: Tool[] = [
  { abbr: "Fg", name: "Figma", maker: "Figma", use: "Interface design, wireframes and clickable prototypes", color: "#a259ff", cube: "/images/tools/figma.png" },
  { abbr: "FJ", name: "FigJam", maker: "Figma", use: "User flows, journey maps and research boards", color: "#9747ff", cube: "/images/tools/figjam.png" },
  { abbr: "Ai", name: "Illustrator", maker: "Adobe", use: "Vector artwork, logos, labels and dielines", color: "#ff9a00", cube: "/images/tools/illustrator.png" },
  { abbr: "Ps", name: "Photoshop", maker: "Adobe", use: "Compositing, retouching and campaign creatives", color: "#31a8ff", cube: "/images/tools/photoshop.png" },
  { abbr: "Cv", name: "Canva", maker: "Canva", use: "Quick social adaptations and presentation decks", color: "#00c4cc", cube: "/images/tools/canva.png" },
  { abbr: "Cdr", name: "CorelDRAW", maker: "Corel", use: "Print-ready layouts and large-format artwork", color: "#36c26b", cube: "/images/tools/coreldraw.png" },
];

/* Emblems are the client's renders; one without `icon` shows its initials in a glass disc. */
export type AiTool = { name: string; color: string; icon?: string };

export const aiTools: AiTool[] = [
  { name: "ChatGPT", color: "#10a37f", icon: "/images/ai/chatgpt.png" },
  { name: "Gemini", color: "#4f8bff", icon: "/images/ai/gemini.png" },
  { name: "Claude", color: "#d97757", icon: "/images/ai/claude.png" },
  { name: "Perplexity", color: "#20b8cd", icon: "/images/ai/perplexity.png" },
  { name: "Flow", color: "#8b7bff", icon: "/images/ai/flow.png" },
  { name: "Lovable", color: "#ff5ca8", icon: "/images/ai/lovable.png" },
];

/* The AI workflow board: illustrative prompts, grounded in the resume's "AI to accelerate ideation, visual production and content development". */
export type AiStep = { title: string; tools: string[]; prompt: string; output: string; tone?: string };

export const aiFlow: AiStep[] = [
  { title: "Research", tools: ["Perplexity"], prompt: "What do patients ask before booking a hair-fall treatment?", output: "Sourced audience insights", tone: "#cfe6ff" },
  { title: "Ideate & write", tools: ["ChatGPT", "Claude"], prompt: "Ten hook ideas and a 30-second script for a skincare Reel", output: "Hooks, scripts, captions", tone: "#ffe7a0" },
  { title: "Visualise", tools: ["Gemini", "Flow"], prompt: "Glass serum bottle on stone, soft studio light, clean shadows", output: "Product and model visuals", tone: "#d3efc6" },
  { title: "Prototype", tools: ["Lovable"], prompt: "Clinic landing page with treatments and a booking button", output: "A clickable first build", tone: "#ffd4e4" },
];

export const aiCraft: AiStep = { title: "Direct & craft", tools: ["Figma", "Photoshop"], prompt: "Art direction, retouching, layout and brand consistency, finished by hand.", output: "Ready for social, print and web" };

export const howIWork = ["Problem framing", "Desk research and market analysis", "Competitor analysis", "User interview guides", "Target user groups and pain points", "Wireframing", "High-fidelity mobile UI", "Interactive prototyping"];

export const contact = {
  email: "waseemtahaone@gmail.com",
  phone: "+91 95511 78235",
  phoneHref: "tel:+919551178235",
  whatsapp: "https://wa.me/qr/BEWHMJVAY4V2H1",
  instagram: "https://www.instagram.com/waseem_.taha/",
  instagramHandle: "@waseem_.taha",
  location: "Perambur, Chennai, India",
  resume: "/waseem-taha-resume.pdf",
};

export const ev = {
  intro: "Drivers in an unfamiliar city can't tell which charger is nearby, working, compatible and safe to use. I researched the problem end to end and shaped a mobile concept around the needs the research uncovered.",
  facts: [
    { label: "Problem", value: "Finding and trusting a charger in a place you don't know" },
    { label: "My role", value: "Research, interview guide, wireframes, high-fidelity screens and a clickable prototype" },
    { label: "Platform", value: "Mobile app concept" },
    { label: "Tools", value: "Figma" },
  ],
  process: ["Research", "Pain points & personas", "Journey mapping", "Information architecture", "User flows", "Wireframes", "Prototype"],
  problem: "Charging stations are less common than fuel stations, especially outside cities. Where they exist, the information about them is often incomplete: signage is limited, availability is unclear and payment differs from network to network. Range anxiety grows when a station is broken or occupied and there is no backup plan.",
  audiences: [
    { title: "EV owners and drivers", text: "People who own or rent electric cars, bikes and scooters, including road trippers heading somewhere new." },
    { title: "Fleet operators and ride-share drivers", text: "Delivery services and drivers on platforms like Uber, Lyft and Ola, where downtime costs money." },
    { title: "New EV adopters", text: "People moving from petrol or diesel who don't yet know where and how to charge." },
    { title: "Tourists and business travelers", text: "Visitors using an EV in a new city who need to find chargers without local knowledge." },
    { title: "Urban and suburban commuters", text: "Daily drivers who need reliable charging in more than one place." },
  ],
  frustrations: [
    { title: "Hard to locate chargers", text: "Limited signage and no single navigation tool that shows every station." },
    { title: "Doubt about availability and safety", text: "Drivers worry a station will be busy, broken or poorly lit, especially on long trips or at night." },
    { title: "Charging deserts", text: "Rural and underserved areas have too few stations, which drives range anxiety." },
    { title: "No home charger", text: "Renters and apartment residents rely on public charging, and curbside options are limited." },
    { title: "Connector and payment mismatch", text: "Different connector types and separate apps or cards for each network add friction at the worst time." },
    { title: "Nothing to do while waiting", text: "Many stations have no restrooms, food or seating, so a long charge feels longer." },
  ],
  existing: [
    { title: "EVI-Road Trip tool (NREL)", text: "Analyses energy use and charging demand along long-distance routes." },
    { title: "OpenStreetMap charging map", text: "A community-tagged database of charging points." },
    { title: "CARTO site selection", text: "Uses spatial analysis and points of interest to find high-demand locations for new stations." },
    { title: "Location and capacity models", text: "Approaches such as the p-median model that minimise travel distance to a charger." },
    { title: "Mapbox EV charge finder API", text: "Adds charger discovery to navigation and route planning." },
  ],
  existingInsight: "Most of these solve supply, where to build. My angle is the driver's experience at the moment of need: real-time data, clear compatibility and trust.",
  themes: ["Buying and using an EV", "Planning and traveling", "Charging challenges in real time", "Payment and pricing", "Charging apps", "Gaps and expectations"],
  principles: [
    { title: "Real-time location map", text: "Live availability, amenities and reviews in one place." },
    { title: "Compatibility first", text: "Filter by connector type so drivers never arrive at the wrong plug." },
    { title: "One way to pay", text: "Card or a single app that works across networks." },
    { title: "Safety signals", text: "Show lighting and location context for night stops." },
    { title: "Comfort while you wait", text: "Surface restrooms, food and seating near each charger." },
    { title: "Fast charging on routes", text: "Suggest highway and corridor stops for intercity trips." },
    { title: "Cover the deserts", text: "Make rural and underserved areas visible so gaps can be seen and addressed." },
  ],
  fixes: [
    { problem: "Can't tell if a charger works", solution: "Live availability and a last-updated time on every pin and station." },
    { problem: "Wrong connector on arrival", solution: "A connector filter that highlights what matches the driver's car." },
    { problem: "A different app or card for each network", solution: "One payment method that works across networks." },
    { problem: "Range anxiety on longer trips", solution: "Routes planned with charge stops and the battery level on arrival." },
  ],
  wireframes: [
    { kind: "home", title: "Home", text: "Search, filters, map and nearby stations." },
    { kind: "route", title: "Route", text: "Trip summary with charging stops." },
    { kind: "station", title: "Station", text: "Status, power, price, connectors and amenities." },
    { kind: "charging", title: "Charging", text: "Live progress, cost and payment." },
  ] as const,
  screens: [
    { step: 0, title: "Home", text: "Find and filter chargers with live status." },
    { step: 1, title: "Route", text: "Plan charge stops before leaving." },
    { step: 2, title: "Station", text: "Decide with confidence." },
    { step: 3, title: "Charging", text: "Track progress and pay once." },
  ],
};

export const fitness = {
  lede: "A UX review of 18 fitness and wellness apps. For each one I logged the features everyone has, what only that app does, and what is worth learning from.",
  context: "Tackled why new gym-goers struggle to build a plan that fits their goals, experience, time and abilities. Covered problem definition, user profile, user flows, wireframes and interface design.",
  apps: [
    { name: "Nike Training Club", common: "Workout library, personalised plans, progress tracking", unique: "Free premium content; Apple Health and Google Fit integration", note: "Wide range of workouts with professional trainer guidance" },
    { name: "FitOn", common: "On-demand workouts, personalised plans, progress tracking", unique: "Celebrity-led workouts; social features; Apple Watch heart rate tracking", note: "Variety of workout types, live classes and community engagement" },
    { name: "JEFIT", common: "Workout tracking, exercise library, progress analytics", unique: "Detailed workout logging; community content; customisable plans", note: "Extensive exercise database with a strength training focus" },
    { name: "Home Workout - No Equipment", common: "Bodyweight workouts, daily routines, progress tracking", unique: "Home-based, equipment-free exercises; animation and video guidance", note: "Suits beginners with clear instructional content" },
    { name: "Centr", common: "Workout programs, meal plans, progress tracking", unique: "Fitness, nutrition and mindfulness in one; celebrity trainers and chefs", note: "Comprehensive wellness focus and high-quality production" },
    { name: "8fit", common: "Workout plans, meal planning, progress tracking", unique: "Fitness and nutrition plans combined; customisable meal recipes", note: "Personalised plans in a user-friendly interface" },
    { name: "Couch to 5K", common: "Running programs, progress tracking, audio coaching", unique: "Structured beginner plan with gradual progression to 5K", note: "Clear, incremental structure ideal for novice runners" },
    { name: "MyFitnessPal", common: "Calorie tracking, food database, exercise logging", unique: "Barcode scanner for nutrition info; wide app and device integrations", note: "Comprehensive nutrition tracking with community forums" },
    { name: "Strava", common: "Activity tracking, performance analytics, social sharing", unique: "Running and cycling focus; segment competition; GPS device integration", note: "Strong community engagement and detailed metrics" },
    { name: "Peloton", common: "Live and on-demand classes, progress tracking, community", unique: "Interactive live classes; leaderboards; equipment integration", note: "High production quality and engaging instructors" },
    { name: "Fitbod", common: "Workout generation, progress tracking, exercise library", unique: "AI-driven workouts that adapt to progress", note: "Tailored strength routines with detailed instructions" },
    { name: "Sworkit", common: "Customisable workouts, video demos, progress tracking", unique: "Flexible workout lengths; strength, cardio and yoga", note: "Works for all fitness levels, with no-equipment options" },
    { name: "Freeletics", common: "Bodyweight workouts, personalised coaching, progress tracking", unique: "AI-based personal trainer; high-intensity focus", note: "Time-efficient workouts and community challenges" },
    { name: "Daily Burn", common: "On-demand workouts, live classes, progress tracking", unique: "Many workout types; a new live workout every day", note: "Diverse library with community engagement" },
    { name: "Aaptiv", common: "Audio-based workouts, personalised plans, progress tracking", unique: "Trainer-led audio sessions across many categories", note: "Hands-free guidance that suits outdoor activity" },
    { name: "Sweat", common: "Workout programs, meal plans, progress tracking", unique: "Female-focused programs; access to multiple trainers", note: "Community support and a holistic health approach" },
    { name: "MapMyFitness", common: "Activity tracking, route mapping, progress analytics", unique: "Under Armour shoe integration; customisable training plans", note: "Detailed route tracking and community challenges" },
    { name: "Workout Trainer by Skimble", common: "Workout library, custom plans, progress tracking", unique: "Audio and video guidance; community forums", note: "Variety of workouts for all fitness levels" },
  ],
  insights: [
    { title: "Progress tracking is the baseline", text: "Nearly every app lets people track what they do. It no longer sets an app apart, so it needs to be easy and quick rather than novel." },
    { title: "Community and coaching keep people coming back", text: "Apps like Strava, Peloton and FitOn lean on leaderboards, live classes and social features to build a habit." },
    { title: "Personalisation is the differentiator", text: "AI-built plans in Fitbod and Freeletics, and combined fitness and meal plans in 8fit and Centr, show where the field is moving." },
  ],
};
