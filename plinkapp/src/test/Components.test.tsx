import { render, screen, waitFor, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import Banner from '../components/Banner';
import FeatureWeatherCard from '@/components/FeatureWeatherCard';
import HourlyForecast, { Hour } from '@/components/HourlyForecastFront';
import HourlyWeather from '@/components/HourlyForecastBack';


//Banner test 
describe('Banner Component', () => {
  test('renders the message correctly', () => {
    render(<Banner message="Test Message" type="success" onClose={() => {}} />);
    expect(screen.getByText('Test Message')).toBeInTheDocument();
  });

  test('applies the correct class based on type', () => {
    const { container } = render(<Banner message="Success Message" type="success" onClose={() => {}} />);
    expect(container.firstChild).toHaveClass('banner success');

    const { container: errorContainer } = render(<Banner message="Error Message" type="error" onClose={() => {}} />);
    expect(errorContainer.firstChild).toHaveClass('banner error');
  });

  test('calls onClose when the button is clicked', () => {
    const onCloseMock = vi.fn();
    render(<Banner message="Close Test" type="success" onClose={onCloseMock} />);

    fireEvent.click(screen.getByText('X'));
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });
});

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
      );
  
      expect(screen.getByText('Sunny')).toBeInTheDocument();
      expect(screen.getByText('25°C')).toBeInTheDocument();
    });
  
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
      );
  
      const cardElement = container.firstChild;
      expect(cardElement).toHaveClass('card items-center justify-center shadow-xl bg-yellow-500');
      expect(cardElement).toHaveStyle({
        position: 'absolute',
        width: '168px',
        height: '143px',
        left: '10px',
        top: '20px',
        borderRadius: '20px',
      });
    });
  
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
      );
  
      const imgElement = screen.getByRole('img');
      expect(imgElement).toHaveAttribute('src', 'path/to/sunny.png');
      expect(imgElement).toHaveStyle({
        width: '35px',
        height: '35px',
      });
    });
});


//hourly weather forecast 


const mockData: Hour[] = [
    {
      time: '12:00 PM',
      temp: 70,
      windspeed: 10,
      precipitation: 'clear.svg'
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