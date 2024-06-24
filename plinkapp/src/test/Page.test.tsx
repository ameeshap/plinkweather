import {render, screen } from '@testing-library/react';
import {expect} from 'vitest';




//test location page first 
const mockGeolocation = {
    getCurrentPosition: jest.fn().mockImplementation((success) =>
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
