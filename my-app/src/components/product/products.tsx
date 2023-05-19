import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../assets/style/products.css';
import { Container, Row, Col, Pagination } from 'react-bootstrap';
import Search from '../search';

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

interface ProductResponse {
  id: number;
  globalId: string;
  name: string;
  imageUrl: string;
  availableQuantity: number;
  lastUpdate: string;
  priceList: Price[];
}

const AddProductForm = () => {
  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [productList, setProductList] = useState<ProductInterface[]>([]);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleImageUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(event.target.value);
  };

  const handleAddProduct = async () => {
    const product: ProductInterface = {
      id: Date.now(),
      globalId: '',
      name: name,
      imageUrl: imageUrl,
      availableQuantity: 0,
      lastUpdate: '',
      priceList: [],
      selectedPrice: null,
    };

    try {
      const response = await axios.post<ProductResponse>('http://localhost:5091/v1/Product', product);
      const newProduct = response.data;
      setProductList((prevProductList) => [...prevProductList, { ...newProduct, selectedPrice: null }]);
      setName('');
      setImageUrl('');
    } catch (error) {
      console.log('Error adding product:', error);
    }
  };

  return (
      <Container>
        <Row>
          <Col>
            <label className="products-text">Products</label>
          </Col>
          <Col>
            <div className="form-container">
              <form>
                <div className="input-group">
                  <input
                    className="input-text"
                    type="text"
                    value={name}
                    onChange={handleNameChange}
                    placeholder="Add Product Name"
                  />
                </div>
                <div className="input-group">
                  <input
                    className="input-text"
                    type="text"
                    value={imageUrl}
                    onChange={handleImageUrlChange}
                    placeholder="Image URL"
                  />
                </div>
                <button className="add-product-button" onClick={handleAddProduct}>
                  ADD PRODUCT
                </button>
              </form>
            </div>
          </Col>
        </Row>
      </Container>
  );
};

const Product = () => {
  const [productList, setProductList] = useState<ProductInterface[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 20;

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
              <img className="product-image" src={product.imageUrl} alt=''/>
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
      <AddProductForm />
      <Search/>
      <Product />
    </div>
  );
};

export default App;
