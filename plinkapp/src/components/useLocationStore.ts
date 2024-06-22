import { create, StateCreator } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export type locationData = {
  city: string
  state: string
  lat: string
  long: string
}

type LocationState = {
  locations: locationData[]
  setLocations: (locations: locationData[]) => void
}

const locationStore: StateCreator<
  LocationState,
  [['zustand/persist', unknown]]
> = (set) => ({
  locations: [],
  setLocations: (locations: locationData[]) => set({ locations }),
})

export const useLocationStore = create(
  persist(locationStore, {
    name: 'locations-store',
    storage: createJSONStorage(() => localStorage),
  })
)
