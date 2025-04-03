"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Room() {
  const router = useRouter();
  const [roomCode, setRoomCode] = useState("");
  const [userName, setUserName] = useState("");
  const [error, setError] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!roomCode.trim()) {
      setError("Room code is required");
      return;
    }

    if (!userName.trim()) {
      setError("Username is required");
      return;
    }

    // TODO: Implement actual room joining logic with API call

    // For now, just redirect to the game page with the room code
    router.push(
      `/playground?room=${roomCode}&name=${encodeURIComponent(userName)}`
    );
  };

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!userName.trim()) {
      setError("Username is required");
      return;
    }

    // TODO: Implement actual room creation logic with API call
    // For demonstration, we'll generate a random room code
    const generatedRoomCode = Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();

    // Navigate to the game page with the generated room code
    router.push(
      `/playground?room=${generatedRoomCode}&name=${encodeURIComponent(
        userName
      )}&host=true`
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-900 to-purple-900 text-white p-4">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold mb-8 text-center">VirtuCards</h1>

        {/* User Name Input - Common for both forms */}
        <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl mb-6">
          <label htmlFor="userName" className="block mb-2 text-sm font-medium">
            Your Name
          </label>
          <input
            type="text"
            id="userName"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full p-3 bg-white/20 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none text-white mb-2"
            placeholder="Enter your name"
          />
          <p className="text-sm text-blue-200">
            This name will be displayed to other players
          </p>
        </div>

        {/* Toggle between Join or Create */}
        <div className="flex mb-6">
          <button
            className={`flex-1 p-3 text-center rounded-l-lg font-medium transition-colors ${
              !isCreating ? "bg-blue-600" : "bg-white/20 hover:bg-white/30"
            }`}
            onClick={() => setIsCreating(false)}
          >
            Join a Room
          </button>
          <button
            className={`flex-1 p-3 text-center rounded-r-lg font-medium transition-colors ${
              isCreating ? "bg-blue-600" : "bg-white/20 hover:bg-white/30"
            }`}
            onClick={() => setIsCreating(true)}
          >
            Create a Room
          </button>
        </div>

        {error && (
          <div className="bg-red-500/70 text-white p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {isCreating ? (
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-4">Create a New Room</h2>
            <p className="mb-4 text-blue-200">
              Create a new game room and invite your friends to join you!
            </p>
            <form onSubmit={handleCreateRoom}>
              <button
                type="submit"
                className="w-full bg-purple-500 hover:bg-purple-600 transition-colors p-4 rounded-lg font-medium"
              >
                Create Room
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-4">Join Existing Room</h2>
            <form onSubmit={handleJoinRoom}>
              <div className="mb-4">
                <label
                  htmlFor="roomCode"
                  className="block mb-2 text-sm font-medium"
                >
                  Room Code
                </label>
                <input
                  type="text"
                  id="roomCode"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  className="w-full p-3 bg-white/20 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none text-white"
                  placeholder="Enter room code (e.g., XYZ123)"
                  maxLength={6}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 transition-colors p-4 rounded-lg font-medium"
              >
                Join Room
              </button>
            </form>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link href="/" className="text-sm text-blue-300 hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
