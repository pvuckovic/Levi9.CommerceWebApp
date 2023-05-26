import { ChangeEvent, FC, useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from "../store/store";
import { DocumentState, clearDocument } from "../store/slices/documentSlice";
import { Col, Row } from "react-bootstrap";
import axios from "axios";


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

export const Title = styled.text`
margin-left:20px;
color: #003DF2;
position: absolute;
font-weight: 600;
font-size: 45px;
@media (max-width: 480px) {
    font-size: 30px;
    position: relative;
    margin-left: 0;
    text-align: center;
    margin-bottom: 10px;
  }
    `;
export const DocumentTypeDropDown = styled.select`
margin-top: 20px;
margin-right:10px;
    box-sizing: border-box;
    width: 100px;
    height: 30px;
    background: #FFFFFF;
    border: 1px solid #C2C2C2;
    border-radius: 20px;
        `;
export const DocumentContainer = styled.div`
        `;
export const TitleAndDropdownContainer = styled.div`
width:100%;
height: 100px;
display: flex;
justify-content: space-between;
        `;
export const CreateButton = styled.button`
position: relative;
width: 70px;
background: #003DF2;
color: white;
font-weight: bold;
border-radius: 60px;
margin-right:10px;
height: 30%;
border: none;
cursor: pointer;

`;
const AddNewDocumentPage: FC<DocumentState> = () => {
    const dispatch = useDispatch();
    const selectedItems = useSelector((state: RootState) => state.document.items);
    const { items } = useSelector((state: RootState) => state.document);
    const [documentType, setDocumenType] = useState('INVOICE');
    const handleSelect = (event: ChangeEvent<HTMLSelectElement>) => {
        setDocumenType(event.target.value);
    };
    const clientId = sessionStorage.getItem('userId');
    const requestBody = { documentType, clientId, items }
    const handleAddDocument = () => {
        debugger;
        const apiUrl = `http://localhost:5091/v1/Document`;
        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
            })
            .catch((error: any) => {
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
            });
        dispatch(clearDocument());
    };
    return (
        <DocumentContainer>
            <TitleAndDropdownContainer>
                <div>
                    <Title> Document </Title>
                </div>
                <div>
                    <DocumentTypeDropDown value={documentType} onChange={handleSelect}>
                        <option value="INVOICE">Invoice</option>
                        <option value="RECEIPTS">Receipts</option>
                        <option value="PURCHASE">Purchase</option>
                    </DocumentTypeDropDown>
                    <CreateButton onClick={handleAddDocument}> Create </CreateButton>
                </div>
            </TitleAndDropdownContainer>
            <div>
                <Row className="product-container">
                    {selectedItems.map((item) => (
                        <Col key={item.productId} lg={2} md={3} sm={5} xs={10}>
                            <div className="product-item">
                                <h4>{item.name}</h4>
                                <div>
                                    <p>
                                        {item.productId}{item.priceValue} {item.currency}
                                    </p>
                                    <p>
                                        Quantity: {item.quantity}
                                    </p>
                                </div>
                            </div>
                        </Col>
                    ))}
                </Row>
            </div>
        </DocumentContainer>
    );
};

export default AddNewDocumentPage;
