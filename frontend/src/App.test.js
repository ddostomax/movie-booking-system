import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the home page heading', () => {
  render(<App />);
  const heading = screen.getByRole('heading', { name: /now playing/i });
  expect(heading).toBeInTheDocument();
});
