// src/components/molecules/NewsCard.jsx
import React from "react";
import NewsImage from "../atoms/NewsImage";
import NewsTitle from "../atoms/NewsTitle";
import NewsButton from "../atoms/NewsButton";

const NewsCard = ({ news }) => {
  if (!news) return null;
  return (
    <div className="card bg-dark text-light h-100 shadow-lg border-0">
      <NewsImage src={news.image} alt={news.title} />
      <div className="card-body">
        <NewsTitle>{news.title}</NewsTitle>
        <p className="card-text">{news.description}</p>
      </div>
      <div className="card-footer bg-black border-0">
        <small> {news.date}</small>
        <NewsButton link={news.link} />
      </div>
    </div>
  );
};

export default NewsCard;
