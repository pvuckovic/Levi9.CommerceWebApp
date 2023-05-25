import { ChangeEvent, useState } from "react";
import styled from "styled-components";
import DirectionAsc from "../assets/icons/directionAsc";
import DirectionDesc from "../assets/icons/directionDesc";
import { useLocation } from "react-router";
import { DocumentInterface } from "./documentList";
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

export const SearchContainer = styled.div`
padding: 10px;
height: 120px;
  display: flex;
  justify-content: space-between;
  @media (max-width: 480px) {
    flex-direction: column;
    height: auto;
  }
`;
const NavItem = styled.div`
@media (max-width: 480px) {
    margin-bottom: 10px;
  }
`;
export const SearchButton = styled.button`
box-sizing: border-box;
width: 80px;
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
export const DirectionButtonAsc = styled.button`
height: 30%;
background-color: transparent;
border: none;
    cursor: pointer;
`;
export const DirectionButtonDesc = styled.button`
height: 30%;
background-color: transparent;
border: none;
    cursor: pointer;
`;
export const InputSearch = styled.input`
margin-right: 20px;
box-sizing: border-box;
text-align: center;
height: 30px;
background: #FFFFFF;
border: 1px solid #C2C2C2;
border-radius: 20px;
@media (max-width: 480px) {
    margin-right: 0;
    margin-bottom: 10px;
  }
`;
export const OrderByDropdown = styled.select`
box-sizing: border-box;
width: 135px;
height: 30px;
background: #FFFFFF;
text-align: center;
border: 1px solid #C2C2C2;
border-radius: 20px;
    `;
export const Title = styled.text`
color: #003DF2;
margin-left: 10px;
position: absolute;
font-weight: 600;
font-size: 45px;
text-align: center;
@media (max-width: 480px) {
    font-size: 30px;
    position: relative;
    margin-left: 0;
    text-align: center;
    margin-bottom: 10px;
  }
    `;
const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const PageNumber = styled.button<{ active: boolean }>`
  height: 30%;
  margin: 0 5px;
  padding: 5px 10px;
  border: none;
  background-color: ${({ active }) => (active ? "#003DF2" : "#FFFFFF")};
  color: ${({ active }) => (active ? "#FFFFFF" : "#003DF2")};
  border-radius: 20px;
  cursor: pointer;
`;
interface SearchProps {
    setDocumentList: React.Dispatch<React.SetStateAction<DocumentInterface[]>>;
    documentList: DocumentInterface[],
    fetchDocumentList: () => void;
    allDocumentsSearch: DocumentInterface[],
}
const DocSearch: React.FC<SearchProps> = ({ setDocumentList, fetchDocumentList, documentList, allDocumentsSearch }) => {
    const location = useLocation();
    const [value, setValue] = useState("");
    const [selectedOption, setSelectedOption] = useState("name");
    const [direction, setDirection] = useState<'asc' | 'dsc'>('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const handlePageClick = (pageNumber: number) => {        
        setCurrentPage(pageNumber);
    };

    const handleSelect = (event: ChangeEvent<HTMLSelectElement>) => {
        setSelectedOption(event.target.value);
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
    };

    const handleSearchAsc = () => {
        setDirection('asc');
        handleSearch('asc', currentPage);
    };
    const handleSearchDesc = () => {
        setDirection('dsc');
        handleSearch('dsc', currentPage);
    };

    const handleSearchButtonClick = () => {
        handleSearch(direction, currentPage);
    };
    const handleSearch = (direction: string, page: number) => {
        if (!value) {
            const errorMessage = 'Please enter a name.';
            window.alert(errorMessage);
            return;
          }
        
        const apiUrl = `http://localhost:5091/v1/Document/Search?page=${page}&name=${value}&orderBy=${selectedOption}&direction=${direction}`;
        api.get(apiUrl)
            .then(async (response) => {
                setDocumentList(response.data.items);
            })
            .catch((error:any) => {
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
            });
    };
    

    const constTotalPages = Math.ceil(allDocumentsSearch.length / 10);

    const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= constTotalPages; i++) {
        pageNumbers.push(
        <PageNumber
            key={i}
            active={i === currentPage}
            onClick={() => handlePageClick(i)}
        >
            {i}
        </PageNumber>
        );
    }
    return pageNumbers;
    };
    

    return (
        <SearchContainer>
            <NavItem>
                <InputSearch
                    type="text"
                    value={value}
                    onChange={handleChange}
                    placeholder="Search by name"
                />
                <OrderByDropdown value={selectedOption} onChange={handleSelect}>
                    <option value="name">Name</option>
                    <option value="id">id</option>
                    <option value="globalId">Global id</option>
                    <option value="availableQuantity">Available quantity</option>
                </OrderByDropdown>
                <DirectionButtonAsc onClick={handleSearchAsc}> <DirectionAsc /> </DirectionButtonAsc>
                <DirectionButtonDesc onClick={handleSearchDesc}> <DirectionDesc /></DirectionButtonDesc>
                <SearchButton onClick={handleSearchButtonClick}> Search</SearchButton>
                
            </NavItem>
            <PaginationContainer>
                {renderPageNumbers()}
            </PaginationContainer>
        </SearchContainer>  
    );
};

export default DocSearch;