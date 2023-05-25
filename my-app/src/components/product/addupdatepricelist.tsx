import React, { useState } from 'react';
import axios from 'axios';
import { Button, Container, Form } from 'react-bootstrap';
import { Price, PriceList, PriceRequest, ProductInterface } from './products';
import styled from 'styled-components';

const StyledContainer = styled(Container)`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledForm = styled(Form)`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 20px;
  width: 100%;
`;

const FormGroup = styled(Form.Group)`

  display: flex;
  flex-direction: column;
  align-items: center;
  
`;

const FormControl = styled(Form.Control)`
  box-sizing: border-box;
  margin-left: 30px;
  width: 100px;
  height: 30px;
  background: #ffffff;
  text-align: center;
  border: 1px solid #c2c2c2;
  border-radius: 20px;
`;

const StyledButton = styled(Button)`
  margin-left: 20px;
  box-sizing: border-box;
  width: 80px;
  height: 30px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 12px;
  text-align: center;
  color: #ffffff;
  background: ${(props) => (props.disabled ? '#dc3545' : '#003df2')};
  border-color: ${(props) => (props.disabled ? '#dc3545' : '#003df2')};
  
`;

const Title = styled.h1`
  color: #003df2;
  font-weight: 600;
  font-size: 25px;
  text-align: center;
`;
interface AddUpdatePriceListFormProps {
  productList: ProductInterface[];
  setProductList: (productList: ProductInterface[]) => void;
  fetchProductList: () => void;
  priceLists: PriceList[];
}

const AddUpdatePriceListForm: React.FC<AddUpdatePriceListFormProps> = ({
  productList,
  setProductList,
  fetchProductList,
  priceLists
}) => {
  const [selectedPriceListId, setSelectedPriceListId] = useState<number>(0);
  const [selectedProductId, setSelectedProductId] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const [currency, setCurrency] = useState<string>('');
  const [action, setAction] = useState<'action' | 'add' | 'update'>('action');

  const handleAddUpdateProduct = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(event);
    console.log(selectedPriceListId, selectedProductId, price, currency);
    if (selectedPriceListId === 0 || selectedProductId === 0 || price === 0 || currency === '') {
      console.log(selectedPriceListId, selectedProductId, price, currency);
      return;
    }
    try {
      const priceRequest: PriceRequest = {
        productId: selectedProductId,
        priceListId: selectedPriceListId,
        price: price,
        currency: currency,
      };

      let response;
      if (action === 'add') {
        response = await axios.post('http://localhost:5091/v1/Pricelist/product/price', priceRequest);
      } else if (action === 'update') {
        response = await axios.put('http://localhost:5091/v1/Pricelist/product/price', priceRequest);
      } else {
        return;
      }

      const newPriceProductDTO = response.data;
      const updatedProductList = productList.map((product) => {
        if (product.id === newPriceProductDTO.productId) {
          const newPrice: Price = {
            id: newPriceProductDTO.priceListId,
            priceValue: newPriceProductDTO.price,
            currency: newPriceProductDTO.currency,
            lastUpdate: newPriceProductDTO.lastUpdate,
          };
          return {
            ...product,
            priceList: [...product.priceList, newPrice],
          };
        }
        setSelectedPriceListId(0);
        setSelectedProductId(0);
        setPrice(0);
        setCurrency('');
        console.log(product);
        return product;
      });
      setProductList(updatedProductList);
      await fetchProductList();
    } catch (error: any) {
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        const errorMessage = `Request failed with status: ${status}\nError data: ${JSON.stringify(data)}`;

        console.log('Request failed with status:', status);
        console.log('Error data:', data);

        window.alert(errorMessage);
      } else {
        const errorMessage = `Error executing request: ${error.message}`;

        window.alert(errorMessage);
      }
    }
  };

  return (

    <StyledContainer>

      <StyledForm onSubmit={handleAddUpdateProduct}>

        <Title> Choose action </Title>
        <FormGroup controlId="action">
          <FormControl
            as="select"
            value={action}
            onChange={(event: { target: { value: string; }; }) =>
              setAction(event.target.value as 'action' | 'add' | 'update')
            }
          >
            <option value="action">Action</option>
            <option value="add">Add Price List</option>
            <option value="update">Update Price List</option>
          </FormControl>
        </FormGroup>
        <FormGroup controlId="priceList">
          <FormControl
            as="select"
            value={selectedPriceListId}
            onChange={(event: { target: { value: string; }; }) =>
              setSelectedPriceListId(parseInt(event.target.value))
            }
          >
            <option value={0}>Price List</option>
            {priceLists.map((priceList) => (
              <option key={priceList.id} value={priceList.id}>
                {priceList.name}
              </option>
            ))}
          </FormControl>
        </FormGroup>
        <FormGroup controlId="product">
          <FormControl
            as="select"
            value={selectedProductId}
            onChange={(event: { target: { value: string; }; }) =>
              setSelectedProductId(parseInt(event.target.value))
            }
          >
            <option value={0}>Product</option>
            {productList.map((product) => (
              <option key={product.id} value={product.id}>
                [{product.id}] {product.name}
              </option>
            ))}
          </FormControl>
        </FormGroup>
        <FormGroup controlId="price">
          <FormControl
            type="number"
            value={price}
            onChange={(event: { target: { value: string; }; }) => setPrice(parseFloat(event.target.value))}
          />
        </FormGroup>
        <FormGroup controlId="currency">
          <FormControl
            as="select"
            value={currency}
            onChange={(event: { target: { value: React.SetStateAction<string>; }; }) => setCurrency(event.target.value)}
          >
            <option value={0}>Currency</option>
            <option value="RSD">RSD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            <option value="USD">USD</option>
            <option value="RMB">RMB</option>
            <option value="INR">INR</option>
            <option value="JPY">JPY</option>
          </FormControl>
        </FormGroup>
        <StyledButton
          type="submit"
          disabled={
            action === 'action' ||
            selectedPriceListId === 0 ||
            selectedProductId === 0 ||
            price === 0 ||
            currency === ''
          }
        >
          {action === 'add'
            ? 'Add'
            : action === 'update'
              ? 'Update'
              : 'Fill All'}
        </StyledButton >
      </StyledForm>
    </StyledContainer>
  );
};

export default AddUpdatePriceListForm;
