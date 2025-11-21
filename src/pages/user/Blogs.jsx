import React from "react";

const Blogs = () => {
  return (
    <main className="container my-5">
      <h1 className="mb-4">Blogs</h1>
      <p>
       Nuestra historia comenzó con tres amigos apasionados por la moda y las tendencias urbanas.
      Lo que partió como una idea entre conversaciones y risas, se transformó en el sueño de crear un espacio donde cada persona pudiera expresar su estilo con libertad.
      Con esfuerzo, creatividad y mucha dedicación, pasamos de vender prendas entre conocidos a construir una tienda que busca inspirar autenticidad y confianza.
      Para nosotros, la ropa no es solo algo que se usa, sino una forma de contar quién eres sin decir una palabra.
      Seguimos siendo esos tres amigos de siempre, ahora unidos por el deseo de ofrecerte calidad, estilo y una experiencia única en cada prenda.
      </p>
      <div className="text-center mt-4">
        <img src="/img/blog.webp" alt="Blog imagen" style={{ maxWidth: "400px", width: "100%" }} />
      </div>
    </main>
  );
};

export default Blogs;
