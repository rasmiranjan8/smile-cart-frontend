import i18n from "i18next";
import { useEffect } from "react";
import PageLoader from "components/Commons/PageLoader";
import productsApi from "apis/products";
import Header from "components/Commons/Header";
import { keys, isEmpty } from "ramda";
import useCartItemsStore from "stores/useCartItemsStore";

import { Toastr, NoData } from "neetoui";
import { cartTotalOf } from "components/utils";
import ProductCard from "./ProductCard";
import PriceCard from "./PriceCard";
import { MRP, OFFER_PRICE } from "components/constants";
import withTitle from "utils/withTitle";
import { useFetchCartProducts } from "hooks/reactQuery/useProductsApi";
import { useTranslation } from "react-i18next";

const Cart = () => {
  const { cartItems, setSelectedQuantity } = useCartItemsStore();
  const slugs = useCartItemsStore(store => keys(store.cartItems));

  const { data: products = [], isLoading } = useFetchCartProducts(slugs);

  const totalMrp = cartTotalOf(products, MRP);
  const totalOfferPrice = cartTotalOf(products, OFFER_PRICE);
  const { t } = useTranslation();
  const fetchCartProducts = async () => {
    try {
      const responses = await Promise.all(
        slugs.map(slug => productsApi.show(slug))
      );

      console.log(responses);

      responses.forEach(({ availableQuantity, name, slug }) => {
        if (availableQuantity >= cartItems[slug]) return;

        setSelectedQuantity(slug, availableQuantity);
        if (availableQuantity === 0) {
          Toastr.error(t("product.error.removedFromCart", { name }), {
            autoClose: 2000,
          });
        }
      });
    } catch (error) {
      console.log("An error occurred:", error);
    } finally {
      //setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCartProducts();
  }, [cartItems]);
  if (isLoading) return <PageLoader />;

  if (isEmpty(products)) {
    return (
      <>
        <Header title="My Cart" />
        <div className="flex h-screen items-center justify-center">
          <NoData title="Your cart is empty!" />
        </div>
      </>
    );
  }
  return (
    <>
      <Header title="My Cart" />
      <div className="mt-10 flex justify-center space-x-10">
        <div className="w-1/3 space-y-5">
          {products.map(product => (
            <ProductCard key={product.slug} {...product} />
          ))}
        </div>
        {totalMrp > 0 && (
          <div className="w-1/4">
            <PriceCard {...{ totalMrp, totalOfferPrice }} />
          </div>
        )}
      </div>
    </>
  );
};

export default withTitle(Cart, i18n.t("cart.title"));
