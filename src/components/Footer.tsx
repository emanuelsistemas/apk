import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gray-800 py-2 fixed bottom-0 w-full">
      <div className="container mx-auto px-4 text-center">
        <a
          href="https://emasoftware.io"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-white transition-all duration-300 relative group"
          style={{ fontFamily: 'MuseoModerno, sans-serif' }}
        >
          <span className="relative inline-block transform hover:scale-110 transition-transform duration-300">
            <span className="relative z-10">ema-software</span>
            <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-25 blur-lg transition-opacity duration-300" />
          </span>
        </a>
      </div>
    </footer>
  );
}