import { React, memo } from "react";

import AddToCart from "components/AddToCart";
import { Typography } from "neetoui";
import { Link } from "react-router-dom";

const ProductListItem = ({
  imageUrl,
  name,
  offerPrice,
  slug,
  availableQuantity,
}) => (
  <Link
    className="neeto-ui-border-black neeto-ui-rounded-xl flex w-56 flex-col items-center justify-between border p-4"
    to={`/products/${slug}`}
  >
    <img alt={name} className="h-40 w-40" src={imageUrl} />
    <Typography className="text-center" weight="semibold">
      {name}
    </Typography>
    <Typography>${offerPrice}</Typography>
    <AddToCart {...{ slug, availableQuantity }} />
  </Link>
);

export default memo(ProductListItem);
