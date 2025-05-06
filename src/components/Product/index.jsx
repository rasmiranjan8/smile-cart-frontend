import { useEffect, useState } from "react";
import axios from "axios";
import Carousel from "./Carousel";
import { Typography, Spinner } from "neetoui";
import { append, isNotNil } from "ramda";
import productsApi from "apis/products";
import Header from "components/Commons/Header";
import AddToCart from "components/AddToCart";
import { LeftArrow } from "neetoicons";
import { useParams, useHistory } from "react-router-dom";

const Product = ({availableQuantity}) => {
  const { slug } = useParams();
  const [product, setProduct] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const { selectedQuantity, setSelectedQuantity } = useSelectedQuantity(slug);
  const history = useHistory();

  const fetchProduct = async () => {
    try {
      const product = await productsApi.show(slug);
      setProduct(product);
      console.log(product);
    } catch (e) {
      console.log("An Error occured:", e);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchProduct();
  }, []);
  if (isError) return <PageNotFound />;
  const { name, description, mrp, offerPrice, imageUrls, imageUrl } = product;
  const totalDiscounts = mrp - offerPrice;
  const discountPercentage = ((totalDiscounts / mrp) * 100).toFixed(1);
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }
  return (
    <div className="px-6 pb-6">
      <Header title={name} />
      <div className="mt-16 flex gap-4">
        <div className="w-2/5">
          <div className="flex justify-center gap-16">
            {isNotNil(imageUrls) ? (
              <Carousel imageUrls={append(imageUrl, imageUrls)} title={name} />
            ) : (
              <img alt={name} className="w-48" src={imageUrl} />
            )}
          </div>
        </div>
        <div className="w-3/5 space-y-4">
          <Typography>{description}</Typography>
          <Typography>MRP: {mrp}</Typography>
          <Typography className="font-semibold">
            Offer price: {offerPrice}
          </Typography>
          <Typography className="font-semibold text-green-600">
            {discountPercentage}% off
          </Typography>
          <div className="flex space-x-10">
          <AddToCart {...{ availableQuantity, slug }} />
          <Button
              className="bg-neutral-800 hover:bg-neutral-950"
              label="Buy now"
              size="large"
              to={routes.checkout}
              onClick={() => setSelectedQuantity(selectedQuantity || 1)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
