import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from "styled-components";

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

export const DocumentContainer = styled.div`
`;

export const DocumentInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`;

export const DocumentId = styled.p`
  margin: 0;
  color: #003DF2;
  font-weight: 600;
  font-size: 20px;
`;

export const DocumentType = styled.p`
  margin: 0;
  color: #003DF2;
  font-weight: 600;
  font-size: 20px;
`;

export const DividerContainer = styled.div`
// width: 90%;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 10px 40px 0px 30px;
  justify-content: space-between;
`;

export const Divider = styled.div`
//   width: 90%;
  height: 2px;
  background-color: #E0E0E0;
  margin: 10px 40px 20px 30px;

  @media (max-width: 480px) {
    margin: 10px 0px;
  }
`;

export const Title = styled.h1`
  margin-left: 20px;
  color: #003DF2;
  font-weight: 600;
  font-size: 45px;
  margin-bottom: 10px;

  @media (max-width: 480px) {
    font-size: 30px;
    margin-left: 0;
    text-align: center;
    margin-bottom: 10px;
  }
`;

interface Document {
  documentId: number;
  globalId: string;
  lastUpdate: string;
  clientId: number;
  documentType: string;
  items: DocumentItem[];
}

interface DocumentItem {
  productId: number;
  name: string;
  priceValue: number;
  currency: string;
  quantity: number;
}

const Document = ({ document }: { document: Document }) => (
  <div key={document.documentId}>
    <DividerContainer>
      <DocumentId>{document.documentId}</DocumentId>
      <DocumentType>{document.documentType}</DocumentType>
    </DividerContainer>
    <Divider />
    <div className="product-container">
      {document.items.map((item) => (
        <div key={item.productId} className="product-item">
          <h4>{item.name}</h4>
          <div>
            <p>
              {item.priceValue} {item.currency}
            </p>
            <p>
              Quantity: {item.quantity}
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const DocumentList = () => {
  const [documents, setDocuments] = useState<Document[]>([]);

  useEffect(() => {
    getAllDocuments();
  }, []);

  const getAllDocuments = async () => {
    try {
      const response = await api.get<Document[]>('https://localhost:7281/v1/Document/All');
      if (response.status === 200) {
        setDocuments(response.data);
      } else {
        console.error('Error retrieving documents:', response.status);
      }
    } catch (error) {
      console.error('Error retrieving documents:', error);
    }
  };

  if (documents.length === 0) {
    return <p>No documents found.</p>;
  }

  return (
    <div>
      <Title>Documents</Title>
      {documents.map((document) => (
        <Document document={document} />
      ))}
    </div>
  );
};

export default DocumentList;
