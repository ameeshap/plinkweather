import { create, StateCreator } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import axios from 'axios'
import weatherIcons from './weatherIcons'

// ? Imports for fetching city/state from lat long values
import {
  setDefaults,
  fromLatLng,
  fromAddress,
  OutputFormat,
} from 'react-geocode'

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY
const GOOGLEMAPS_API_KEY = process.env.GOOGLEMAPS_API_KEY

// ? Type definitions for weather forecasts
export type WeatherDay = {
  day: string
  mintemp: number
  maxtemp: number
  precipitation: string
  rainchance: number
}

export type Hour = {
  time: string
  temp: number
  windspeed: number
  precipitation: string
}

// ? Type definitions for location
export type locationData = {
  city: string
  state: string
  lat: number
  long: number
  temp: number
  wind: number
  humidity: number
  feels_like: number
  visibility: number
  currWeath: number
}

type locationState = {
  currentLoc: locationData | null
  locations: locationData[]
  setLocations: (locations: locationData[]) => void
  addLocation: (loc: locationData) => void
  removeLocation: (city: string) => void
  updateLocationData: (city: string) => void
  updateAllLocationData: () => void
  fetchCurrentLocation: () => Promise<locationData>
}

// ? Type definitions for settings
type settingsState = {
  severeWeather: boolean
  setSevereWeather: (s: boolean) => void
}

// ? API fetch definitions for Geocode
setDefaults({
  key: GOOGLEMAPS_API_KEY,
  language: 'en',
  region: 'es',
  outputFormat: OutputFormat.JSON,
})

