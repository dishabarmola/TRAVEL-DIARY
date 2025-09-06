import React, { useState } from "react";
import { useLocation } from "react-router-dom";

const ItineraryPage = () => {
  const location = useLocation();
  const itineraryData = location.state?.itinerary;
  const [imageLoadingStates, setImageLoadingStates] = useState({});

  // Handle image loading states
  const handleImageLoad = (dayIndex, activityIndex) => {
    setImageLoadingStates(prev => ({
      ...prev,
      [`${dayIndex}-${activityIndex}`]: 'loaded'
    }));
  };

  const handleImageError = (e, dayIndex, activityIndex, originalUrl) => {
    console.log("Image failed to load:", originalUrl);
    setImageLoadingStates(prev => ({
      ...prev,
      [`${dayIndex}-${activityIndex}`]: 'error'
    }));
    // Set fallback image
    e.target.src = `https://source.unsplash.com/600x400/?travel,destination,tourism`;
  };

  if (!itineraryData || !itineraryData.days) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-700 mb-4">No itinerary found</h1>
          <p className="text-gray-500">Please go back and create a new trip plan.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-pink-400">
        Your Travel Itinerary
      </h1>
      
      <div className="max-w-6xl mx-auto">
        {itineraryData.days.map((dayData, dayIndex) => (
          <div key={dayIndex} className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              {dayData.title || `Day ${dayData.day}`}
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dayData.activities && dayData.activities.map((activity, activityIndex) => {
                const imageKey = `${dayIndex}-${activityIndex}`;
                const isLoading = !imageLoadingStates[imageKey];
                const hasError = imageLoadingStates[imageKey] === 'error';
                
                return (
                  <div
                    key={activityIndex}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                  >
                    <div className="h-48 w-full bg-gray-200 overflow-hidden relative">
                      {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-400"></div>
                        </div>
                      )}
                      <img
                        src={activity.image}
                        alt={`Day ${dayData.day} Activity ${activityIndex + 1}`}
                        className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
                        onLoad={() => handleImageLoad(dayIndex, activityIndex)}
                        onError={(e) => handleImageError(e, dayIndex, activityIndex, activity.image)}
                      />
                      {hasError && (
                        <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                          Fallback Image
                        </div>
                      )}
                    </div>
                    
                    {/* Activity Content */}
                    <div className="p-6">
                      {/* Cost Badge */}
                      <div className="mb-3">
                        <span className="inline-block bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-sm font-semibold">
                          {activity.cost || 'Cost varies'}
                        </span>
                      </div>
                      
                      {/* Description */}
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {activity.description || 'No description available'}
                      </p>
                      
                      {/* Optional: Show original image URL for debugging */}
                      {process.env.NODE_ENV === 'development' && (
                        <details className="mt-2">
                          <summary className="text-xs text-gray-400 cursor-pointer">Debug Info</summary>
                          <p className="text-xs text-gray-400 mt-1 break-all">
                            Image URL: {activity.image}
                          </p>
                        </details>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      
      {/* Back Button */}
      <div className="text-center mt-12">
        <button
          onClick={() => window.history.back()}
          className="bg-gradient-to-r from-pink-300 via-rose-300 to-pink-400 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:from-pink-400 hover:to-rose-400 transition-all"
        >
          Plan Another Trip
        </button>
      </div>
    </div>
  );
};

export default ItineraryPage;