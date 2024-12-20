import fs from 'node:fs/promises';
//import path from 'node:path';
//import { fileURLToPath } from 'url';
//const __filename = fileURLToPath(import.meta.url);
//const __dirname = path.dirname(__filename);

// Define the path to the searchHistory.json file
const historyFilePath = "db/db.json";

// Define the City class to represent a city
class City {
  constructor(public id: string, public name: string) {}
}

// HistoryService class to handle reading and writing to searchHistory.json
class HistoryService {
  // Read data from the searchHistory.json file
  private async read(): Promise<City[]> {
    try {
      const data = await fs.readFile(historyFilePath, 'utf-8');
      return JSON.parse(data) as City[];
    } catch (error) {
      console.error('Error reading search history file:', error);
      return []; // Return an empty array if there's an error
    }
  }

  // Write data to the searchHistory.json file
  private async write(cities: City[]): Promise<void> {
    try {
      const data = JSON.stringify(cities, null, 2); // Format the data with 2 spaces for readability
      await fs.writeFile(historyFilePath, data, 'utf-8');
    } catch (error) {
      console.error('Error writing to search history file:', error);
    }
  }

  // Get the cities from the search history file
  async getCities(): Promise<City[]> {
    return await this.read(); // Call the read method to fetch cities
  }

  // Add a city to the search history
  async addCity(city: string): Promise<void> {
    const cities = await this.read(); // Get existing cities
    const newCity = new City(Date.now().toString(), city); // Create a new city with a unique ID
    cities.push(newCity); // Add the new city to the array
    await this.write(cities); // Save the updated list back to the file
  }

  // Remove a city from the search history by its ID
  async removeCity(id: string): Promise<void> {
    const cities = await this.read(); // Get existing cities
    const updatedCities = cities.filter(city => city.id !== id); // Filter out the city by ID
    await this.write(updatedCities); // Save the updated list back to the file
  }
}

export default new HistoryService();
