import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-900 to-purple-900 text-white p-4">
      <main className="max-w-4xl w-full flex flex-col items-center text-center gap-8">
        {/* Logo and Title */}
        <div className="mb-6">
          <h1 className="text-5xl font-bold tracking-tight mb-2">VirtuCards</h1>
          <p className="text-xl text-blue-200">
            The Ultimate Virtual Card Game Experience
          </p>
        </div>

        {/* Project Description */}
        <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl max-w-2xl mb-8">
          <p className="text-lg mb-4">
            Welcome to VirtuCards - where traditional card games meet modern
            technology! Create or join rooms, play with friends from anywhere in
            the world, and experience your favorite card games in a whole new
            way.
          </p>
          <p className="text-blue-200">
            Real-time gameplay • Custom rooms • Multiple game modes
          </p>
        </div>

        {/* Auth Options */}
        <div className="w-full max-w-md flex flex-col gap-4">
          {/* Sign Up */}
          <Link
            href="/signup"
            className="bg-blue-500 hover:bg-blue-600 transition-colors p-4 rounded-lg font-medium flex items-center justify-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6z" />
              <path d="M16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
            </svg>
            Sign Up
          </Link>

          {/* Sign In */}
          <Link
            href="/signin"
            className="bg-white/20 hover:bg-white/30 transition-colors p-4 rounded-lg font-medium flex items-center justify-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
            Sign In
          </Link>

          {/* Play as Guest */}
          <Link
            href="/room"
            className="bg-purple-500 hover:bg-purple-600 transition-colors p-4 rounded-lg font-medium flex items-center justify-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838l-2.328.996.002 1.069c0 .54-.18 1.070-.267 1.645-.087.573-.149 1.186-.149 1.8 0 .005 0 .01.001.015A12 12 0 0110 17a1 1 0 01-1 1h.01a1 1 0 01-.769-.386 11.476 11.476 0 01-2.93-4.358 1 1 0 01.536-1.455l2.058-.882-.001-.775a1 1 0 01.32-.748l3.999-4a1 1 0 01.394-.24z" />
              <path d="M2 9.654a1 1 0 01.769.386 12.026 12.026 0 013.6 4.358 1 1 0 01-.5 1.406l-1.79.767a1 1 0 00-.53 1.313 5.005 5.005 0 005.054 3.113 1 1 0 011.045.9 5.006 5.006 0 009.199-3.113 1 1 0 00-.53-1.313l-1.788-.77a1 1 0 01-.499-1.405 12.025 12.025 0 013.595-4.353 1 1 0 011.082.163 5.005 5.005 0 00-6.562-7.518A5.006 5.006 0 0010 7.839a5.006 5.006 0 00-8 1.815z" />
            </svg>
            Play as Guest
          </Link>
        </div>
      </main>

      <footer className="mt-16 text-sm text-blue-200">
        <p>© {new Date().getFullYear()} VirtuCards. All rights reserved.</p>
      </footer>
    </div>
  );
}
