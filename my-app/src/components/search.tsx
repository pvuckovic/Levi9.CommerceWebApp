import { ChangeEvent, useState } from "react";
import styled from "styled-components";
import DirectionAsc from "../assets/icons/directionAsc";
import DirectionDesc from "../assets/icons/directionDesc";
import { useLocation } from "react-router";
import AddProductForm from "./product/addproducts";
import { ProductInterface } from "./product/products";

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
    setProductList: React.Dispatch<React.SetStateAction<ProductInterface[]>>;
    setTotalPages: React.Dispatch<React.SetStateAction<number>>;
    setCurrentPage: (pageNumber: number) => void;
    currentPage: number;
    totalPages: number;
    fetchProductList: () => void;
}
const Search: React.FC<SearchProps> = ({ setProductList, setTotalPages, currentPage, totalPages, setCurrentPage, fetchProductList }) => {
    const location = useLocation();
    const [value, setValue] = useState("");
    const [selectedOption, setSelectedOption] = useState("name");
    const [direction, setDirection] = useState<'asc' | 'dsc'>('asc');


    const handlePageClick = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        handleSearch('asc', pageNumber);
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
        const apiUrl = `http://localhost:5091/v1/Product/Search?page=${page}&name=${value}&orderBy=${selectedOption}&direction=${direction}`;
        fetch(apiUrl)
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setProductList(data.items);
            })
            .catch((error) => {
                console.error(error);
            });
    };
    const renderPageNumbers = () => {
        const pageNumbers = [];
        for (let i = 1; i <= totalPages; i++) {
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
                {location.pathname === "/products" && <AddProductForm fetchProductList={fetchProductList} />}
            </NavItem>
            <PaginationContainer>
                {renderPageNumbers()}
            </PaginationContainer>
        </SearchContainer>
    );
};

export default Search;