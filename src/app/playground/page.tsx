"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

// Component to display player list
const PlayerList = ({
  players,
}: {
  players: Array<{ name: string; isHost: boolean }>;
}) => (
  <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
    <h3 className="text-lg font-semibold mb-3">Players ({players.length})</h3>
    <ul className="space-y-2">
      {players.map((player, index) => (
        <li key={index} className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <span>{player.name}</span>
          {player.isHost && (
            <span className="ml-2 text-xs bg-blue-500 px-2 py-1 rounded-full">
              Host
            </span>
          )}
        </li>
      ))}
    </ul>
  </div>
);

// Component for game actions
const GameActions = ({
  onDealCards,
  onLeaveRoom,
  isHost,
}: {
  onDealCards: () => void;
  onLeaveRoom: () => void;
  isHost: boolean;
}) => (
  <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
    <h3 className="text-lg font-semibold mb-3">Game Controls</h3>
    <div className="flex flex-col gap-3">
      {isHost && (
        <button
          onClick={onDealCards}
          className="bg-purple-500 hover:bg-purple-600 transition-colors p-2 rounded-lg font-medium"
        >
          Deal Cards
        </button>
      )}
      <button
        onClick={onLeaveRoom}
        className="bg-red-500/70 hover:bg-red-600/70 transition-colors p-2 rounded-lg font-medium"
      >
        Leave Room
      </button>
    </div>
  </div>
);

// Main component
export default function Playground() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roomCode = searchParams.get("room") || "";
  const playerName = searchParams.get("name") || "Guest";
  const isHost = searchParams.get("host") === "true";

  // State for the game
  const [players, setPlayers] = useState<
    Array<{ name: string; isHost: boolean }>
  >([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [myCards, setMyCards] = useState<string[]>([]);
  const [tablePile, setTablePile] = useState<string[]>([]);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  // Initialize game state
  useEffect(() => {
    // In a real app, you would connect to a WebSocket server here
    // and handle real-time game state updates

    // For demo purposes, we'll just set up some mock players
    setPlayers([
      { name: playerName, isHost },
      { name: "Alice", isHost: false },
      { name: "Bob", isHost: false },
    ]);

    // Show a notification that you joined the room
    alert(`You joined room: ${roomCode}`);

    // Cleanup function for disconnecting when component unmounts
    return () => {
      // In a real app, you would disconnect from WebSocket here
      console.log("Leaving game room");
    };
  }, [roomCode, playerName, isHost]);

  // Function to handle dealing cards
  const handleDealCards = () => {
    // Mock card dealing
    const suits = ["♥", "♦", "♠", "♣"];
    const values = [
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "J",
      "Q",
      "K",
      "A",
    ];

    // Generate some random cards
    const randomCards = Array(5)
      .fill(null)
      .map(() => {
        const suit = suits[Math.floor(Math.random() * suits.length)];
        const value = values[Math.floor(Math.random() * values.length)];
        return `${value}${suit}`;
      });

    setMyCards(randomCards);
    setTablePile([
      `${values[Math.floor(Math.random() * values.length)]}${
        suits[Math.floor(Math.random() * suits.length)]
      }`,
    ]);
    setGameStarted(true);
  };

  // Function to play a card
  const playCard = (card: string) => {
    if (!gameStarted) return;

    // Add card to table pile
    setTablePile((prev) => [card, ...prev]);

    // Remove card from hand
    setMyCards((prev) => prev.filter((c) => c !== card));

    setSelectedCard(null);
  };

  // Function to leave room
  const handleLeaveRoom = () => {
    if (confirm("Are you sure you want to leave this room?")) {
      router.push("/room");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-purple-900 text-white">
      {/* Header with room info */}
      <header className="p-4 bg-black/30 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">VirtuCards</h1>
          <p className="text-sm">Room: {roomCode}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm">{playerName}</span>
          {isHost && (
            <span className="text-xs bg-blue-500 px-2 py-1 rounded-full">
              Host
            </span>
          )}
        </div>
      </header>

      <div className="container mx-auto p-4 flex flex-col lg:flex-row gap-6">
        {/* Game area - table cards */}
        <div className="flex-grow flex flex-col">
          {/* Game table */}
          <div className="flex-grow flex flex-col items-center justify-center bg-green-900/30 backdrop-blur-sm rounded-xl p-6 mb-4">
            {gameStarted ? (
              <>
                <h2 className="text-lg font-semibold mb-4">Table Cards</h2>
                <div className="flex flex-wrap justify-center gap-2 mb-8">
                  {tablePile.map((card, index) => (
                    <div
                      key={index}
                      className={`w-16 h-24 bg-white text-black rounded-lg flex items-center justify-center text-xl font-bold ${
                        card.includes("♥") || card.includes("♦")
                          ? "text-red-600"
                          : "text-black"
                      }`}
                      style={{
                        transform: `rotate(${index * 5}deg)`,
                        marginTop: index * 2,
                      }}
                    >
                      {card}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-4">
                  Waiting for game to start...
                </h2>
                {isHost ? (
                  <button
                    onClick={handleDealCards}
                    className="bg-purple-500 hover:bg-purple-600 transition-colors px-6 py-3 rounded-lg font-medium"
                  >
                    Start Game
                  </button>
                ) : (
                  <p>The host will start the game shortly.</p>
                )}
              </div>
            )}
          </div>

          {/* Player cards */}
          {gameStarted && (
            <div className="bg-blue-900/40 backdrop-blur-sm rounded-xl p-4">
              <h2 className="text-lg font-semibold mb-3">Your Cards</h2>
              <div className="flex flex-wrap justify-center gap-3">
                {myCards.map((card, index) => (
                  <div
                    key={index}
                    className={`w-16 h-24 bg-white text-black rounded-lg flex items-center justify-center text-xl font-bold cursor-pointer transition-all ${
                      card.includes("♥") || card.includes("♦")
                        ? "text-red-600"
                        : "text-black"
                    } ${
                      selectedCard === card
                        ? "transform -translate-y-4 ring-2 ring-yellow-400"
                        : "hover:-translate-y-2"
                    }`}
                    onClick={() =>
                      selectedCard === card
                        ? playCard(card)
                        : setSelectedCard(card)
                    }
                  >
                    {card}
                  </div>
                ))}
              </div>
              {selectedCard && (
                <div className="mt-4 text-center">
                  <p>
                    Click the card again to play it, or select a different card.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar - player list and game actions */}
        <div className="lg:w-72 flex flex-col gap-4">
          <PlayerList players={players} />
          <GameActions
            onDealCards={handleDealCards}
            onLeaveRoom={handleLeaveRoom}
            isHost={isHost}
          />

          {/* Chat area (simplified) */}
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg flex-grow">
            <h3 className="text-lg font-semibold mb-3">Chat</h3>
            <div className="h-40 bg-black/20 rounded mb-2 p-2 text-sm overflow-y-auto">
              <p>
                <strong>System:</strong> Welcome to room {roomCode}!
              </p>
              <p>
                <strong>System:</strong> {playerName} has joined the room.
              </p>
              <p>
                <strong>Alice:</strong> Hello everyone!
              </p>
              <p>
                <strong>Bob:</strong> Let's play!
              </p>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-grow p-2 bg-white/20 rounded focus:ring-2 focus:ring-blue-400 outline-none text-white"
              />
              <button className="bg-blue-500 hover:bg-blue-600 px-3 rounded">
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
