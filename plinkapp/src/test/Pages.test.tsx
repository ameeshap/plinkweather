import { render, screen, waitFor, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import ErrorPage from '@/pages/ErrorPage';
import LocationPage from '@/pages/LocationPage';
import MapPage from '@/pages/MapPage';
import { Loader } from '@googlemaps/js-api-loader'
import SearchPage from '@/pages/SearchPage';
import SettingsPage from '@/pages/SettingsPage';
import { BrowserRouter as Router } from 'react-router-dom'

/* Error Page */
// Mock the Navbar component if necessary
vi.mock('@/components/Navbar', () => ({
  default: () => <div>Mocked Navbar</div>
}));

describe('ErrorPage', () => {
  it('should render the error message', () => {
    render(<ErrorPage />);
    const errorMessage = screen.getByText('Error 404: Page Not Found!');
    expect(errorMessage).toBeInTheDocument();
  });
})

/* Location Page */

// Mock the components if necessary
it('should render the loading state initially', () => {
      render(<LocationPage currentLoc={true} />);
      expect(screen.getByText('Loading...')).toBeInTheDocument();
});


it('should render error message if current location is not fetched', async () => {
    render(<LocationPage currentLoc={true} />);
    await waitFor(() => expect(screen.getByText('Error: Could not fetch current location')).toBeInTheDocument());
});


//Mock the components if necessary
const mockGeolocation = {
    getCurrentPosition: vi.fn().mockImplementation((success) =>
      Promise.resolve(
        success({
          coords: {
            latitude: 40.7128,
            longitude: -74.0060,
          },
        })
      )
    ),
  };

// Mock the MapPage component
vi.mock('@/components/card/MapCard', () => {
    return {
        default: () => <div>MapCard</div>,
      };
});
  
  describe('MapPage', () => {
    it('should render MapCard and Navbar with the correct props', () => {
      render(<MapPage />);
  
      // Check if MapCard is rendered
      expect(screen.getByText('MapCard')).toBeInTheDocument();
  
      // Check if Navbar is rendered with the correct 'selected' prop
    });
  });

/* Search Page tests */

vi.mock('@googlemaps/js-api-loader', () => {
  return {
    Loader: vi.fn().mockImplementation(() => {
      return {
        importLibrary: vi.fn().mockResolvedValue(true),
      }
    }),
  }
})

vi.mock('@googlemaps/js-api-loader', () => {
    return {
      Loader: vi.fn().mockImplementation(() => {
        return {
          importLibrary: vi.fn().mockResolvedValue(true),
        }
      }),
    }
  })
  
  describe('SearchPage', () => {
    beforeEach(() => {
      vi.clearAllMocks()
    })
  
    it('renders the SearchPage component correctly', async () => {
      render(
        <Router>
          <SearchPage />
        </Router>
      )
      screen.debug();

      expect(screen.getByText(/Loading.../i)).toBeInTheDocument()
    })
  
    it('loads Google Maps library', async () => {
      render(
        <Router>
          <SearchPage />
        </Router>
      )
  
      expect(Loader).toHaveBeenCalledWith({
        apiKey: process.env.GOOGLEMAPS_API_KEY,
        version: 'weekly',
        libraries: ['places'],
      })
    })
    
    /*
    it('handles search input correctly', async () => {
      render(
        <Router>
          <SearchPage />
        </Router>
      )
  
      const input = screen.getByPlaceholderText(/Search City or Address/i)
      console.log("the input is: " + input)
      fireEvent.change(input, { target: { value: 'Houston' } })
  
      expect(input).toHaveValue('Houston')
    })
    */
  
    
    /*
    it('displays search suggestions', async () => {
      render(
        <Router>
          <SearchPage />
        </Router>
      )
  
      const input = screen.getByPlaceholderText(/Search City or Address/i)
      fireEvent.change(input, { target: { value: 'New York' } })
  
      // Simulate suggestions from Google Places API
      const suggestions = screen.getByRole('list')
      expect(suggestions).toBeInTheDocument()
    })
    */
  
    /*
    it('handles location selection', async () => {
      const mockOnSelect = vi.fn()
  
      render(
        <Router>
          <SearchPage />
        </Router>
      )
  
      //const input = screen.getByPlaceholderText(/Search City or Address/i)
      //fireEvent.change(input, { target: { value: 'New York' } })
  
      // Simulate clicking on a suggestion
     // const suggestion = screen.getByText('New York')
     // fireEvent.click(suggestion)
  
     // expect(mockOnSelect).toHaveBeenCalledWith({ lat: expect.any(Number), lng: expect.any(Number) })
    }) */
})

 