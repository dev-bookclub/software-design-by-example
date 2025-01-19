import { useState } from 'react';
import { calculateWinner } from '../model/calculateWinner';

export const useGame = () => {
  const [history, setHistory] = useState<(string | null)[][]>(() => [
    Array(9).fill(null),
  ]);
  const [currentMove, setCurrentMove] = useState<number>(0);

  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const winner = calculateWinner(currentSquares);

  const handlePlay = (nextSquares: (string | null)[]): void => {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  };

  const jumpTo = (move: number): void => {
    setCurrentMove(move);
  };

  const status = winner
    ? `Winner: ${winner}`
    : `Next player: ${xIsNext ? 'X' : 'O'}`;

  return {
    currentSquares,
    status,
    handlePlay,
    jumpTo,
    xIsNext,
  };
};
