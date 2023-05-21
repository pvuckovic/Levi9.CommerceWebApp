import { ChangeEvent, useState } from "react";
import styled from "styled-components";
import DirectionAsc from "../assets/icons/directionAsc";
import DirectionDesc from "../assets/icons/directionDesc";
import { useLocation } from "react-router";
import AddProductForm from "./product/addproducts";

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
width: 100px;
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
const Search = () => {
    const location = useLocation();
    const [value, setValue] = useState("");
    const [selectedOption, setSelectedOption] = useState("");
    const handleSelect = (event: ChangeEvent<HTMLSelectElement>) => {
        setSelectedOption(event.target.value);
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
    };
    const handleSearch = () => {
        const apiUrl = `http://localhost:5091/v1/Product/Search?page=1&name=${value}&orderBy=${selectedOption}&direction=asc`;

        fetch(apiUrl)
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    return (
        <SearchContainer>
            {location.pathname === "/products" ?
                (<NavItem>
                    <Title> Products </Title>
                </NavItem>)
                : (<NavItem>
                    <Title> Documents </Title>
                </NavItem>)}
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
                <DirectionButtonAsc onClick={handleSearch}> <DirectionAsc /> </DirectionButtonAsc>
                <DirectionButtonDesc> <DirectionDesc /></DirectionButtonDesc>
                <SearchButton onClick={handleSearch}> Search</SearchButton>
                {location.pathname === "/products" && <AddProductForm />}     
            </NavItem>
        </SearchContainer>
    );
};

export default Search;
