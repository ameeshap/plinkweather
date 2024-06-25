import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { describe, it, expect, vi } from 'vitest'
import Banner from '../components/Banner'
import FeatureWeatherCard from '@/components/FeatureWeatherCard'
import HourlyForecast, { Hour } from '@/components/HourlyForecast'
import HourlyWeather from '@/components/HourlyForecastBack'
import WeatherCard from '@/components/LocationCard'
import { BrowserRouter as Router } from 'react-router-dom'
import Navbar from '../components/Navbar'
import WeeklyForecast, { WeatherDay } from '@/components/WeeklyForecastFront'
import WeeklyWeather from '@/components/WeeklyForecastBack'

//Banner test
describe('Banner Component', () => {
  test('renders the message correctly', () => {
    render(<Banner message="Test Message" type="success" onClose={() => {}} />)
    expect(screen.getByText('Test Message')).toBeInTheDocument()
  })

  test('applies the correct class based on type', () => {
    const { container } = render(
      <Banner message="Success Message" type="success" onClose={() => {}} />
    )
    expect(container.firstChild).toHaveClass('banner success')

    const { container: errorContainer } = render(
      <Banner message="Error Message" type="error" onClose={() => {}} />
    )
    expect(errorContainer.firstChild).toHaveClass('banner error')
  })

  test('calls onClose when the button is clicked', () => {
    const onCloseMock = vi.fn()
    render(<Banner message="Close Test" type="success" onClose={onCloseMock} />)

    fireEvent.click(screen.getByText('X'))
    expect(onCloseMock).toHaveBeenCalledTimes(1)
  })
})

//FeatureWeatherCard Component test
describe('FeatureWeatherCard Component', () => {
  test('renders the condition and value correctly', () => {
    render(
      <FeatureWeatherCard
        condition="Sunny"
        value="25°C"
        img_src="path/to/sunny.png"
        left="10px"
        top="20px"
        color="bg-yellow-500"
      />
    )

    expect(screen.getByText('Sunny')).toBeInTheDocument()
    expect(screen.getByText('25°C')).toBeInTheDocument()
  })

  test('applies styles and classes correctly', () => {
    const { container } = render(
      <FeatureWeatherCard
        condition="Sunny"
        value="25°C"
        img_src="path/to/sunny.png"
        left="10px"
        top="20px"
        color="bg-yellow-500"
      />
    )

    const cardElement = container.firstChild
    expect(cardElement).toHaveClass(
      'card items-center justify-center shadow-xl bg-yellow-500'
    )
    expect(cardElement).toHaveStyle({
      position: 'absolute',
      width: '168px',
      height: '143px',
      left: '10px',
      top: '20px',
      borderRadius: '20px',
    })
  })

  test('renders the image correctly', () => {
    render(
      <FeatureWeatherCard
        condition="Sunny"
        value="25°C"
        img_src="path/to/sunny.png"
        left="10px"
        top="20px"
        color="bg-yellow-500"
      />
    )

    const imgElement = screen.getByRole('img')
    expect(imgElement).toHaveAttribute('src', 'path/to/sunny.png')
    expect(imgElement).toHaveStyle({
      width: '35px',
      height: '35px',
    })
  })
})

//hourly weather forecast

const mockData: Hour[] = [
  {
    time: '12:00 PM',
    temp: 70,
    windspeed: 10,
    precipitation: 'clear.svg',
  },
  // Add more mock data if needed
]

test('renders hourly forecast data', () => {
  render(<HourlyForecast hours={mockData} />)
  screen.debug

  expect(screen.getByText(/12:00 PM/i)).toBeInTheDocument()
  expect(screen.getByText(/70°F/i)).toBeInTheDocument()
  expect(screen.getByText(/10 mph/i)).toBeInTheDocument()
})

describe('WeatherCard', () => {
  const mockProps = {
    city: 'New York',
    temp: 75,
    img_src: 'https://example.com/weather-icon.png',
  }
  test('renders city name', () => {
    render(<WeatherCard {...mockProps} />)
    const cityElement = screen.getByText(/new york/i)
    expect(cityElement).toBeInTheDocument()
  })
  test('renders temperature', () => {
    render(<WeatherCard {...mockProps} />)
    const tempElement = screen.getByText(/75 °/i)
    expect(tempElement).toBeInTheDocument()
  })
  test('renders image with correct src', () => {
    render(<WeatherCard {...mockProps} />)
    const imgElement = screen.getByRole('img')
    expect(imgElement).toHaveAttribute('src', mockProps.img_src)
  })
  test('applies correct styles', () => {
    render(<WeatherCard {...mockProps} />)
    const cardElement = screen.getByText(/new york/i).closest('div')
    expect(cardElement).toHaveStyle({
      position: 'absolute',
      width: '320px',
      height: '292px',
      top: '98px',
      boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
      borderRadius: '20px',
    })
  })
})

