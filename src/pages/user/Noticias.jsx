// src/pages/Noticias.jsx
import React from "react";
import NewsList from "/src/components/organisms/NewsList";

const Noticias = () => {
  const newsData = [
    {
      title: "Hackeo en Node.js expone miles de paquetes NPM",
      description: "Un ataque reciente comprometió varios paquetes en el registro NPM.",
      date: "Octubre 2025",
      link: "https://www.bleepingcomputer.com/news/security/",
      image: "/img/nodejs-hack.webp",
    },
    {
      title: "React 19 mejora el rendimiento del renderizado",
      description: "La nueva versión promete una experiencia más fluida.",
      date: "Septiembre 2025",
      link: "https://react.dev/blog",
      image: "/img/react19.webp",
    },
    {
      title: "Google lanza herramienta contra vulnerabilidades",
      description: "Detecta dependencias inseguras en proyectos open source.",
      date: "Agosto 2025",
      link: "https://opensource.googleblog.com",
      image: "/img/google-vuln.webp",
    },
  ];

  return <NewsList newsData={newsData} />;
};

export default Noticias;
