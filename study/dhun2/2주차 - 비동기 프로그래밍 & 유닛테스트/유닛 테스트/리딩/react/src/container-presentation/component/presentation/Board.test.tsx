import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Board from './Board';

describe('Board Component', () => {
  const squares = Array(9).fill(null);
  const handleSquareClick = vi.fn();

  it('renders the board with the correct status', () => {
    render(
      <Board
        squares={squares}
        onSquareClick={handleSquareClick}
        status="Next player: X"
      />
    );

    const status = screen.getByText('Next player: X');
    expect(status).toBeInTheDocument();
  });

  it('calls onSquareClick when a square is clicked', async () => {
    render(
      <Board
        squares={squares}
        onSquareClick={handleSquareClick}
        status="Next player: X"
      />
    );

    const buttons = screen.getAllByRole('button');
    await userEvent.click(buttons[0]);

    expect(handleSquareClick).toHaveBeenCalledWith(0);
  });
});
