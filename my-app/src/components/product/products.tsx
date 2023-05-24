import React, { useState, useEffect } from 'react';
import '../../assets/style/products.css';
import { Container, Row, Col, Pagination } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { addItem } from '../../store/slices/documentSlice';

export interface ProductInterface {
  id: number;
  globalId: string;
  name: string;
  imageUrl: string;
  availableQuantity: number;
  lastUpdate: string;
  priceList: Price[];
  selectedPrice: Price | null;
}

export interface PriceList {
  id: number;
  globalId: string;
  name: string;
  lastUpdate: string;
  products: ProductInterface[];
}

export interface Price {
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

export interface PriceRequest {
  priceListId: number;
  productId: number;
  price: number;
  currency: string;
}
interface ProductProps {
  productList: ProductInterface[],
  totalPages: number,
  setCurrentPage: (pageNumber: number) => void;
  currentPage: number,
  setProductList: React.Dispatch<React.SetStateAction<ProductInterface[]>>;
}
const Product: React.FC<ProductProps> = ({ productList, totalPages, setCurrentPage, currentPage, setProductList }) => {

  const dispatch = useDispatch();
  const productsPerPage = 10;
  const [allProducts, setAllProducts] = useState(productList);


  const handlePriceChange = (event: React.ChangeEvent<HTMLSelectElement>, productId: number) => {
    const priceId = parseInt(event.target.value);
    setAllProducts((prevProductList) =>
      prevProductList.map((product) => {
        if (product.id === productId) {
          const selectedPrice = product.priceList.find((price) => price.id === priceId);
          return {
            ...product,
            imageUrl: product.imageUrl.replace(/\\/g, '/'),
            selectedPrice: selectedPrice || null
          };
        }
        return product;
      })
    );
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = productList.length > 0 ? productList.slice(indexOfFirstProduct, indexOfLastProduct) : allProducts.slice(indexOfFirstProduct, indexOfLastProduct)
  totalPages = productList.length > 0 ? Math.ceil(productList.length / productsPerPage) : Math.ceil(allProducts.length / productsPerPage)

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <Container>
      <Row>
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
      </Row>

      <Row className="product-container">
        {currentProducts.map((product) => (
          <Col key={product.id} lg={2} md={3} sm={5} xs={10}>
            <div className="product-item">
              <img className="product-image" src={product.imageUrl} alt="" />
              <h4>
                {product.name} [{product.availableQuantity}]
              </h4>
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
                <button onClick={() => dispatch(addItem(product))}>Add to Document</button>
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  );
};
export default Product;