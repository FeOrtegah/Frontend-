// src/components/atoms/NewsButton.jsx
import React from 'react';

const NewsButton = ({ link }) => (
  <a
    href={link}
    target="_blank"
    rel="noopener noreferrer"
    className="block text-center border border-cyan-400 text-cyan-400 rounded-lg py-2 mt-3 hover:bg-cyan-400 hover:text-black transition-all"
  >
    Leer más
  </a>
);

export default NewsButton;
