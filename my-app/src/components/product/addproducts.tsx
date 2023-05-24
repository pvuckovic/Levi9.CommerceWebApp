import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
`;

const FormContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
`;

const InputText = styled.input`
  margin-right: 20px;
  box-sizing: border-box;
  text-align: center;
  height: 30px;
  background: #FFFFFF;
  border: 1px solid #C2C2C2;
  border-radius: 20px;
`;

const AddProductButton = styled.button`
  box-sizing: border-box;
  width: 80px;
  height: 30px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 10px;
  text-align: center;  
  color: #FFFFFF;
  background: #003DF2;
  border-color: #003DF2;
`;
interface AddProductFormProps {
  fetchProductList: () => void;
}

const AddProductForm: React.FC<AddProductFormProps> = ({
  fetchProductList,
}) => {
  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleImageUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(event.target.value);
  };

  const handleAddProduct = async () => {
    const product = {
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
      const response = await axios.post('http://localhost:5091/v1/Product', product);
      setName('');
      setImageUrl('');
      await fetchProductList();
    } catch (error) {
      console.log('Error adding product:', error);
    }
  };

  return (
    <Container>
      <FormContainer>
        <InputText
          type="text"
          value={name}
          onChange={handleNameChange}
          placeholder="Add Product Name"
        />
        <InputText
          type="text"
          value={imageUrl}
          onChange={handleImageUrlChange}
          placeholder="Image URL"
        />
        <AddProductButton onClick={handleAddProduct}>Add product</AddProductButton>
      </FormContainer>
    </Container>
  );
};

export default AddProductForm;
