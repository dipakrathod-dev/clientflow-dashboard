import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white text-center p-4">
      <h1 className="text-9xl font-black text-blue-500 mb-4">404</h1>
      <h2 className="text-3xl font-bold mb-2">Oops! Page Not Found</h2>
      <p className="text-slate-400 mb-8 max-w-md">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-semibold transition"
      >
        Go Home
      </Link>
    </div>
  );
}