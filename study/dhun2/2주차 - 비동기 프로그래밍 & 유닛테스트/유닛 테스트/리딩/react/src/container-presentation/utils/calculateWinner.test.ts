import { calculateWinner } from './calculateWinner';

describe('calculateWinner', () => {
  test('X가 승리 조건을 충족하는 경우', () => {
    const squares = ['X', 'X', 'X', null, null, null, null, null, null];
    expect(calculateWinner(squares)).toBe('X');
  });

  test('O가 승리 조건을 충족하는 경우', () => {
    const squares = [null, null, null, 'O', 'O', 'O', null, null, null];
    expect(calculateWinner(squares)).toBe('O');
  });

  test('승자가 없는 경우', () => {
    const squares = [null, null, null, null, null, null, null, null, null];
    expect(calculateWinner(squares)).toBeNull();
  });
});
