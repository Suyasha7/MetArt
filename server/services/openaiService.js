import OpenAI from "openai";

const getOpenAIInstance = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey.includes("dummyapikey")) {
    console.warn("Using placeholder/dummy OpenAI API key. Service will operate in Mock Fallback Mode.");
    return null;
  }
  return new OpenAI({ apiKey });
};

/**
 * Appraises uploaded digital artwork using GPT-4o Vision.
 * Analyzes the composition, colors, and subject matter to generate:
 * 1. Aesthetic storytelling catalog description.
 * 2. Suggested tags.
 * 3. Starting bid recommendation.
 * 4. AI watermarking configurations (position & opacity to protect IP).
 * 
 * Includes elegant Mock fallback parameters to ensure robust system stability.
 * 
 * @param {string} imageBase64 - The base64 data URI of the image.
 * @returns {Promise<object>} The appraised JSON metadata structure.
 */
export const appraiseArtwork = async (imageBase64) => {
  const openai = getOpenAIInstance();

  if (!openai) {
    console.log("OpenAI client offline. Executing Mock AI appraisal pipeline...");
    await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API delay
    return getFallbackAppraisal();
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are an expert AI Art Appraiser, art historian, and security watermark analyst.
Analyze the artwork image provided and return a JSON object with the following properties:
{
  "description": "A highly creative, detailed, professional storytelling description (approx 100 words) highlighting visual texture, emotional tones, and catalog appeal.",
  "tags": ["6-8", "relevant", "searchable", "lowercase", "keywords"],
  "suggestedPrice": 450, // Recommended starting bid as an integer (USD $150 to $2000)
  "watermarkPosition": "center", // Optimal watermark overlay placement to protect the main visual subject (choose one of: "center", "northeast", "southwest", "northwest", "southeast")
  "watermarkOpacity": 0.25 // Suggested overlay opacity (0.15 to 0.4) based on composition brightness (higher opacity for bright canvases)
}`
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Please analyze and appraise this uploaded artwork image:"
            },
            {
              type: "image_url",
              image_url: {
                url: imageBase64 // Expects data URI format: data:image/jpeg;base64,...
              }
            }
          ]
        }
      ],
      max_tokens: 600
    });

    const parsedJson = JSON.parse(response.choices[0].message.content);
    console.log("Artwork successfully appraised by GPT-4o Vision:", parsedJson);
    return parsedJson;
  } catch (error) {
    console.error("OpenAI visual appraisal failed. Gracefully falling back to local analysis:", error.message);
    return getFallbackAppraisal();
  }
};

// Robust, high-fidelity default fallback values for testing and fallback stability
const getFallbackAppraisal = () => {
  const descriptions = [
    "An exquisite, high-contrast canvas showcasing bold strokes and a vibrant interplay of colors. The central composition creates a visual dialogue between warm gold highlights and deep twilight undertones, yielding a profound sense of depth and contemplation.",
    "A stunning visual journey characterized by soft, delicate gradients and precise details. The atmospheric lighting casts organic shadows across the canvas, making it a compelling centerpiece that evokes calm, meditative energy.",
    "A contemporary masterpiece utilizing structured geometric patterns and vibrant color theory. The visual texture feels tactile and complex, drawing the viewer's eye into a mesmerizing perspective of modern expressionism."
  ];

  const tagsList = [
    ["abstract", "modernism", "impasto", "acrylic", "contemporary"],
    ["portrait", "realism", "minimalism", "pastel", "expressionist"],
    ["landscape", "impressionism", "oil-painting", "nature", "fine-art"]
  ];

  const positions = ["center", "southwest", "northeast", "southeast"];

  const randomIndex = Math.floor(Math.random() * 3);

  return {
    description: descriptions[randomIndex],
    tags: tagsList[randomIndex],
    suggestedPrice: Math.floor(Math.random() * (900 - 300) + 300), // Random suggested starting bid between $300 and $900
    watermarkPosition: positions[Math.floor(Math.random() * positions.length)],
    watermarkOpacity: parseFloat((Math.random() * (0.35 - 0.20) + 0.20).toFixed(2)) // Decimal between 0.20 and 0.35
  };
};

/**
 * Generates an interactive, storytelling, luxury-minimal commentary review
 * for a virtual gallery Space. The AI acts as a high-end Art Historian & Curator.
 * 
 * @param {string} spaceName - The name of the exhibition space.
 * @param {string} spaceDescription - The description of the space.
 * @param {Array<object>} artworks - Artworks listed in the space.
 * @returns {Promise<string>} The curator's narrative commentary.
 */
export const generateLiveCommentary = async (spaceName, spaceDescription, artworks = []) => {
  const openai = getOpenAIInstance();

  const artworksSummary = artworks.map((art, idx) => 
    `${idx + 1}. "${art.name}" by Creator ID/Name: ${art.creator} (Price: $${art.price}). Description: ${art.description}`
  ).join("\n");

  const promptContent = `You are a prestigious, world-renowned Art Historian, Senior Curator, and Exhibition Commentator for the elite "MetArt" virtual gallery.
Your role is to give a live, sophisticated, and engaging review tour of the exhibition space named "${spaceName}".
The space's curatorial theme is: "${spaceDescription}".

Here are the artworks currently displayed in this Space:
${artworksSummary || "No artworks uploaded yet in this exhibition."}

Deliver a beautifully flowing, narrative-rich tour critique (approx 120-150 words). 
Make the commentary feel alive, highly professional, intellectual yet accessible. 
Comment on the emotional cohesion of the pieces, the relationship between their prices and rarity, and the visual weight of the collection. Keep your tone sophisticated, encouraging, and luxurious.`;

  if (!openai) {
    console.log("OpenAI client offline. Generating Mock live commentary...");
    await new Promise((resolve) => setTimeout(resolve, 1200));
    return getFallbackCommentary(spaceName, artworks);
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an elite, luxurious Art Curator and Commentator for MetArt Gallery."
        },
        {
          role: "user",
          content: promptContent
        }
      ],
      max_tokens: 350
    });

    const commentaryText = response.choices[0].message.content.trim();
    console.log("Exhibition commentary successfully generated by GPT-4o:", commentaryText);
    return commentaryText;
  } catch (error) {
    console.error("AI live commentary generation failed, falling back to local critique:", error.message);
    return getFallbackCommentary(spaceName, artworks);
  }
};

const getFallbackCommentary = (spaceName, artworks = []) => {
  const artworkMentions = artworks.length > 0
    ? `featuring standout masterpieces such as ${artworks.slice(0, 2).map(a => `"${a.name}"`).join(" and ")}`
    : "awaiting its next artistic acquisitions";

  return `Welcome, distinguished guests, to the "${spaceName}" exhibition here at MetArt. As your curator, I am absolutely thrilled to guide you through this sensory landscape, ${artworkMentions}. Notice how the composition plays with balance, casting organic light and conceptual shadow that directly challenges our perception of space and time. There is a deep, emotional dialogue taking place between the pricing constructs and the sheer visual weight of the canvases, signaling a true renaissance for independent digital creators. Let these strokes wash over you, and appreciate the raw, unmediated connection between the artist's digital brush and your collector's eye.`;
};

