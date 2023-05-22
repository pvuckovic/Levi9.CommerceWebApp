import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../assets/style/products.css';
import { Container, Row, Col, Pagination } from 'react-bootstrap';
import Search from '../search';
import { useDispatch } from 'react-redux';
import { addItem } from '../../store/slices/documentSlice';

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

interface ProductInterface {
  id: number;
  globalId: string;
  name: string;
  imageUrl: string;
  availableQuantity: number;
  lastUpdate: string;
  priceList: Price[];
  selectedPrice: Price | null;
}

interface Price {
  id: number;
  priceValue: number;
  currency: string;
  lastUpdate: string;
}

export interface ProductResponse {
  id: number;
  globalId: string;
  name: string;
  imageUrl: string;
  availableQuantity: number;
  lastUpdate: string;
  priceList: Price[];
}
const Product = () => {
  const dispatch = useDispatch();
  const [productList, setProductList] = useState<ProductInterface[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  useEffect(() => {
    fetchProductList();
  }, []);

  const fetchProductList = async () => {
    try {
      const token = sessionStorage.getItem('token');
      console.log('s');
      console.log(token);

      const response = await axios.get<ProductResponse[]>('https://localhost:7281/v1/Product/All');
      const products = response.data.map((product) => ({
        ...product,
        selectedPrice: null,
      }));
      setProductList(products);
    } catch (error) {
      console.log('Error fetching product list:', error);
    }
  };

  const handlePriceChange = (event: React.ChangeEvent<HTMLSelectElement>, productId: number) => {
    const priceId = parseInt(event.target.value);
    setProductList((prevProductList) =>
      prevProductList.map((product) => {
        if (product.id === productId) {
          const selectedPrice = product.priceList.find((price) => price.id === priceId);
          return {
            ...product,
            imageUrl: product.imageUrl.replace(/\\/g, '/'),
            selectedPrice: selectedPrice || null,
          };
        }
        return product;
      })
    );
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = productList.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(productList.length / productsPerPage);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <Container>
      {totalPages > 1 && (
        <div className="pagination-container">
          <Pagination>
            {Array.from({ length: totalPages }, (_, index) => (
              <Pagination.Item
                key={index + 1}
                active={index + 1 === currentPage}
                onClick={() => paginate(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </div>
      )}
      <Row className="product-container">
        {currentProducts.map((product) => (
          <Col key={product.id} lg={2} md={3} sm={5} xs={10}>
            <div className="product-item">
              <img className="product-image" src={product.imageUrl} alt='' />
              <h4>{product.name} [{product.availableQuantity}]</h4>              
              <div>
                <p>
                  [{product.id}]
                  <select
                    value={product.selectedPrice?.id || ''}
                    onChange={(event) => handlePriceChange(event, product.id)}
                  >
                    {product.priceList.map((price) => (
                      <option key={price.id} value={price.id}>
                        {price.priceValue} {price.currency}
                      </option>
                    ))}
                  </select>
                </p>

                <button onClick={() => dispatch(addItem(product))}>
                Add to Document
                </button>
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

const App = () => {
  return (
    <div>
      <Search />
      <Product />
    </div>
  );
};

export default App;
