import { useEffect, useState } from 'react';
import Search from './search';
import Product, { PriceList, ProductInterface, ProductResponse } from './product/products';
import axios from 'axios';
import AddUpdatePriceListForm from './product/addupdatepricelist';

const api = axios.create();

// Add the interceptor
api.interceptors.request.use(
  (config) => {
    // Get stored token from localStorage
    const token = sessionStorage.getItem('token');
    
    // Add token to the header
    config.headers.Authorization = `Bearer ${token}`;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


const ProductPage = () => {
    const [productList, setProductList] = useState<ProductInterface[]>([]);
    const [priceLists, setPriceLists] = useState<PriceList[]>([]);    
    const [allProductsSearch, setAllProductsSearch]= useState<ProductInterface[]>([]);
    useEffect(() => {
        fetchProductList();
    }, []);

    const fetchProductList = async () => {
        try {

            const response = await api.get<ProductResponse[]>('http://localhost:5091/v1/Product/All');
            const products = response.data.map((product) => ({
                ...product,
                selectedPrice: null,
            }));
            setProductList(products);
            setAllProductsSearch(products);
            const priceListResponse = await api.get<PriceList[]>('http://localhost:5091/v1/Pricelist');
            const priceLists = priceListResponse.data.map((priceList) => ({
                ...priceList,
                products: products.filter((product) => product.priceList.some((price) => price.id === priceList.id)),
            }));
            setPriceLists(priceLists);
        } catch (error:any) {
            if(error.response){
              const status = error.response.status;
              const data = error.response.data;
              const errorMessage = `Request failed with status: ${status}\nError data: ${JSON.stringify(data)}`;
          
              console.log('Request failed with status:', status);
              console.log('Error data:', data);
             
              window.alert(errorMessage);
            }else{
              const errorMessage = `Error executing request: ${error.message}`;
      
              window.alert(errorMessage);
            }      
          }
    };
    return (
        <div>
            <Search
                setProductList={setProductList}
                fetchProductList={fetchProductList}
                productList={productList}
                allProductsSearch={allProductsSearch}
            />
            <AddUpdatePriceListForm
                productList={productList}
                setProductList={setProductList}
                fetchProductList={fetchProductList}
                priceLists={priceLists}
            />
            <Product productList={productList} setProductList={setProductList} />
        </div>
    );
};

export default ProductPage;
