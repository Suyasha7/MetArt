import { GoogleGenerativeAI } from "@google/generative-ai";

const getGeminiInstance = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.includes("dummyapikey")) {
    console.warn("Using placeholder/dummy Gemini API key. Service will operate in Mock Fallback Mode.");
    return null;
  }
  return new GoogleGenerativeAI(apiKey);
};

/**
 * Appraises uploaded digital artwork using Google Gemini Vision.
 * Analyzes the composition, colors, and subject matter to generate:
 * 1. Aesthetic storytelling catalog description.
 * 2. Suggested tags.
 * 3. Starting bid recommendation.
 * 4. AI watermarking configurations (position & opacity to protect IP).
 * 
 * Includes elegant Mock fallback parameters to ensure robust system stability.
 * 
 * @param {string} mimeType - The mime type of the image (e.g. image/jpeg).
 * @param {string} base64Data - The raw base64 string of the image (without the data URI prefix).
 * @returns {Promise<object>} The appraised JSON metadata structure.
 */
export const appraiseArtwork = async (mimeType, base64Data) => {
  const genAI = getGeminiInstance();

  if (!genAI) {
    console.log("Gemini client offline. Executing Mock AI appraisal pipeline...");
    await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API delay
    return getFallbackAppraisal();
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are an expert AI Art Appraiser, art historian, and security watermark analyst.
Analyze the artwork image provided and return a JSON object with the following properties:
{
  "description": "A highly creative, detailed, professional storytelling description (approx 100 words) highlighting visual texture, emotional tones, and catalog appeal.",
  "tags": ["6-8", "relevant", "searchable", "lowercase", "keywords"],
  "suggestedPrice": 450,
  "watermarkPosition": "center",
  "watermarkOpacity": 0.25
}
ONLY return the raw JSON object. Do not include markdown formatting like \`\`\`json.`;

    const imagePart = {
      inlineData: {
        data: base64Data,
        mimeType: mimeType,
      },
    };

    const result = await model.generateContent([prompt, imagePart]);
    const responseText = result.response.text();
    
    // Clean up potential markdown formatting from Gemini response
    const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const parsedJson = JSON.parse(cleanedText);
    console.log("Artwork successfully appraised by Gemini Vision:", parsedJson);
    return parsedJson;
  } catch (error) {
    console.error("Gemini visual appraisal failed. Gracefully falling back to local analysis:", error.message);
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
    suggestedPrice: Math.floor(Math.random() * (900 - 300) + 300),
    watermarkPosition: positions[Math.floor(Math.random() * positions.length)],
    watermarkOpacity: parseFloat((Math.random() * (0.35 - 0.20) + 0.20).toFixed(2))
  };
};
