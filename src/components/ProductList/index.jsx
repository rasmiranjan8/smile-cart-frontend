import { React, useEffect, useState } from "react";

import productsApi from "apis/products";
import Header from "components/Commons/Header";
import { useFetchProducts } from "hooks/reactQuery/useProductsApi";
import useDebounce from "hooks/useDebounce";
import { filterNonNull } from "neetocist";
import useFuncDebounce from "hooks/useFuncDebounce";
import useQueryParams from "hooks/useQueryParams";
import { Search } from "neetoicons";
import { Spinner, Input, NoData, Pagination } from "neetoui";
import { isEmpty, mergeLeft } from "ramda";
import { useHistory } from "react-router-dom/";
import routes from "routes";
import { buildUrl } from "utils/url";

import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from "./constants";
import ProductListItem from "./ProductListItem";

const ProductList = () => {
  const history = useHistory();
  const queryParams = useQueryParams();
  const { page, pageSize, searchTerm = "" } = queryParams;
  const [searchKey, setSearchKey] = useState(searchTerm);
  const debouncedSearchKey = useDebounce(searchKey);

  const updateQueryParams = useFuncDebounce(value => {
    const params = {
      page: DEFAULT_PAGE_INDEX,
      pageSize: DEFAULT_PAGE_SIZE,
      searchTerm: value || null,
    };

    history.replace(buildUrl(routes.products.index, filterNonNull(params)));
  });

  const handlePageNavigation = page =>
    history.replace(
      buildUrl(
        routes.products.index,
        mergeLeft({ page, pageSize: DEFAULT_PAGE_SIZE }, queryParams)
      )
    );

  const productsParams = {
    searchTerm,
    page: Number(page) || DEFAULT_PAGE_INDEX,
    pageSize: Number(pageSize) || DEFAULT_PAGE_SIZE,
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
  });

  if (isLoading) {
    return (
      <>
        <Header
          shouldShowBackButton={false}
          title="Smile cart"
          actionBlock={
            <Input
              placeholder="Search products"
              prefix={<Search />}
              type="search"
              value={searchKey}
              onChange={updateQueryParams}
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
    <div className="flex h-screen flex-col">
      <Header
        shouldShowBackButton={false}
        title="Smile cart"
        actionBlock={
          <Input
            placeholder="Search products"
            prefix={<Search />}
            type="search"
            value={searchKey}
            onChange={({ target: { value } }) => {
              updateQueryParams(value);
              setSearchKey(value);
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
          count={totalProductsCount || 0}
          navigate={handlePageNavigation}
          pageNo={Number(page) || DEFAULT_PAGE_INDEX}
          pageSize={Number(pageSize) || DEFAULT_PAGE_SIZE}
        />
      </div>
    </div>
  );
};

export default ProductList;
