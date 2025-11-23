import React from 'react';
import Text from '../atoms/Text';

function CardBody({ title, description, price }) {
  return (
    <>
      <Text variant="h5">{title}</Text>
      <Text variant="p">{description}</Text>
      <Text variant="span" className="text-muted">
        ${price}
      </Text>
    </>
  );
}

export default CardBody;
