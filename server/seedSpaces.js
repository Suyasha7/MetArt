import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "./models/userModel.js";
import { Art } from "./models/artModel.js";
import { Space } from "./models/spaceModel.js";
import bcrypt from "bcrypt";

dotenv.config({ path: "./config.env" });

const uri = process.env.DATABASE_URI;

const artworksData = [
  // === PAINTING CATEGORY (7 Artworks) ===
  {
    name: "Golden Reverie",
    price: 650,
    description: "An evocative contemporary oil painting featuring heavy impasto textures and layered gold leaf highlights that capture the warm reflection of afternoon sunbeams on water.",
    category: "painting",
    images: [{
      original_image_public_id: "seed_painting_1",
      original_image_url: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=800",
      watermarked_image_public_id: "seed_painting_1_wm",
      watermarked_image_url: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=800"
    }],
    isAuctionItem: true,
    estimatedValueFrom: 600,
    estimatedValueTo: 950,
    endDate: "2026-06-15"
  },
  {
    name: "Crimson Solitude",
    price: 450,
    description: "A bold, expressionistic acrylic canvas depicting a solitary figure silhouetted against a surging crimson background, exploring themes of isolation.",
    category: "painting",
    images: [{
      original_image_public_id: "seed_painting_2",
      original_image_url: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=800",
      watermarked_image_public_id: "seed_painting_2_wm",
      watermarked_image_url: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=800"
    }],
    isAuctionItem: false
  },
  {
    name: "Azure Whispers",
    price: 520,
    description: "A serene watercolor study in shades of deep cerulean, cobalt, and misty indigo, conveying the soft movements of a morning ocean tide.",
    category: "painting",
    images: [{
      original_image_public_id: "seed_painting_3",
      original_image_url: "https://images.unsplash.com/photo-1579783928621-7a13d66a62d1?q=80&w=800",
      watermarked_image_public_id: "seed_painting_3_wm",
      watermarked_image_url: "https://images.unsplash.com/photo-1579783928621-7a13d66a62d1?q=80&w=800"
    }],
    isAuctionItem: false
  },
  {
    name: "Earthy Resonance",
    price: 580,
    description: "A textured conceptual panel blending warm terracotta, cool beige, and deep charcoal clay sediments to create a natural, grounding dialogue.",
    category: "painting",
    images: [{
      original_image_public_id: "seed_painting_4",
      original_image_url: "https://images.unsplash.com/photo-1533158326339-7f3cf2404354?q=80&w=800",
      watermarked_image_public_id: "seed_painting_4_wm",
      watermarked_image_url: "https://images.unsplash.com/photo-1533158326339-7f3cf2404354?q=80&w=800"
    }],
    isAuctionItem: true,
    estimatedValueFrom: 550,
    estimatedValueTo: 800,
    endDate: "2026-06-25"
  },
  {
    name: "Lustrous Spring",
    price: 490,
    description: "An impressionistic oil landscape capture portraying blooming lavender meadows and delicate pink cherry blossoms underneath a soft morning light.",
    category: "painting",
    images: [{
      original_image_public_id: "seed_painting_5",
      original_image_url: "https://images.unsplash.com/photo-1580136579312-94651dfd596d?q=80&w=800",
      watermarked_image_public_id: "seed_painting_5_wm",
      watermarked_image_url: "https://images.unsplash.com/photo-1580136579312-94651dfd596d?q=80&w=800"
    }],
    isAuctionItem: false
  },
  {
    name: "Silent Horizon",
    price: 610,
    description: "A minimal, textured horizontal abstract piece exploring the visual dividing line between soft mist grey skies and deep basalt grounds.",
    category: "painting",
    images: [{
      original_image_public_id: "seed_painting_6",
      original_image_url: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?q=80&w=800",
      watermarked_image_public_id: "seed_painting_6_wm",
      watermarked_image_url: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?q=80&w=800"
    }],
    isAuctionItem: false
  },
  {
    name: "Baroque Elegance",
    price: 750,
    description: "A heavy brushwork oil painting inspired by classical chiaroscuro, featuring rich deep textures, warm golden highlights, and velvet shadows.",
    category: "painting",
    images: [{
      original_image_public_id: "seed_painting_7",
      original_image_url: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?q=80&w=800",
      watermarked_image_public_id: "seed_painting_7_wm",
      watermarked_image_url: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?q=80&w=800"
    }],
    isAuctionItem: true,
    estimatedValueFrom: 700,
    estimatedValueTo: 1200,
    endDate: "2026-06-22"
  },

  // === DIGITAL CATEGORY (7 Artworks) ===
  {
    name: "Neo-Tokyo Ascension",
    price: 850,
    description: "A stunning 3D digital render showcasing a towering, rain-slicked cyberpunk high-rise cityscape radiating with vibrant violet and cyan neon signage.",
    category: "digital",
    images: [{
      original_image_public_id: "seed_digital_1",
      original_image_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800",
      watermarked_image_public_id: "seed_digital_1_wm",
      watermarked_image_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800"
    }],
    isAuctionItem: true,
    estimatedValueFrom: 800,
    estimatedValueTo: 1300,
    endDate: "2026-06-20"
  },
  {
    name: "Fractured Dimensions",
    price: 550,
    description: "A colorful holographic abstract digital composition portraying shattered glass planes and iridescent color spectrums in a weightless visual field.",
    category: "digital",
    images: [{
      original_image_public_id: "seed_digital_2",
      original_image_url: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=800",
      watermarked_image_public_id: "seed_digital_2_wm",
      watermarked_image_url: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=800"
    }],
    isAuctionItem: false
  },
  {
    name: "Ethereal Flow",
    price: 480,
    description: "A fluid dynamics digital artwork with swirling waves of lavender silk, pink sands, and golden streams moving in perfect mathematical harmony.",
    category: "digital",
    images: [{
      original_image_public_id: "seed_digital_3",
      original_image_url: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=800",
      watermarked_image_public_id: "seed_digital_3_wm",
      watermarked_image_url: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=800"
    }],
    isAuctionItem: false
  },
  {
    name: "Cybernetic Oasis",
    price: 920,
    description: "A futuristic greenhouse architecture CGI render featuring iridescent structural panels, bio-luminescent plants, and cybernetic light streams.",
    category: "digital",
    images: [{
      original_image_public_id: "seed_digital_4",
      original_image_url: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=800",
      watermarked_image_public_id: "seed_digital_4_wm",
      watermarked_image_url: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=800"
    }],
    isAuctionItem: true,
    estimatedValueFrom: 900,
    estimatedValueTo: 1500,
    endDate: "2026-06-28"
  },
  {
    name: "Aesthetic Core",
    price: 360,
    description: "A retro-synthwave abstract digital portrait rendering neon grid faces, pink horizons, and retro-futuristic geometric grids.",
    category: "digital",
    images: [{
      original_image_public_id: "seed_digital_5",
      original_image_url: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=800",
      watermarked_image_public_id: "seed_digital_5_wm",
      watermarked_image_url: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=800"
    }],
    isAuctionItem: false
  },
  {
    name: "Abstract Infinity",
    price: 680,
    description: "A mathematically calculated fractal artwork rendered in luxurious shades of beige sand, warm gold, and creamy porcelain curves.",
    category: "digital",
    images: [{
      original_image_public_id: "seed_digital_6",
      original_image_url: "https://images.unsplash.com/photo-1618005198143-d566048d30e3?q=80&w=800",
      watermarked_image_public_id: "seed_digital_6_wm",
      watermarked_image_url: "https://images.unsplash.com/photo-1618005198143-d566048d30e3?q=80&w=800"
    }],
    isAuctionItem: false
  },
  {
    name: "Quantum Solitude",
    price: 720,
    description: "An atmospheric virtual environment rendering a lonely astronaut seated on a neon-glowing basalt stone looking towards a lavender star nebula.",
    category: "digital",
    images: [{
      original_image_public_id: "seed_digital_7",
      original_image_url: "https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?q=80&w=800",
      watermarked_image_public_id: "seed_digital_7_wm",
      watermarked_image_url: "https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?q=80&w=800"
    }],
    isAuctionItem: true,
    estimatedValueFrom: 700,
    estimatedValueTo: 1000,
    endDate: "2026-06-24"
  },

  // === PHOTOGRAPHY CATEGORY (7 Artworks) ===
  {
    name: "Whispering Fjords",
    price: 750,
    description: "A serene, award-winning monochrome photograph capturing the mist-covered mountains of western Norway, focusing on the perfect silence of water.",
    category: "photography",
    images: [{
      original_image_public_id: "seed_photo_1",
      original_image_url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800",
      watermarked_image_public_id: "seed_photo_1_wm",
      watermarked_image_url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800"
    }],
    isAuctionItem: true,
    estimatedValueFrom: 700,
    estimatedValueTo: 1100,
    endDate: "2026-06-18"
  },
  {
    name: "Industrial Echoes",
    price: 380,
    description: "An architectural close-up photograph capturing the complex grids of structured steel girders and geometric shadows within an abandoned station.",
    category: "photography",
    images: [{
      original_image_public_id: "seed_photo_2",
      original_image_url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800",
      watermarked_image_public_id: "seed_photo_2_wm",
      watermarked_image_url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800"
    }],
    isAuctionItem: false
  },
  {
    name: "Creamy Deserts",
    price: 430,
    description: "A stunning minimalist desert landscape study showcasing wind-sculpted sand dunes in a soft beige, creamy ivory, and warm peach gradient.",
    category: "photography",
    images: [{
      original_image_public_id: "seed_photo_3",
      original_image_url: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=800",
      watermarked_image_public_id: "seed_photo_3_wm",
      watermarked_image_url: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=800"
    }],
    isAuctionItem: false
  },
  {
    name: "Lavender Twilight",
    price: 520,
    description: "A beautiful long-exposure landscape photo capturing lavender fields in Provence during the golden hour, blending purple rows under a beige sunset.",
    category: "photography",
    images: [{
      original_image_public_id: "seed_photo_4",
      original_image_url: "https://images.unsplash.com/photo-1528183429752-a97d0bf99b5a?q=80&w=800",
      watermarked_image_public_id: "seed_photo_4_wm",
      watermarked_image_url: "https://images.unsplash.com/photo-1528183429752-a97d0bf99b5a?q=80&w=800"
    }],
    isAuctionItem: true,
    estimatedValueFrom: 500,
    estimatedValueTo: 800,
    endDate: "2026-06-26"
  },
  {
    name: "Porcelain Curves",
    price: 460,
    description: "An abstract architectural photography study highlighting the beautiful organic curves and neutral tones of modern minimalist buildings.",
    category: "photography",
    images: [{
      original_image_public_id: "seed_photo_5",
      original_image_url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800",
      watermarked_image_public_id: "seed_photo_5_wm",
      watermarked_image_url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800"
    }],
    isAuctionItem: false
  },
  {
    name: "Misty Woodlands",
    price: 570,
    description: "An atmospheric woodland photography capturing thin birch trunks rising through a thick, beautiful white fog at dawn.",
    category: "photography",
    images: [{
      original_image_public_id: "seed_photo_6",
      original_image_url: "https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=800",
      watermarked_image_public_id: "seed_photo_6_wm",
      watermarked_image_url: "https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=800"
    }],
    isAuctionItem: false
  },
  {
    name: "Urban Geometries",
    price: 690,
    description: "A high-contrast street capture highlighting shadows and clean angles of glass-plated commercial towers underneath clear skies.",
    category: "photography",
    images: [{
      original_image_public_id: "seed_photo_7",
      original_image_url: "https://images.unsplash.com/photo-1449034446853-66c86144b0ad?q=80&w=800",
      watermarked_image_public_id: "seed_photo_7_wm",
      watermarked_image_url: "https://images.unsplash.com/photo-1449034446853-66c86144b0ad?q=80&w=800"
    }],
    isAuctionItem: true,
    estimatedValueFrom: 650,
    estimatedValueTo: 950,
    endDate: "2026-06-27"
  }
];

