import React, { useEffect, useState } from 'react';
import Search from './search';
import Product, { PriceList, ProductInterface, ProductResponse } from './product/products';
import axios from 'axios';
import AddUpdatePriceListForm from './product/addupdatepricelist';

const ProductPage = () => {
    const [productList, setProductList] = useState<ProductInterface[]>([]);
    const [priceLists, setPriceLists] = useState<PriceList[]>([]);
    const [totalPages, setTotalPages] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchProductList();
    }, []);

    const fetchProductList = async () => {
        try {

            const response = await axios.get<ProductResponse[]>('http://localhost:5091/v1/Product/All');
            const products = response.data.map((product) => ({
                ...product,
                selectedPrice: null,
            }));
            setProductList(products);
            const priceListResponse = await axios.get<PriceList[]>('http://localhost:5091/v1/Pricelist');
            const priceLists = priceListResponse.data.map((priceList) => ({
                ...priceList,
                products: products.filter((product) => product.priceList.some((price) => price.id === priceList.id)),
            }));
            setPriceLists(priceLists);
        } catch (error) {
            console.log('Error fetching product list:', error);
        }
    };
    return (
        <div>
            <Search
                setProductList={setProductList}
                setTotalPages={setTotalPages}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={totalPages}
                fetchProductList={fetchProductList}
            />
            <AddUpdatePriceListForm
                productList={productList}
                setProductList={setProductList}
                fetchProductList={fetchProductList}
                priceLists={priceLists}
            />
            <Product productList={productList} totalPages={totalPages} setCurrentPage={setCurrentPage} currentPage={1} setProductList={setProductList} />
        </div>
    );
};

export default ProductPage;
