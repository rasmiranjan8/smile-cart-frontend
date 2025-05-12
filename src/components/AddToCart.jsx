import React from "react";

import { Button } from "neetoui";
import { isNil } from "ramda";

import ProductQuantity from "./Commons/ProductQuantity";
import useSelectedQuantity from "./hooks/useSelectedQuantity";

const AddToCart = ({ slug, availableQuantity }) => {
  const { selectedQuantity, setSelectedQuantity } = useSelectedQuantity(slug);

  const handleClick = e => {
    e.stopPropagation();
    e.preventDefault();
    setSelectedQuantity(1);
  };

  if (isNil(selectedQuantity)) {
    return <Button label="Add to cart" size="large" onClick={handleClick} />;
  }

  return <ProductQuantity {...{ slug, availableQuantity }} />;
};

export default AddToCart;