const seedDatabase = async () => {
  try {
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(uri);
    console.log("Connected successfully! Starting database seeding...");

    // 1. Clean existing seed data
    await Art.deleteMany({ creator: "665715200000000000000001" });
    await Space.deleteMany({ creator: "665715200000000000000001" });
    await User.deleteOne({ _id: "665715200000000000000001" });

    // 2. Create the seed Creator account
    const creatorUser = await User.create({
      _id: new mongoose.Types.ObjectId("665715200000000000000001"),
      name: "Suyasha Gourh",
      email: "suyasha@metart.com",
      password: "suyasha_gourh",
      confirmPassword: "suyasha_gourh",
      role: "creator"
    });
    console.log("Creator account seeded successfully! (suyasha@metart.com / password: suyasha_gourh)");

    // 3. Insert Artworks
    const artIds = [];
    for (const art of artworksData) {
      const createdArt = await Art.create({
        ...art,
        creator: creatorUser._id
      });
      artIds.push(createdArt);
      console.log(`Seeded artwork: "${createdArt.name}"`);
    }

    // 4. Create curated Spaces
    const spacesToCreate = [
      {
        name: "Minimalist Whispers",
        description: "A serene, meditative gallery designed around structural simplicity, silence, and gentle visual weight. Featuring clean beige sand dunes, white mist woodlands, and porcelain architecture.",
        theme: "minimalist",
        artworks: [artIds[14]._id, artIds[15]._id, artIds[16]._id, artIds[18]._id, artIds[19]._id],
        creator: creatorUser._id
      },
      {
        name: "Cyber Renaissance",
        description: "Step into a neon-drenched exploration of high-tech visual realms. Featuring vibrant cybernetic cities, fractured glass grids, and purple star nebula quantum horizons.",
        theme: "futuristic",
        artworks: [artIds[7]._id, artIds[8]._id, artIds[9]._id, artIds[10]._id, artIds[13]._id],
        creator: creatorUser._id
      },
      {
        name: "Classical Echoes",
        description: "An exhibition celebrating the tactile, heavy textures of deep traditional oil canvases, rich pigments, spring flower landscapes, and bold chiaroscuro oil brushwork.",
        theme: "classical",
        artworks: [artIds[0]._id, artIds[1]._id, artIds[2]._id, artIds[4]._id, artIds[6]._id],
        creator: creatorUser._id
      }
    ];

    for (const sp of spacesToCreate) {
      const createdSpace = await Space.create(sp);
      console.log(`Seeded curated Space: "${createdSpace.name}" (${createdSpace.theme})`);
    }

    console.log("Seeding complete! Databases are fully populated.");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed with error:", error);
    process.exit(1);
  }
};

seedDatabase();