describe('Navbar', () => {
  const renderNavbar = (selected) => {
    render(
      <Router>
        <Navbar selected={selected} />
      </Router>
    )
  }
  test('renders navigation icons', () => {
    renderNavbar()
    expect(screen.getByRole('link', { name: /location/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /search/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /earth/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /settings/i })).toBeInTheDocument()
  })

  test('renders selected indicator for current location', () => {
    renderNavbar('currentLoc')
    expect(screen.getAllByRole('img', { hidden: true })).toHaveLength(1) // For the GoDotFill icon
  })
  test('renders selected indicator for search', () => {
    renderNavbar('search')
    expect(screen.getAllByRole('img', { hidden: true })).toHaveLength(1) // For the GoDotFill icon
  })
  test('renders selected indicator for map', () => {
    renderNavbar('map')
    expect(screen.getAllByRole('img', { hidden: true })).toHaveLength(1) // For the GoDotFill icon
  })
  test('renders selected indicator for settings', () => {
    renderNavbar('settings')
    expect(screen.getAllByRole('img', { hidden: true })).toHaveLength(1) // For the GoDotFill icon
  })
})

vi.mock('axios')

// Mock navigator.geolocation
const mockGeolocation = {
  getCurrentPosition: vi.fn(),
}
global.navigator.geolocation = mockGeolocation

describe('WeeklyWeather', () => {
  beforeEach(() => {
    mockGeolocation.getCurrentPosition.mockClear()
    axios.get.mockClear()
  })
  test('renders loading state initially', () => {
    render(<WeeklyWeather />)
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })
  test('renders error message if geolocation fails', async () => {
    mockGeolocation.getCurrentPosition.mockImplementationOnce(
      (success, error) => error({ message: 'Geolocation error' })
    )
    render(<WeeklyWeather />)
    await waitFor(() => {
      expect(screen.getByText(/geolocation error/i)).toBeInTheDocument()
    })
  })
  test('renders error message if API request fails', async () => {
    mockGeolocation.getCurrentPosition.mockImplementationOnce((success) =>
      success({ coords: { latitude: 40.7128, longitude: -74.006 } })
    )
    axios.get.mockRejectedValueOnce(new Error('API error'))
    render(<WeeklyWeather />)
    await waitFor(() => {
      expect(
        screen.getByText(/failed to fetch weather data/i)
      ).toBeInTheDocument()
    })
  })
  test('renders forecast data on successful fetch', async () => {
    mockGeolocation.getCurrentPosition.mockImplementationOnce((success) =>
      success({ coords: { latitude: 40.7128, longitude: -74.006 } })
    )
    axios.get.mockResolvedValueOnce({
      data: {
        list: [
          {},
          {
            dt: 1625155200,
            temp: { min: 70, max: 85 },
            weather: [{ id: 800 }],
            rain: 0,
          },
          {
            dt: 1625241600,
            temp: { min: 72, max: 88 },
            weather: [{ id: 801 }],
            rain: 10,
          },
          // Add more mock data for the remaining days
        ],
      },
    })
    render(<WeeklyWeather />)
    await waitFor(() => {
      expect(screen.getByText(/monday/i)).toBeInTheDocument()
      expect(screen.getByText(/70/i)).toBeInTheDocument()
      expect(screen.getByText(/85/i)).toBeInTheDocument()
    })
  })
})

describe('WeeklyForecast', () => {
  const mockForecast: WeatherDay[] = [
    {
      day: 'Monday',
      mintemp: 70,
      maxtemp: 85,
      precipitation: 'https://example.com/weather-icon.png',
      rainchance: 10,
    },
    {
      day: 'Tuesday',
      mintemp: 72,
      maxtemp: 88,
      precipitation: 'https://example.com/weather-icon.png',
      rainchance: 20,
    },
    // Add more mock data as needed
  ]
  test('renders forecast days', () => {
    render(<WeeklyForecast forecast={mockForecast} />)
    expect(screen.getByText('Monday')).toBeInTheDocument()
    expect(screen.getByText('Tuesday')).toBeInTheDocument()
  })
  test('renders temperatures', () => {
    render(<WeeklyForecast forecast={mockForecast} />)
    expect(screen.getByText('Low: 70°F')).toBeInTheDocument()
    expect(screen.getByText('High: 85°F')).toBeInTheDocument()
    expect(screen.getByText('Low: 72°F')).toBeInTheDocument()
    expect(screen.getByText('High: 88°F')).toBeInTheDocument()
  })
  test('renders precipitation icons', () => {
    render(<WeeklyForecast forecast={mockForecast} />)
    const icons = screen.getAllByAltText('weather icon')
    expect(icons).toHaveLength(mockForecast.length)
    icons.forEach((icon, index) => {
      expect(icon).toHaveAttribute('src', mockForecast[index].precipitation)
    })
  })
  test('renders rain chances', () => {
    render(<WeeklyForecast forecast={mockForecast} />)
    expect(screen.getByText('10%')).toBeInTheDocument()
    expect(screen.getByText('20%')).toBeInTheDocument()
  })
})
