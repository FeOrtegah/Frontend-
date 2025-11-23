// src/components/organisms/NewsList.jsx
import React from "react";
import NewsCard from "../molecules/NewsCard";

const NewsList = ({ newsData }) => {
  if (!newsData || newsData.length === 0) return <p>No hay noticias disponibles</p>;

  return (
    <div className="row g-4">
      {newsData.map((news, index) => (
        <div className="col-md-4" key={index}>
          <NewsCard news={news} />
        </div>
      ))}
    </div>
  );
};

export default NewsList;
