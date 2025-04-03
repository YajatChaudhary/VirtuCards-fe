"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!formData.email || !formData.password) {
      setError("All fields are required");
      return;
    }

    // TODO: Add actual signin logic with API call

    // For now, just navigate to room page after "successful" signin
    router.push("/room");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-900 to-purple-900 text-white p-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-sm p-8 rounded-xl">
        <h1 className="text-3xl font-bold mb-6 text-center">Welcome Back</h1>

        {error && (
          <div className="bg-red-500/70 text-white p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block mb-1 text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 bg-white/20 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none text-white"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block mb-1 text-sm font-medium"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 bg-white/20 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none text-white"
              placeholder="••••••••"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="remember" className="ml-2 block text-sm">
                Remember me
              </label>
            </div>
            <a href="#" className="text-sm text-blue-300 hover:underline">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 transition-colors p-3 rounded-lg font-medium mt-6"
          >
            Sign In
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm">
            Don't have an account?{" "}
            <Link href="/signup" className="text-blue-300 hover:underline">
              Sign Up
            </Link>
          </p>
          <p className="mt-4">
            <Link href="/" className="text-sm text-blue-300 hover:underline">
              ← Back to Home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
