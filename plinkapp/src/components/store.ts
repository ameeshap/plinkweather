import { create, StateCreator } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

// ? Imports for fetching city/state from lat long values
import {
  setDefaults,
  fromLatLng,
  fromAddress,
  OutputFormat,
} from 'react-geocode'

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

// ? SVG code definitions
export const weatherIcons = new Map<number, string>()

const weatherIconsDef: { [key: number]: string } = {
  200: '../src/assets/cloud_lightning_heavyrain.svg',
  201: '../src/assets/cloud_lightning_heavyrain.svg',
  202: '../src/assets/cloud_lightning_heavyrain.svg',
  210: '../src/assets/cloud_lightning_heavyrain.svg',
  211: '../src/assets/cloud_lightning_heavyrain.svg',
  212: '../src/assets/cloud_lightning_heavyrain.svg',
  221: '../src/assets/cloud_lightning_heavyrain.svg',
  230: '../src/assets/cloud_lightning_heavyrain.svg',
  231: '../src/assets/cloud_lightning_heavyrain.svg',
  232: '../src/assets/cloud_lightning_heavyrain.svg',
  300: '../src/assets/3_waterdrop.svg',
  301: '../src/assets/3_waterdrop.svg',
  302: '../src/assets/3_waterdrop.svg',
  310: '../src/assets/3_waterdrop.svg',
  311: '../src/assets/3_waterdrop.svg',
  312: '../src/assets/3_waterdrop.svg',
  313: '../src/assets/3_waterdrop.svg',
  314: '../src/assets/3_waterdrop.svg',
  321: '../src/assets/3_waterdrop.svg',
  500: '../src/assets/cloud_sing_waterdrop.svg',
  501: '../src/assets/cloud_sing_waterdrop.svg',
  502: '../src/assets/cloud_heavyrain.svg',
  503: '../src/assets/cloud_heavyrain.svg',
  504: '../src/assets/cloud_heavyrain.svg',
  511: '../src/assets/cloud_heavyrain.svg',
  520: '../src/assets/cloud_sing_waterdrop.svg',
  521: '../src/assets/cloud_sing_waterdrop.svg',
  522: '../src/assets/cloud_heavyrain.svg',
  531: '../src/assets/cloud_heavyrain.svg',
  600: '../src/assets/cloud_sing_snowflake.svg',
  601: '../src/assets/cloud_sing_snowflake.svg',
  602: '../src/assets/cloud_3_snowflake.svg',
  611: '../src/assets/cloud_3_snowflake.svg',
  612: '../src/assets/cloud_sing_snowflake.svg',
  613: '../src/assets/cloud_3_snowflake.svg',
  615: '../src/assets/cloud_sing_snowflake.svg',
  616: '../src/assets/cloud_sing_snowflake.svg',
  620: '../src/assets/cloud_sing_snowflake.svg',
  621: '../src/assets/cloud_3_snowflake.svg',
  622: '../src/assets/cloud_3_snowflake.svg',
  701: '../src/assets/waves.svg',
  711: '../src/assets/waves.svg',
  721: '../src/assets/waves.svg',
  731: '../src/assets/waves.svg',
  741: '../src/assets/waves.svg',
  751: '../src/assets/waves.svg',
  761: '../src/assets/waves.svg',
  762: '../src/assets/waves.svg',
  771: '../src/assets/waves.svg',
  781: '../src/assets/tornado.svg',
  800: '../src/assets/full_sun.svg',
  801: '../src/assets/cloud_sun.svg',
  802: '../src/assets/cloud_sun.svg',
  803: '../src/assets/cloud_sun.svg',
  804: '../src/assets/cloud.svg',
}

Object.entries(weatherIconsDef).forEach(([key, value]) => {
  weatherIcons.set(parseInt(key), value)
})

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

const fetchLatLngFromCity = async (city: string) => {
  const response = await fromAddress(city)
  const location = response.results[0].geometry.location
  return { latitude: location.lat, longitude: location.lng }
}

const fetchLocationData = async (
  latitude?: number,
  longitude?: number,
  city?: string
): Promise<locationData> => {
  let lat: number
  let long: number
  let cityState: { city: string; state: string }

  if (latitude !== undefined && longitude !== undefined) {
    lat = latitude
    long = longitude
    cityState = await fetchCityState(lat, long)
  } else if (city) {
    const location = await fetchLatLngFromCity(city)
    lat = location.latitude
    long = location.longitude
    cityState = { city, state: '' } // You might want to fetch the state as well
  } else {
    throw new Error('Either latitude/longitude or city must be provided')
  }

  const weatherData = await fetchWeatherData(lat, long, OPENWEATHER_API_KEY!)
  return {
    city: cityState.city,
    state: cityState.state,
    lat,
    long,
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
    return new Promise((resolve, _) => {
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
