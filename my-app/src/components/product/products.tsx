import React, { useState } from 'react';
import '../../assets/style/products.css';
import { Container, Row, Col, Pagination } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { addItem } from '../../store/slices/documentSlice';
import styled from 'styled-components';

export const AddToDocument = styled.button`
box-sizing: border-box;
width: 100px;
height: 30px;
color: #FFFFFF;
background: #003DF2;
border-color: #003DF2;
border-radius: 20px;
    cursor: pointer;
    font-size: 10px;
    @media (max-width: 480px) {
        width: 100%;
      }
`;
export const SelectPrice = styled.select`
box-sizing: border-box;
margin-left: 5px;
width: 110px;
height: 30px;
background: #FFFFFF;
text-align: center;
border: 1px solid #C2C2C2;
border-radius: 20px;
    `;
const PaginationContainer = styled.div`
margin-bottom: 10px;
  display: flex;
  justify-content: center;
`;

const PageNumber = styled.button<{ active: boolean }>`
  height: 100%;
  margin: 0 5px;
  padding: 5px 10px;
  border: none;
  background-color: ${({ active }) => (active ? "#003DF2" : "#FFFFFF")};
  color: ${({ active }) => (active ? "#FFFFFF" : "#003DF2")};
  border-radius: 20px;
  cursor: pointer;
`;
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
  setProductList: React.Dispatch<React.SetStateAction<ProductInterface[]>>;
}
const Product: React.FC<ProductProps> = ({ productList, setProductList }) => {

  const dispatch = useDispatch();
  const productsPerPage = 10;
  const [allProducts, setAllProducts] = useState(productList);
  const [currentPage, setCurrentPage] = useState(1);

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
  const totalPagesProduct = productList.length > 0 ? Math.ceil(productList.length / productsPerPage) : Math.ceil(allProducts.length / productsPerPage)

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <Container>
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
                  <SelectPrice
                    value={product.selectedPrice?.id || ''}
                    onChange={(event) => handlePriceChange(event, product.id)}
                  >
                    {product.priceList.map((price) => (
                      <option key={price.id} value={price.id}>
                        {price.priceValue} {price.currency}
                      </option>
                    ))}
                  </SelectPrice>
                </p>
                <AddToDocument onClick={() => dispatch(addItem(product))}>Add to Document</AddToDocument>
              </div>
            </div>
          </Col>
        ))}
      </Row>
      <Row>
        {totalPagesProduct > 1 && (
          <PaginationContainer>
            {Array.from({ length: totalPagesProduct }, (_, index) => (
              <PageNumber
                key={index + 1}
                active={index + 1 === currentPage}
                onClick={() => paginate(index + 1)}
              >
                {index + 1}
              </PageNumber>
            ))}
          </PaginationContainer>
        )}
      </Row>
    </Container>
  );
};
export default Product;