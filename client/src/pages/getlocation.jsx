import axios from 'axios';

export const getCoordinates = async (place) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAP_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(place)}&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    const results = response.data.results;
    if (results.length > 0) {
      const location = results[0].geometry.location;
      return {
        lat: location.lat,
        lng: location.lng,
      };
    } else {
      console.error('No results found for place:', place);
      return null;
    }
  } catch (error) {
    console.error('Error fetching coordinates:', error);
    return null;
  }
};