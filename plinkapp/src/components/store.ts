import { create, StateCreator } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY

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
}

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
})

const useLocationStore = create(
  persist(locationStore, {
    name: 'location-storage', // unique name
    storage: createJSONStorage(() => localStorage), // use localStorage
  })
)

export default useLocationStore
