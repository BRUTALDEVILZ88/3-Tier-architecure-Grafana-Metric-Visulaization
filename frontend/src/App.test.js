import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import axios from 'axios';

jest.mock('axios');

test('renders backend response', async () => {

  axios.get.mockResolvedValue({
    data: {
      message: '🚀 Backend connected successfully!',
      app: 'ECS DevOps Demo',
      status: 'healthy',
      timestamp: '27/05/2026'
    }
  });

  render(<App />);

  await waitFor(() => {

    expect(
      screen.getByText(/Backend connected successfully!/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/ECS DevOps Demo/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/healthy/i)
    ).toBeInTheDocument();

  });
});