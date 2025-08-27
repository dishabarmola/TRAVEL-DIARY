import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Init Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/api/tripform/itinerary", async (req, res) => {
  try {
    const { days, location, people, budgetMin, budgetMax } = req.body;

    const prompt = `
      You are a travel planner. Create a detailed ${days}-day itinerary for ${people} people visiting ${location}.
      Budget range: ${budgetMin}-${budgetMax} rupees.
      
      IMPORTANT: Return ONLY a valid JSON response in this exact format:
      {
        "days": [
          {
            "day": 1,
            "title": "Day 1 Title",
            "activities": [
              {
                "image": "https://example.com/direct-image-url.jpg",
                "cost": "₹500-800 per person",
                "description": "Detailed description of what to do, where to go, timings, and why it's worth visiting"
              }
            ]
          }
        ]
      }
      
      CRITICAL REQUIREMENTS FOR IMAGES:
      1. The "image" field MUST contain actual, working image URLs from the internet (not search terms)
      2. Find real image URLs that show the specific places, landmarks, or activities in ${location}
      3. Use high-quality images that are publicly accessible
      4. Ensure URLs are from reliable sources like Wikipedia, tourism sites, or public image repositories
      5. Each image should be directly related to the specific activity or place mentioned
      6. Use different images for different activities - don't repeat URLs
      
      Examples of good image URLs:
      - https://upload.wikimedia.org/wikipedia/commons/thumb/...
      - https://cdn.pixabay.com/photo/...
      - https://images.pexels.com/photos/...
      - Tourism board official images
      - Government tourism site images
      
      For each day, include 2-4 activities. Make sure each activity has a unique, working image URL.
      Keep costs realistic for the given budget range. Include specific details like timings, addresses, and tips.
      
      DO NOT use placeholder URLs or search terms - only provide real, working image URLs that show ${location} attractions.
    `;

    // Use Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);

    // Extract text response
    let itineraryText = result.response.text();
    
    // Clean up the response to extract JSON
    itineraryText = itineraryText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    try {
      const itinerary = JSON.parse(itineraryText);
      
      // Optional: Validate that images are actual URLs
      const validateAndFixImages = (itinerary) => {
        for (let dayData of itinerary.days) {
          for (let activity of dayData.activities) {
            // Check if image field contains a valid URL
            if (!activity.image || !activity.image.startsWith('http')) {
              // Fallback to a working placeholder if LLM didn't provide proper URL
              activity.image = `https://source.unsplash.com/600x400/?${location.replace(/\s+/g, ',')},travel`;
            }
          }
        }
        return itinerary;
      };
      
      const validatedItinerary = validateAndFixImages(itinerary);
      res.json(validatedItinerary);
      
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      console.log("Raw response:", itineraryText);
      
      // Fallback response if JSON parsing fails
      res.json({
        days: [{
          day: 1,
          title: "Day 1 - Explore " + location,
          activities: [{
            image: `https://source.unsplash.com/600x400/?${location.replace(/\s+/g, ',')},travel`,
            cost: `₹${budgetMin}-${budgetMax} per person`,
            description: "We encountered an issue parsing the itinerary. Please try again."
          }]
        }]
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate itinerary" });
  }
});

// Optional: Add an endpoint to test if image URLs are working
app.post("/api/test-images", async (req, res) => {
  const { imageUrls } = req.body;
  
  const testResults = await Promise.all(
    imageUrls.map(async (url) => {
      try {
        const response = await fetch(url, { method: 'HEAD' });
        return {
          url: url,
          working: response.ok,
          status: response.status
        };
      } catch (error) {
        return {
          url: url,
          working: false,
          error: error.message
        };
      }
    })
  );
  
  res.json(testResults);
});

app.listen(5000, () =>
  console.log("✅ Server running on http://localhost:5000")
);