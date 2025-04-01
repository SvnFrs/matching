import { useState } from "react";

function App() {
  interface Card {
    id: number;
    content: string;
  }

  const cards = [
    { id: 1, content: "🍉" },
    { id: 2, content: "🍉" },
    { id: 3, content: "🍌" },
    { id: 4, content: "🍌" },
    { id: 5, content: "🍇" },
    { id: 6, content: "🍇" },
    { id: 7, content: "🍓" },
    { id: 8, content: "🍓" },
    { id: 9, content: "🍒" },
    { id: 10, content: "🍒" },
    { id: 11, content: "🍑" },
    { id: 12, content: "🍑" },
  ] as Card[];

  const FLIP_DELAY = 500;
  // Define max number of flips (each pair counts as 2 flips)
  const MAX_FLIPS = 30;

  const [selectedCards, setSelectedCards] = useState<Card[]>([]);
  const [matchedCards, setMatchedCards] = useState<number[]>([]);
  const [flipsRemaining, setFlipsRemaining] = useState<number>(MAX_FLIPS);
  const [gameOver, setGameOver] = useState<boolean>(false);

  const [_, setTimeoutId] = useState<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const shuffleCards = (array: Card[]) => {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      // Generate random index between 0 and i
      const j = Math.floor(Math.random() * (i + 1));
      // Swap elements at i and j
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ];
    }
    return shuffledArray;
  };

  const isCardMatched = (card: Card) => {
    return matchedCards.includes(card.id);
  };

  const isCardSelected = (card: Card) => {
    return (
      selectedCards.some((selectedCard) => selectedCard.id === card.id) &&
      !matchedCards.includes(card.id)
    );
  };

  const areMismatched = () => {
    return (
      selectedCards.length === 2 &&
      selectedCards[0].content !== selectedCards[1].content
    );
  };

  const getCardColor = (card: Card) => {
    if (isCardMatched(card)) {
      return "bg-green-200 hover:bg-green-100"; // Matched cards
    } else if (isCardSelected(card) && areMismatched()) {
      return "bg-red-200 hover:bg-red-100"; // Mismatched cards
    } else if (isCardSelected(card)) {
      return "bg-yellow-200 hover:bg-yellow-100"; // Selected but not yet determined
    } else {
      return "bg-blue-200 hover:bg-blue-100"; // Unknown/hidden cards
    }
  };

  const handleSelectCard = (card: Card) => {
    // Don't allow interaction if game is over or no flips remaining
    if (gameOver || flipsRemaining <= 0) return;

    // Don't allow selecting matched cards or already selected cards
    if (matchedCards.includes(card.id)) return;
    if (selectedCards.some((selectedCard) => selectedCard.id === card.id))
      return;
    if (selectedCards.length >= 2) return;

    // Decrease flip count
    setFlipsRemaining(flipsRemaining - 1);

    setSelectedCards([...selectedCards, card]);

    if (selectedCards.length === 1) {
      if (selectedCards[0].content === card.content) {
        // Cards match
        setMatchedCards([...matchedCards, selectedCards[0].id, card.id]);

        // Check if game is won (all pairs matched)
        if (matchedCards.length + 2 === cards.length) {
          setGameOver(true);
        }
      }

      const id = setTimeout(() => setSelectedCards([]), FLIP_DELAY);
      setTimeoutId(id);

      // Check if game is over due to no flips remaining
      if (flipsRemaining <= 1 && matchedCards.length + 2 < cards.length) {
        setGameOver(true);
      }
    }
  };

  const resetGame = () => {
    setGameCards(shuffleCards(cards));
    setSelectedCards([]);
    setMatchedCards([]);
    setFlipsRemaining(MAX_FLIPS);
    setGameOver(false);
  };

  const [gameCards, setGameCards] = useState<Card[]>(() => shuffleCards(cards));

  const getGameStatus = () => {
    if (gameOver) {
      if (matchedCards.length === cards.length) {
        return "You win! 🎉";
      } else {
        return "Game over! Out of flips 😞";
      }
    }
    return `Flips remaining: ${flipsRemaining}`;
  };

  return (
    <>
      <div className="container mx-auto flex flex-col items-center justify-center h-screen gap-10">
        <div className="text-lg font-bold">Matching game</div>

        <div className="text-md font-semibold">{getGameStatus()}</div>

        <div className="grid grid-cols-4 gap-4">
          {gameCards.map((card) => (
            <div
              className={`flex flex-col items-center h-56 w-32 rounded-md transition delay-100 ease-in-out ${getCardColor(
                card,
              )} ${gameOver && !isCardMatched(card) ? "opacity-50" : ""}`}
              key={card.id}
              onClick={() => handleSelectCard(card)}
            >
              <div className="flex justify-center items-center h-full">
                {isCardSelected(card) ||
                isCardMatched(card) ||
                (gameOver && !isCardMatched(card))
                  ? card.content
                  : "❓"}
              </div>
            </div>
          ))}
        </div>

        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={resetGame}
        >
          New Game
        </button>
      </div>
    </>
  );
}

export default App;
