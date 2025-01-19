import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Square from './Square';

describe('Square Component', () => {
  it('renders the correct value', () => {
    render(<Square value="X" onSquareClick={() => {}} />);
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('X');
  });

  it('calls the onSquareClick function when clicked', async () => {
    const onSquareClick = vi.fn();
    render(<Square value={null} onSquareClick={onSquareClick} />);

    const button = screen.getByRole('button');
    await userEvent.click(button);

    expect(onSquareClick).toHaveBeenCalledOnce();
  });
});
