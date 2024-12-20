import dotenv from 'dotenv';
dotenv.config();

// Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

// Define a class for the Weather object
class Weather {
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;

  constructor(temperature: number, description: string, humidity: number, windSpeed: number) {
      this.temperature = temperature;
      this.description = description;
      this.humidity = humidity;
      this.windSpeed = windSpeed;
  }
}


// Complete the WeatherService class
class WeatherService {
  private baseURL = 'https://api.openweathermap.org';
  private apiKey = process.env.API_KEY || '';
  private cityName: string = '';

  // Create fetchLocationData method
  private async fetchLocationData(query: string): Promise<any> {
    const url = this.buildGeocodeQuery(query);  // Use the buildGeocodeQuery method
    console.log("url", url);
    try{
      const response = await fetch(url);
      const data = await response.json();
      console.log("data", data);
      return await response.json();
    }
    catch(error){
      console.error("Fetch locationData error", error);
    }
  }

  // Create destructureLocationData method
  private destructureLocationData(locationData: any): Coordinates {
    return {
      lat: locationData[0].lat,
      lon: locationData[0].lon,
    };
  }

  // Create buildGeocodeQuery method
  private buildGeocodeQuery(query: string): string {
    return `${this.baseURL}/geo/1.0/direct?q=${query}&appid=${this.apiKey}`;
  }

  // Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}&units=metric`;
  }

  // Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData(): Promise<Coordinates> {
    const locationData = await this.fetchLocationData(this.cityName);
    return this.destructureLocationData(locationData);
  }

  // Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const query = this.buildWeatherQuery(coordinates);
    const response = await fetch(query);
    return await response.json();
  }

  // Build parseCurrentWeather method
  private parseCurrentWeather(response: any): Weather {
    return new Weather(
      response.main.temp,
      response.weather[0].description,
      response.main.humidity,
      response.wind.speed
    );
  }

  // Complete buildForecastArray method (Use it when fetching forecast data)
  private buildForecastArray(weatherData: any[]): Weather[] {
    return weatherData.map((data: any) => {
      return new Weather(
        data.main.temp,
        data.weather[0].description,
        data.main.humidity,
        data.wind.speed
      );
    });
  }

  // New method to get forecast data
  private async fetchWeatherForecast(coordinates: Coordinates): Promise<Weather[]> {
    const forecastQuery = `${this.baseURL}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}&units=metric`;
    const response = await fetch(forecastQuery);
    const forecastData = await response.json();
    return this.buildForecastArray(forecastData.list);
  }

  // Complete getWeatherForCity method (Use it to fetch current weather data)
  async getWeatherForCity(city: string): Promise<Weather> {
    try {
      this.cityName = city;
      const coordinates = await this.fetchAndDestructureLocationData();
      const weatherData = await this.fetchWeatherData(coordinates);
      return this.parseCurrentWeather(weatherData);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw new Error('Unable to retrieve weather data');
    }
  }

  // New method to get weather forecast for the city
  async getWeatherForecastForCity(city: string): Promise<Weather[]> {
    try {
      this.cityName = city;
      const coordinates = await this.fetchAndDestructureLocationData();
      const forecastData = await this.fetchWeatherForecast(coordinates);
      return forecastData;
    } catch (error) {
      console.error('Error fetching weather forecast:', error);
      throw new Error('Unable to retrieve weather forecast');
    }
  }
}

export default new WeatherService();
