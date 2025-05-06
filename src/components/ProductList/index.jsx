import { Typography, Spinner, Input, NoData } from "neetoui";
import { Search } from "neetoicons";
import productsApi from "apis/products";
import { useEffect, useState, useContext } from "react";
import ProductListItem from "./ProductListItem";
import Header from "components/Commons/Header";
import useDebounce from "hooks/useDebounce";
import { isEmpty, without } from "ramda";
import useCartItemsStore from "src/stores/useCartItemsStore";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchKey, setSearchKey] = useState("");
  const debouncedSearchKey = useDebounce(searchKey);
  
  const fetchProducts = async () => {
    try {
      const { products } = await productsApi.fetch({
        searchTerm: debouncedSearchKey,
      });
      setProducts(products);
      console.log(products);
    } catch (e) {
      console.log("An Error occurred:", e);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, [debouncedSearchKey]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }
  return (
    <div className="flex h-screen flex-col">
      <Header

        title="Smile cart"
        shouldShowBackButton={false}
        actionBlock={
          <Input
            placeholder="Search products"
            prefix={<Search />}
            type="search"
            value={searchKey}
            onChange={e => setSearchKey(e.target.value)}
          />
        }
      />
      {isEmpty(products) ? (
        <NoData className="h-full w-full" title="No products to show" />
      ) : (
        <div className="grid grid-cols-2 justify-items-center gap-y-8 p-4 md:grid-cols-3 lg:grid-cols-4">
          {products.map(product => (
            <ProductListItem
              key={product.slug}
              {...product}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
