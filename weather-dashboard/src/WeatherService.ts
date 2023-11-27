import axios from 'axios';

const weatherService = {
  async getWeatherData(date: string): Promise<any> {
    try {
      const response = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=1.29&longitude=103.85&hourly=relativehumidity_2m,direct_radiation&daily=temperature_2m_max,temperature_2m_min&timezone=Asia%2FSingapore&start_date=2023-10-01&end_date=2023-10-10`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw error; // Rethrow the error for handling elsewhere if needed
    }
  },
};

export default weatherService;