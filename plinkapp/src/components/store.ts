import { create, StateCreator } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

// ? Imports for fetching city/state from lat long values
import { setDefaults, fromLatLng, OutputFormat } from 'react-geocode'

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY
const GOOGLEMAPS_API_KEY = process.env.GOOGLEMAPS_API_KEY

// ? Type definitions
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
}

type locationState = {
  currentLoc: locationData | null
  locations: locationData[]
  setLocations: (locations: locationData[]) => void
  addLocation: (loc: locationData) => void
  removeLocation: (city: string) => void
  updateLocationData: (city: string) => void
  updateAllLocationData: () => void
  fetchCurrentLocation: () => Promise<locationData | null>
}

// ? Function Definitions
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

const fetchCityState = async (latitude: number, longitude: number) => {
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

const fetchLocationData = async (
  latitude: number,
  longitude: number
): Promise<locationData> => {
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
    temp: Math.floor(weatherData.main.temp),
    wind: Math.floor(weatherData.wind.speed),
    humidity: weatherData.main.humidity,
    feels_like: Math.floor(weatherData.main.feels_like),
    visibility: weatherData.visibility,
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
  fetchCurrentLocation: async (): Promise<locationData | null> => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords

            try {
              const currentLocation = await fetchLocationData(
                latitude,
                longitude
              )
              set({ currentLoc: currentLocation })
              resolve(currentLocation)
            } catch (error) {
              console.error('Error:', error)
              resolve(null)
            }
          },
          (error) => {
            console.error('Error getting geolocation: ', error)
            resolve(null)
          }
        )
      } else {
        console.error('Geolocation is not supported by this browser.')
        resolve(null)
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

export default useLocationStore
