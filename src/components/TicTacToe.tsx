import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RotateCcw } from 'lucide-react';

type Player = 'X' | 'O' | null;

export const TicTacToe = () => {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>('X');
  const [winner, setWinner] = useState<Player | 'tie'>(null);

  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6] // diagonals
  ];

  const checkWinner = (newBoard: Player[]) => {
    for (const combo of winningCombinations) {
      const [a, b, c] = combo;
      if (newBoard[a] && newBoard[a] === newBoard[b] && newBoard[a] === newBoard[c]) {
        return newBoard[a];
      }
    }
    if (newBoard.every(cell => cell !== null)) {
      return 'tie';
    }
    return null;
  };

  const makeMove = (index: number) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
    } else {
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
  };

  const getStatusMessage = () => {
    if (winner === 'tie') return "It's a tie! 🤝";
    if (winner) return `Player ${winner} wins! 🎉`;
    return `Player ${currentPlayer}'s turn`;
  };

  return (
    <div className="flex-1 p-4 flex flex-col items-center justify-center space-y-6">
      <Card className="p-6 w-full max-w-sm">
        <div className="text-center mb-4">
          <h2 className="text-xl font-bold mb-2">Tic Tac Toe</h2>
          <p className="text-muted-foreground">{getStatusMessage()}</p>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4">
          {board.map((cell, index) => (
            <Button
              key={index}
              variant="outline"
              className="w-16 h-16 text-xl font-bold hover:bg-muted"
              onClick={() => makeMove(index)}
              disabled={!!cell || !!winner}
            >
              {cell}
            </Button>
          ))}
        </div>

        <Button
          onClick={resetGame}
          variant="outline"
          className="w-full"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          New Game
        </Button>
      </Card>

      <div className="text-center text-sm text-muted-foreground max-w-xs">
        <p>🎮 Enjoy this quick game while your delicious food is being prepared!</p>
      </div>
    </div>
  );
};