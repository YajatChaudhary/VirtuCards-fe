"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authService } from "@/services/apiService";

export default function SignUp() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    username: "", // Added for API compatibility
    phone: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Basic validation
    if (!formData.name || !formData.email || !formData.password) {
      setError("All fields are required");
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      setIsLoading(false);
      return;
    }

    try {
      // Set the username to be the same as name if not specifically provided
      // The API requires a username
      const username = formData.username || formData.name;

      // Prepare the user data for registration
      const userData = {
        email: formData.email,
        username: username,
        password: formData.password,
        phone: formData.phone || undefined,
        role_id: "PLAYER", // Updated to match the backend's expected format
      };

      // Call register API
      console.log("Sending registration data:", userData);
      const result = await authService.register(userData);
      console.log("Registration result:", result);

      if (result.success) {
        // After successful registration, log the user in
        const loginResult = await authService.login(
          formData.email,
          formData.password
        );

        if (loginResult.success) {
          // Navigate to room page after successful login
          router.push("/room");
        } else {
          // If login fails after registration, redirect to login page
          router.push("/signin");
        }
      } else {
        setError(result.error || "Registration failed. Please try again.");
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-900 to-purple-900 text-white p-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-sm p-8 rounded-xl">
        <h1 className="text-3xl font-bold mb-6 text-center">Create Account</h1>

        {error && (
          <div className="bg-red-500/70 text-white p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block mb-1 text-sm font-medium">
              Your Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 bg-white/20 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none text-white"
              placeholder="John Doe"
              disabled={isLoading}
            />
          </div>

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
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="phone" className="block mb-1 text-sm font-medium">
              Phone (Optional)
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-3 bg-white/20 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none text-white"
              placeholder="Your phone number"
              disabled={isLoading}
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
              disabled={isLoading}
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block mb-1 text-sm font-medium"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full p-3 bg-white/20 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none text-white"
              placeholder="••••••••"
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            className={`w-full bg-blue-500 hover:bg-blue-600 transition-colors p-3 rounded-lg font-medium mt-6 ${
              isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm">
            Already have an account?{" "}
            <Link href="/signin" className="text-blue-300 hover:underline">
              Sign In
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
