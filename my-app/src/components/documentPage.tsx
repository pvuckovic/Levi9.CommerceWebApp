import React, { useEffect, useState } from 'react';
import DocSearch from "./documentSearch";
import axios from 'axios';
import DocumentComp, { DocumentInterface, DocumentResponse } from './documentList';


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

const DocumentPage = () => {
    const [documentList, setDocumentList] = useState<DocumentInterface[]>([]);
    const [allDocumentsSearch, setAllDocumentsSearch]= useState<DocumentInterface[]>([]);

    useEffect(() => {
        fetchDocumentList();
    }, []);

    const fetchDocumentList = async () => {
        try {

            const response = await api.get<DocumentResponse[]>('http://localhost:5091/v1/Document/All');
            const documents = response.data.map((document) => ({
                ...document,
            }));
            setDocumentList(documents);
            setAllDocumentsSearch(documents);
        } catch (error : any) {
            if(error.response){
                const status = error.response.status;
                const data = error.response.data;
                const errorMessage = `Request failed with status: ${status}\nError data: ${JSON.stringify(data)}`;
            
                console.log('Request failed with status:', status);
                console.log('Error data:', data);
               
                window.alert(errorMessage);
              }else{
                const errorMessage = `Error executing request: ${error.message}`;
        
                window.alert(errorMessage);
              }
        }
    };
    return (
        <div>
            <DocSearch
                setDocumentList={setDocumentList}
                fetchDocumentList={fetchDocumentList}
                documentList={documentList}
                allDocumentsSearch={allDocumentsSearch}
            />
            
            <DocumentComp documentList={documentList} setDocumentList={setDocumentList} />
        </div>
    );
};

export default DocumentPage;
