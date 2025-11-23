// src/pages/NotFound.jsx
import React from 'react';
import { Container } from 'react-bootstrap';
import Image from '../components/atoms/Image'; // tu componente personalizado

const image = {
  src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnLMSjfk8BbBLwEAf2T3zSpK8hhg8bMkHPww&s',
  alt: 'Not Found Image',
};

function NotFound() {
  return (
    <Container className="my-5 text-center">
      <h1>Página no encontrada</h1>
      <p>¿Estás seguro de que era aquí?</p>
      
      <Image src={image.src} alt={image.alt} style={{ maxWidth: '100%', height: 'auto' }} />
    </Container>
  );
}

export default NotFound;
