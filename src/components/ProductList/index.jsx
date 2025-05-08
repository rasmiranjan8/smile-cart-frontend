import { Typography, Spinner, Input, NoData } from "neetoui";
import { Search } from "neetoicons";
import productsApi from "apis/products";
import { useEffect, useState, useContext } from "react";
import ProductListItem from "./ProductListItem";
import Header from "components/Commons/Header";
import useDebounce from "hooks/useDebounce";
import { isEmpty, without } from "ramda";
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from "./constants";
import { useFetchProducts } from "hooks/reactQuery/useProductsApi";
import { Pagination } from "neetoui";

const ProductList = () => {
  const [searchKey, setSearchKey] = useState("");
  const [currentPage, setCurrentPage] = useState(DEFAULT_PAGE_INDEX);
  const debouncedSearchKey = useDebounce(searchKey);
  const productsParams = {
    searchTerm: debouncedSearchKey,
    page: currentPage,
    pageSize: 8,
  };
  const { data: { products = [], totalProductsCount } = {}, isLoading } =
    useFetchProducts(productsParams);

  console.log("total count is:", totalProductsCount);

  const fetchProducts = async () => {
    try {
      const { products } = await productsApi.fetch({
        searchTerm: debouncedSearchKey,
      });

      console.log(products);
    } catch (e) {
      console.log("An Error occurred:", e);
    } finally {
      // setIsLoading(false); // Removed because setIsLoading is not defined
    }
  };
  useEffect(() => {
    fetchProducts();
  }, [debouncedSearchKey]);

  if (isLoading) {
    return (
      <>
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
        <div className="flex h-screen w-full items-center justify-center">
          <Spinner />
        </div>
      </>
    );
  }
  return (
    <>
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
              onChange={e => {
                setSearchKey(e.target.value)
                setCurrentPage(DEFAULT_PAGE_INDEX)
              }}
            />
          }
        />
        {isEmpty(products) ? (
          <NoData className="h-full w-full" title="No products to show" />
        ) : (
          <div className="grid grid-cols-2 justify-items-center gap-y-8 p-4 md:grid-cols-3 lg:grid-cols-4">
            {products.map(product => (
              <ProductListItem key={product.slug} {...product} />
            ))}
          </div>
        )}
        <div className="mb-5 self-end">
          <Pagination
            navigate={page => setCurrentPage(page)}
            count={totalProductsCount || 0}
            pageNo={currentPage || DEFAULT_PAGE_INDEX}
            pageSize={DEFAULT_PAGE_SIZE}
          />
        </div>
      </div>
    </>
  );
};

export default ProductList;
