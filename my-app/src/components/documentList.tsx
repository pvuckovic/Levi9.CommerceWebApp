import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from "styled-components";
import { useDispatch } from 'react-redux';
import { Col, Container, Pagination, Row } from 'react-bootstrap';

export const DocumentContainer = styled.div`
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

export interface DocumentInterface {
  id: number;
  globalId: string;
  lastUpdate: string;
  clientId: number;
  documentType: string;
  items: DocumentItem[];
}

export interface DocumentResponse {
    id: number;
    globalId: string;
    lastUpdate: string;
    clientId: number;
    documentType: string;
    items: DocumentItem[];
  }

export interface DocumentItem {
  productId: number;
  name: string;
  priceValue: number;
  currency: string;
  quantity: number;
}

export interface DocumentProps {
    documentList: DocumentInterface[],
    setDocumentList: React.Dispatch<React.SetStateAction<DocumentInterface[]>>;
  }

  const DocumentComp: React.FC<DocumentProps> = ({ documentList,  setDocumentList }) => {

    const dispatch = useDispatch();
    const documentsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const [allDocuments, setAllDocuments] = useState(documentList);
  
  
    const indexOfLastDocument = currentPage * documentsPerPage;
    const indexOfFirstDocument = indexOfLastDocument - documentsPerPage;
    const currentDocuments = documentList.length > 0 ? documentList.slice(indexOfFirstDocument, indexOfLastDocument) : allDocuments.slice(indexOfFirstDocument, indexOfLastDocument)
    const totalPages = documentList.length > 0 ? Math.ceil(documentList.length / documentsPerPage) : Math.ceil(allDocuments.length / documentsPerPage)
  
    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber);
      };

      return (
        <Container>
          <Row>
            {currentDocuments.map((document) => (
                <div>
            <DividerContainer>
            <DocumentId>{document.clientId}</DocumentId>
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
              
            ))}
          </Row>
          <Row>
        {totalPages > 1 && (
          <PaginationContainer>
            {Array.from({ length: totalPages }, (_, index) => (
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
    export default DocumentComp;