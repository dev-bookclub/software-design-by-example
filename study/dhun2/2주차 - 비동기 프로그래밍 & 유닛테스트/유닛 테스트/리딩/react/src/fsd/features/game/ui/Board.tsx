import React from 'react';
import Square from './Square';

interface BoardProps {
  squares: (string | null)[];
  onSquareClick: (i: number) => void;
  status: string;
}

const Board: React.FC<BoardProps> = ({ squares, onSquareClick, status }) => {
  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        {squares.slice(0, 3).map((value, i) => (
          <Square
            key={i}
            value={value}
            onSquareClick={() => onSquareClick(i)}
          />
        ))}
      </div>
      <div className="board-row">
        {squares.slice(3, 6).map((value, i) => (
          <Square
            key={i + 3}
            value={value}
            onSquareClick={() => onSquareClick(i + 3)}
          />
        ))}
      </div>
      <div className="board-row">
        {squares.slice(6, 9).map((value, i) => (
          <Square
            key={i + 6}
            value={value}
            onSquareClick={() => onSquareClick(i + 6)}
          />
        ))}
      </div>
    </>
  );
};

export default Board;