const fetchWeatherData = async (
  latitude: number,
  longitude: number,
  apiKey: string
) => {
  const API_url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=imperial`
  const response = await fetch(API_url)
  if (!response.ok) {
    throw new Error('Failed to fetch weather data')
  }
  const data = await response.json()
  return data
}

export const fetchCityState = async (latitude: number, longitude: number) => {
  const response = await fromLatLng(latitude, longitude)
  const addressComponents = response.results[0].address_components
  let city = ''
  let state = ''

  for (let component of addressComponents) {
    if (component.types.includes('locality')) {
      city = component.long_name
    }
    if (component.types.includes('administrative_area_level_1')) {
      state = component.short_name
    }
  }
  return { city, state }
}

const fetchLatLngFromCity = async (city: string) => {
  const response = await fromAddress(city)
  const location = response.results[0].geometry.location
  return { latitude: location.lat, longitude: location.lng }
}

export const fetchLocationData = async (
  city?: string,
  latitude?: number,
  longitude?: number
): Promise<locationData> => {
  if (city) {
    console.log('Fetching Lat Lng from City', city)
    const { latitude: lat, longitude: long } = await fetchLatLngFromCity(city)
    console.log('Fetching weather data from City')

    const weatherData = await fetchWeatherData(lat, long, OPENWEATHER_API_KEY!)
    const { city: fetchedCity, state } = await fetchCityState(lat, long)
    return {
      city: fetchedCity,
      state,
      lat,
      long,
      currWeath: weatherData.weather[0].id,
      temp: Math.floor(weatherData.main.temp),
      wind: Math.floor(weatherData.wind.speed),
      humidity: weatherData.main.humidity,
      feels_like: Math.floor(weatherData.main.feels_like),
      visibility: weatherData.visibility,
    }
  } else if (latitude !== undefined && longitude !== undefined) {
    const weatherData = await fetchWeatherData(
      latitude,
      longitude,
      OPENWEATHER_API_KEY!
    )
    const { city, state } = await fetchCityState(latitude, longitude)
    return {
      city,
      state,
      lat: latitude,
      long: longitude,
      currWeath: weatherData.weather[0].id,
      temp: Math.floor(weatherData.main.temp),
      wind: Math.floor(weatherData.wind.speed),
      humidity: weatherData.main.humidity,
      feels_like: Math.floor(weatherData.main.feels_like),
      visibility: weatherData.visibility,
    }
  } else {
    throw new Error('Either latitude/longitude or city name must be provided')
  }
}
export const fetchHourlyWeatherData = async (
  latitude: number,
  longitude: number
) => {
  try {
    const response = await axios.get(
      `https://pro.openweathermap.org/data/2.5/forecast/hourly?lat=${latitude}&lon=${longitude}&cnt=24&units=imperial&appid=${process.env.OPENWEATHER_API_KEY}`
    )

    const transformedData: Hour[] = []

    for (let i = 0; i < 24; i++) {
      transformedData.push({
        time: new Date(response.data.list[i].dt * 1000).toLocaleTimeString([], {
          hour: 'numeric',
          minute: '2-digit',
        }),
        temp: response.data.list[i].main.temp,
        windspeed: response.data.list[i].wind.speed,
        precipitation: weatherIcons.get(
          response.data.list[i].weather[0].id
        ) as string,
      })
    }

    return transformedData
  } catch (error) {
    throw new Error('Failed to fetch weather data')
  }
}
export const fetchWeeklyWeatherData = async (
  latitude: number,
  longitude: number
) => {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast/daily?lat=${latitude}&lon=${longitude}&cnt=8&units=imperial&appid=${process.env.OPENWEATHER_API_KEY}`
    )

    const transformedData: WeatherDay[] = []

    for (let i = 1; i < 8; i++) {
      transformedData.push({
        day: new Date(response.data.list[i].dt * 1000).toLocaleDateString(
          'en-US',
          { weekday: 'long' }
        ),
        mintemp: Math.floor(response.data.list[i].temp.min),
        maxtemp: Math.floor(response.data.list[i].temp.max),
        precipitation: weatherIcons.get(
          response.data.list[i].weather[0].id
        ) as string,
        rainchance: response.data.list[i].rain || 0,
      })
    }

    return transformedData
  } catch (error) {
    throw new Error('Failed to fetch weather data')
  }
}

const locationStore: StateCreator<
  locationState,
  [['zustand/persist', unknown]]
> = (set, get) => ({
  locations: [],
  currentLoc: null,
  setLocations: (locations: locationData[]) => set({ locations }),
  addLocation: (loc: locationData) =>
    set((state) => ({ locations: [...state.locations, loc] })),
  removeLocation: (city: string) =>
    set((state) => ({
      locations: state.locations.filter((location) => location.city !== city),
    })),
  updateLocationData: async (city: string) => {
    const state = get()
    const location = state.locations.find((location) => location.city === city)
    if (!location) return

    try {
      const data = await fetchWeatherData(
        location.lat,
        location.long,
        OPENWEATHER_API_KEY!
      )
      const updatedLocation = {
        ...location,
        temp: Math.floor(data.main.temp),
        humidity: data.main.humidity,
        feels_like: Math.floor(data.main.feels_like),
        wind: Math.floor(data.wind.speed),
        visibility: data.visibility,
      }

      set({
        locations: state.locations.map((loc) =>
          loc.city === city ? updatedLocation : loc
        ),
      })
    } catch (error) {
      console.error('Error:', error)
    }
  },
  updateAllLocationData: async () => {
    const state = get()
    const updatedLocations = await Promise.all(
      state.locations.map(async (location) => {
        try {
          const data = await fetchWeatherData(
            location.lat,
            location.long,
            OPENWEATHER_API_KEY!
          )
          return {
            ...location,
            temp: Math.floor(data.main.temp),
            humidity: data.main.humidity,
            feels_like: Math.floor(data.main.feels_like),
            wind: Math.floor(data.wind.speed),
            visibility: data.visibility,
          }
        } catch (error) {
          console.error('Error:', error)
          return location // Return the current location data in case of an error
        }
      })
    )

    set({ locations: updatedLocations })
  },
  fetchCurrentLocation: async (): Promise<locationData> => {
    return new Promise((resolve, _) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords

            try {
              const currentLocation = await fetchLocationData(
                undefined,
                latitude,
                longitude
              )
              set({ currentLoc: currentLocation })
              resolve(currentLocation)
            } catch (error) {
              console.error('Error:', error)
            }
          },
          (error) => {
            console.error('Error getting geolocation: ', error)
          }
        )
      }
    })
  },
})

const useLocationStore = create(
  persist(locationStore, {
    name: 'location-storage', // unique name
    storage: createJSONStorage(() => localStorage), // use localStorage
  })
)

const settingsStore: StateCreator<
  settingsState,
  [['zustand/persist', unknown]]
> = (set, _) => ({
  severeWeather: false,
  setSevereWeather: (s: boolean) => set({ severeWeather: s }),
})

const useSettingsStore = create(
  persist(settingsStore, {
    name: 'settings-storage', // unique name
    storage: createJSONStorage(() => localStorage), // use localStorage
  })
)

export default useLocationStore
export { useSettingsStore }
