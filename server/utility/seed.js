import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "../models/userModel.js";
import { Art } from "../models/artModel.js";
import { Chat } from "../models/chatModel.js";
import { Message } from "../models/messageModel.js";

dotenv.config({ path: "./config.env" });

// Helper to build image object
const img = (id, url) => [{
  original_image_public_id: `metart/seeds/${id}_orig`,
  original_image_url: url,
  watermarked_image_public_id: `metart/seeds/${id}_wm`,
  watermarked_image_url: url
}];

const seedData = async () => {
  try {
    const dbUri = process.env.DATABASE_URI || "mongodb://127.0.0.1:27017/metart";
    console.log(`Connecting to MongoDB at: ${dbUri}`);
    await mongoose.connect(dbUri);
    console.log("Database connection successful!");

    console.log("Cleaning up existing database records...");
    await User.deleteMany({});
    await Art.deleteMany({});
    await Chat.deleteMany({});
    await Message.deleteMany({});
    console.log("Database successfully cleaned!");

    // ──────────────────── USERS ────────────────────
    console.log("Seeding users...");

    const adminUser = await User.create({
      name: "MetArt Admin", email: "admin@metar.com",
      password: "adminpassword123", confirmPassword: "adminpassword123",
      role: "admin",
      avatar: { public_id: "metart/seeds/admin_av", url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80" }
    });

    const artistUser = await User.create({
      name: "Vincent van Gogh", email: "artist@metar.com",
      password: "artistpassword123", confirmPassword: "artistpassword123",
      role: "painter",
      avatar: { public_id: "metart/seeds/artist_av", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80" }
    });

    const buyerUser = await User.create({
      name: "Jane Collector", email: "buyer@metar.com",
      password: "buyerpassword123", confirmPassword: "buyerpassword123",
      role: "user",
      avatar: { public_id: "metart/seeds/buyer_av", url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80" }
    });

    console.log(`Users seeded:
  Admin  → admin@metar.com / adminpassword123
  Artist → artist@metar.com / artistpassword123
  Buyer  → buyer@metar.com / buyerpassword123`);

    await Chat.create({ participants: [adminUser._id.toString(), artistUser._id.toString()] });
    await Chat.create({ participants: [adminUser._id.toString(), buyerUser._id.toString()] });

    // ──────────────────── ARTWORKS ────────────────────
    console.log("Seeding 30 premium artworks across 5 categories...");
    const creator = artistUser._id;

    const artworks = [

      // ═══════════ PAINTING (6 pieces) ═══════════
      { name: "Starry Night Reimagined", price: 520, category: "painting", creator,
        description: "A vibrant reinterpretation of starry skies over rolling hills, featuring bold swirling strokes and deep indigo hues blending into warm golden starlight.",
        images: img("paint1", "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80"),
        isAuctionItem: false, artStatus: "unsold" },

      { name: "Crimson Dusk Horizon", price: 680, category: "painting", creator,
        description: "A sweeping oil painting capturing the dramatic transition from sunset crimson to twilight violet across a vast open plain dotted with wildflowers.",
        images: img("paint2", "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=800&q=80"),
        isAuctionItem: false, artStatus: "unsold" },

      { name: "The Blue Reverie", price: 450, category: "painting", creator,
        description: "An abstract expressionist canvas dominated by oceanic blues and teals, with thick impasto brush strokes creating a hypnotic sense of depth and motion.",
        images: img("paint3", "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=800&q=80"),
        isAuctionItem: false, artStatus: "unsold" },

      { name: "Garden of Whispers", price: 390, category: "painting", creator,
        description: "An impressionist floral garden scene bathed in soft morning light, with dappled pastel pinks, lavenders, and sage greens dancing across the canvas.",
        images: img("paint4", "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800&q=80"),
        isAuctionItem: false, artStatus: "unsold" },

      { name: "Molten Amber Abstract", price: 750, category: "painting", creator,
        description: "A contemporary abstract painting featuring rivers of liquid gold and amber flowing across a deep charcoal background, evoking volcanic energy.",
        images: img("paint5", "https://images.unsplash.com/photo-1573521193826-58c7dc2e13e3?w=800&q=80"),
        isAuctionItem: false, artStatus: "unsold" },

      { name: "Lavender Fields Forever", price: 480, category: "painting", creator,
        description: "A peaceful countryside painting of endless lavender rows stretching toward distant purple mountains under a warm, hazy summer sky.",
        images: img("paint6", "https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=800&q=80"),
        isAuctionItem: false, artStatus: "unsold" },

      // ═══════════ PHOTOGRAPHY (6 pieces) ═══════════
      { name: "Golden Hour Summit", price: 320, category: "photography", creator,
        description: "A breathtaking photograph of a lone hiker silhouetted against the fiery golden light of sunrise breaking over a misty mountain summit.",
        images: img("photo1", "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80"),
        isAuctionItem: false, artStatus: "unsold" },

      { name: "Ocean Mirror", price: 280, category: "photography", creator,
        description: "Crystal-clear still water reflecting a dramatic clouded sky, creating a perfect mirror image that blurs the boundary between sea and heaven.",
        images: img("photo2", "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=800&q=80"),
        isAuctionItem: false, artStatus: "unsold" },

      { name: "Urban Neon Nightscape", price: 410, category: "photography", creator,
        description: "A stunning long-exposure photograph of rain-slicked city streets glowing with reflected neon signs in electric pink, blue, and violet tones.",
        images: img("photo3", "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800&q=80"),
        isAuctionItem: false, artStatus: "unsold" },

      { name: "Autumn Forest Trail", price: 350, category: "photography", creator,
        description: "A serene forest pathway carpeted in fallen amber and ruby leaves, with golden sunlight streaming through the canopy of ancient oak trees.",
        images: img("photo4", "https://images.unsplash.com/photo-1476231682828-37e571bc172f?w=800&q=80"),
        isAuctionItem: false, artStatus: "unsold" },

      { name: "Desert Starfield", price: 460, category: "photography", creator,
        description: "An astrophotography masterpiece showing the Milky Way stretching across a pristine desert sky, with sandstone formations silhouetted below.",
        images: img("photo5", "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&q=80"),
        isAuctionItem: false, artStatus: "unsold" },

      { name: "Cherry Blossom Sunrise", price: 290, category: "photography", creator,
        description: "Delicate pink cherry blossoms framing a misty lake at dawn, creating a dreamlike composition of soft pastels and gentle reflections.",
        images: img("photo6", "https://images.unsplash.com/photo-1522383225653-ed111181a951?w=800&q=80"),
        isAuctionItem: false, artStatus: "unsold" },

      // ═══════════ SCULPTURE (5 pieces) ═══════════
      { name: "The Gilded Seraphim", price: 950, category: "sculpture", creator,
        description: "A classical marble sculpture depicting a divine winged figure carrying a torch of eternal wisdom, with precise geometric shadow cuts and polished alabaster finish.",
        images: img("sculpt1", "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?w=800&q=80"),
        isAuctionItem: false, artStatus: "unsold" },

      { name: "Twisted Infinity", price: 1200, category: "sculpture", creator,
        description: "A modern stainless steel sculpture with fluid, twisting forms that catch and reflect surrounding light, creating an ever-changing visual experience.",
        images: img("sculpt2", "https://images.unsplash.com/photo-1549490349-8643362247b5?w=800&q=80"),
        isAuctionItem: false, artStatus: "unsold" },

      { name: "Stone Guardian", price: 780, category: "sculpture", creator,
        description: "A powerful granite carving of an ancient lion guardian, featuring weathered textures and commanding posture that speaks to centuries of protective symbolism.",
        images: img("sculpt3", "https://images.unsplash.com/photo-1544413660-299165566b1d?w=800&q=80"),
        isAuctionItem: false, artStatus: "unsold" },

      { name: "Bronze Dancer", price: 650, category: "sculpture", creator,
        description: "An elegant bronze figure captured mid-pirouette, with flowing fabric textures and graceful movement frozen in warm, oxidized metal.",
        images: img("sculpt4", "https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=800&q=80"),
        isAuctionItem: false, artStatus: "unsold" },

      { name: "Abstract Form No. 7", price: 550, category: "sculpture", creator,
        description: "A minimalist ceramic sculpture exploring negative space and organic curves, glazed in matte white with subtle blue undertones.",
        images: img("sculpt5", "https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?w=800&q=80"),
        isAuctionItem: false, artStatus: "unsold" },

      // ═══════════ SKETCHING (6 pieces) ═══════════
      { name: "Whispering Dreams", price: 300, category: "sketching", creator,
        description: "A highly detailed black and white pencil sketch of abstract organic floral patterns that intertwine seamlessly across the page with extraordinary precision.",
        images: img("sketch1", "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80"),
        isAuctionItem: false, artStatus: "unsold" },

      { name: "Portrait in Graphite", price: 420, category: "sketching", creator,
        description: "A photorealistic graphite portrait capturing the soul of the subject through masterful shading, delicate cross-hatching, and intense eye detail.",
        images: img("sketch2", "https://images.unsplash.com/photo-1578926288207-a90a5366759d?w=800&q=80"),
        isAuctionItem: false, artStatus: "unsold" },

      { name: "Urban Architecture Study", price: 250, category: "sketching", creator,
        description: "A meticulous architectural pencil study of a Gothic cathedral facade, showcasing intricate flying buttresses and rose window details with precise line work.",
        images: img("sketch3", "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80"),
        isAuctionItem: false, artStatus: "unsold" },

      { name: "Hands of Creation", price: 380, category: "sketching", creator,
        description: "An expressive charcoal sketch of intertwined hands in various positions of creation, showing remarkable anatomical accuracy and emotional depth.",
        images: img("sketch4", "https://images.unsplash.com/photo-1551913902-c92207136625?w=800&q=80"),
        isAuctionItem: false, artStatus: "unsold" },

      { name: "Nature's Blueprint", price: 270, category: "sketching", creator,
        description: "A botanical illustration rendered in fine-line ink, featuring a collection of wildflowers, leaves, and seed pods with scientific precision and artistic beauty.",
        images: img("sketch5", "https://images.unsplash.com/photo-1596548438137-d51ea5c83ca5?w=800&q=80"),
        isAuctionItem: false, artStatus: "unsold" },

      { name: "The Dreamer's Gaze", price: 340, category: "sketching", creator,
        description: "A soft pencil sketch of a figure lost in thought, gazing out a rain-streaked window. Beautiful use of negative space and gentle smudge shading.",
        images: img("sketch6", "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80"),
        isAuctionItem: false, artStatus: "unsold" },

      // ═══════════ DIGITAL ART (6 pieces) ═══════════
      { name: "Neon Cybernetic Renaissance", price: 650, category: "digital", creator,
        description: "An elegant fusion of classical Renaissance aesthetics and high-tech cyberpunk neon vector lines, creating a stunning retro-futuristic visual experience.",
        images: img("digi1", "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&q=80"),
        isAuctionItem: false, artStatus: "unsold" },

      { name: "Fractal Universe", price: 480, category: "digital", creator,
        description: "A mesmerizing deep-zoom fractal artwork revealing infinite layers of mathematical beauty in electric blues, purples, and glowing cyan highlights.",
        images: img("digi2", "https://images.unsplash.com/photo-1550684376-efcbd6e3f031?w=800&q=80"),
        isAuctionItem: false, artStatus: "unsold" },

      { name: "Synthwave Sunset", price: 520, category: "digital", creator,
        description: "A retro-futuristic digital landscape featuring a wireframe grid stretching to a glowing pink and purple horizon under twin digital suns.",
        images: img("digi3", "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=800&q=80"),
        isAuctionItem: false, artStatus: "unsold" },

      { name: "Holographic Bloom", price: 390, category: "digital", creator,
        description: "Digital flowers rendered in iridescent holographic colors that shift between pink, teal, and gold, set against a deep space background.",
        images: img("digi4", "https://images.unsplash.com/photo-1563089145-599997674d42?w=800&q=80"),
        isAuctionItem: false, artStatus: "unsold" },

      { name: "AI Dream Portal", price: 720, category: "digital", creator,
        description: "An AI-generated dreamscape showing impossible architectural structures floating in a cosmic void, bathed in ethereal gradient lighting.",
        images: img("digi5", "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80"),
        isAuctionItem: false, artStatus: "unsold" },

      { name: "Pixel Galaxy", price: 340, category: "digital", creator,
        description: "A stunning pixel art composition of a sprawling galaxy rendered in thousands of carefully placed color dots, blending retro gaming aesthetics with cosmic grandeur.",
        images: img("digi6", "https://images.unsplash.com/photo-1633167606207-d840b5070fc2?w=800&q=80"),
        isAuctionItem: false, artStatus: "unsold" },

      // ═══════════ AUCTION ITEM (1 piece) ═══════════
      { name: "Horizon Glow (Live Auction)", price: 800, category: "painting", creator,
        description: "An active live auction masterpiece capturing the golden hour glow reflecting off geometric glass structures. Features incredible lighting and high contrast shadows.",
        images: img("auction1", "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80"),
        isAuctionItem: true, estimatedValueFrom: 500, estimatedValueTo: 1200,
        endDate: new Date(Date.now() + 5*24*60*60*1000).toISOString(),
        artStatus: "unsold" },
    ];

    await Art.insertMany(artworks);
    console.log(`Successfully seeded ${artworks.length} premium artworks across all 5 categories!`);
    console.log("Seeding process completed perfectly!");
    process.exit(0);
  } catch (error) {
    console.error("Error during database seeding:", error);
    process.exit(1);
  }
};

seedData();
