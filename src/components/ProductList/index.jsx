import { Typography, Spinner, Input, NoData } from "neetoui";
import { Search } from "neetoicons";
import productsApi from "apis/products";
import { useEffect, useState, useContext } from "react";
import ProductListItem from "./ProductListItem";
import Header from "components/Commons/Header";
import useDebounce from "hooks/useDebounce";
import { isEmpty, without, mergeLeft } from "ramda";
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from "./constants";
import { useFetchProducts } from "hooks/reactQuery/useProductsApi";
import { Pagination } from "neetoui";
import { useHistory } from "react-router-dom/";
import useQueryParams from "hooks/useQueryParams";
import { buildUrl } from "utils/url";
import routes from "routes";
import { filterNonNull } from "neetocist";
import useFuncDebounce from "hooks/useFuncDebounce";
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
    </>
  );
};

export default ProductList;
