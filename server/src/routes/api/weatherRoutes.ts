import { Router, type Request, type Response } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
  try {
    const { cityName } = req.body; // Extract city name from request body
    if (!cityName) {
      return res.status(400).json({ message: 'City name is required' });
    }

    // Call WeatherService to get current weather data
    const weatherData = await WeatherService.getWeatherForCity(cityName);

    // Save city to search history using HistoryService
    await HistoryService.addCity(cityName);  // Correct method is addCity

    return res.status(200).json({ weatherData });
  } catch (error) {
    console.error('Error retrieving weather data:', error);
    return res.status(500).json({ message: 'Failed to retrieve weather data' });
  }
});

// GET search history
router.get('/history', async (_req: Request, res: Response) => {
  try {
    // Get the cities from the search history
    const history = await HistoryService.getCities();  // Correct method is getCities
    return res.status(200).json({ history });
  } catch (error) {
    console.error('Error retrieving search history:', error);
    return res.status(500).json({ message: 'Failed to retrieve search history' });
  }
});

// DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await HistoryService.removeCity(id);  // Correct method is removeCity
    return res.status(200).json({ message: 'City deleted from search history' });
  } catch (error) {
    console.error('Error deleting city from search history:', error);
    return res.status(500).json({ message: 'Failed to delete city from search history' });
  }
});

export default router;
