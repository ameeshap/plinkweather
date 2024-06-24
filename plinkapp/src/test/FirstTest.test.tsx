import { render, screen, waitFor } from '@testing-library/react'
import FirstTest from "../components/card/FirstTest";
import {it, expect, vi} from 'vitest';
import MapCard from '../components/card/MapCard'

//fake test 
it("should have hello world", ()=> {
    render(<FirstTest />)
    const message = screen.queryByText(/Hello World/i)
    expect(message).toBeVisible();
});

const mockGeolocation = {
    getCurrentPosition: vi.fn().mockImplementationOnce((success) =>
      Promise.resolve(
        success({
          coords: {
            latitude: 51.1,
            longitude: 45.3,
          },
        })
      )
    ),
  };

global.navigator.geolocation = mockGeolocation

it('getting more elements in screen', async () => {
    render(<MapCard />)
    const elements = screen.getAllByText(/OpenStreetMap/i);
    expect(elements.length).toBeGreaterThan(0);
  });


it('getting name inside link', async () => {
    render(<MapCard />)
   const linkElement = screen.getByText(/OpenStreetMap/i, { selector: 'a' });
   expect(linkElement).toBeInTheDocument();
});

it('should render the Air Temperature overlay', async () => {
    render(<MapCard />)
    const tempOverlay = await screen.findByText(/Air Temperature/i)
    expect(tempOverlay).toBeInTheDocument()
  })

it('should render the Precipitation overlay', async () => {
    render(<MapCard />)
    const precipOverlay = await screen.findByText(/Precipitation/i)
    expect(precipOverlay).toBeInTheDocument()
  })

it('should render the Clouds overlay', async () => {
    render(<MapCard />)
    const cloudOverlay = await screen.findByText(/Clouds/i)
    expect(cloudOverlay).toBeInTheDocument()
})

it('should render the Windspeed overlay', async () => {
    render(<MapCard />)
    const windOverlay = await screen.findByText(/Windspeed/i)
    expect(windOverlay).toBeInTheDocument()
})

it('should set the user location if geolocation is available', async () => {
    render(<MapCard />)
    await waitFor(() => {
      expect(mockGeolocation.getCurrentPosition).toHaveBeenCalled()
    })
})

it('should show an error if geolocation is not supported', async () => {
    global.navigator.geolocation = undefined
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(<MapCard />)

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Geolocation is not supported by this browser.')
    })
    
    consoleErrorSpy.mockRestore()
})

