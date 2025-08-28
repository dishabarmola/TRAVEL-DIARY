import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Init Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Function to search for images using Google Custom Search API
async function searchImages(query, location) {
  try {
    const searchQuery = `${query} ${location}`;
    const response = await axios.get('https://www.googleapis.com/customsearch/v1', {
      params: {
        key: process.env.GOOGLE_API_KEY,
        cx: process.env.GOOGLE_CX, // Custom Search Engine ID
        q: searchQuery,
        searchType: 'image',
        num: 1, // Get only the first image
        imgSize: 'large',
        imgType: 'photo',
        safe: 'active'
      }
    });

    if (response.data.items && response.data.items.length > 0) {
      return response.data.items[0].link;
    }
    
    // Fallback to Unsplash if no results
    return `https://source.unsplash.com/800x600/?${encodeURIComponent(searchQuery)}`;
  } catch (error) {
    console.error('Error searching for images:', error);
    // Fallback to Unsplash
    return `https://source.unsplash.com/800x600/?${encodeURIComponent(query)},${encodeURIComponent(location)}`;
  }
}

// Function to get images for activities
async function getActivityImages(activities, location) {
  const updatedActivities = [];
  
  for (const activity of activities) {
    try {
      // Extract key terms from the activity description for better search
      const searchTerms = extractSearchTerms(activity.description);
      const imageUrl = await searchImages(searchTerms, location);
      
      updatedActivities.push({
        ...activity,
        image: imageUrl
      });
      
      // Add small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error('Error getting image for activity:', error);
      updatedActivities.push({
        ...activity,
        image: `https://source.unsplash.com/800x600/?${location.replace(/\s+/g, ',')},travel`
      });
    }
  }
  
  return updatedActivities;
}

// Helper function to extract meaningful search terms
function extractSearchTerms(description) {
  // Simple extraction of key terms (you can make this more sophisticated)
  const commonWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'visit', 'explore', 'see', 'go'];
  const words = description.toLowerCase().split(/\W+/);
  const meaningfulWords = words.filter(word => 
    word.length > 3 && !commonWords.includes(word)
  ).slice(0, 3); // Take first 3 meaningful words
  
  return meaningfulWords.join(' ') || 'tourist attraction';
}

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
                "image": "placeholder",
                "cost": "₹500-800 per person",
                "description": "Detailed description of what to do, where to go, timings, and why it's worth visiting. Include specific place names and attractions."
              }
            ]
          }
        ]
      }
      
      For each day, include 2-4 activities. Make sure each activity description includes specific place names, attractions, or activities that can be searched for images.
      Keep costs realistic for the given budget range. Include specific details like timings, addresses, and tips.
      Don't add double quotes within the text in json
      The image field will be populated automatically with actual images, so just use "placeholder" for now.
    `;
    
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);

    // Extract text response
    let itineraryText = result.response.text();
    
    // Clean up the response to extract JSON
    itineraryText = itineraryText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    try {
      const itinerary = JSON.parse(itineraryText);
      
      // Get actual images for each activity
      const updatedItinerary = {
        ...itinerary,
        days: await Promise.all(
          itinerary.days.map(async (dayData) => ({
            ...dayData,
            activities: await getActivityImages(dayData.activities, location)
          }))
        )
      };
      
      res.json(updatedItinerary);
      
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      console.log("Raw response:", itineraryText);
      res.json({
        days: [{
          day: 1,
          title: "Day 1 - Explore " + location,
          activities: [{
            image: `https://source.unsplash.com/800x600/?${location.replace(/\s+/g, ',')},travel`,
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

// Endpoint to test individual image searches
app.post("/api/search-image", async (req, res) => {
  try {
    const { query, location } = req.body;
    const imageUrl = await searchImages(query, location);
    res.json({ imageUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Enhanced endpoint to test if image URLs are working
app.post("/api/test-images", async (req, res) => {
  const { imageUrls } = req.body;
  
  const testResults = await Promise.all(
    imageUrls.map(async (url) => {
      try {
        const response = await fetch(url, { 
          method: 'HEAD',
          timeout: 5000
        });
        return {
          url: url,
          working: response.ok,
          status: response.status,
          contentType: response.headers.get('content-type')
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