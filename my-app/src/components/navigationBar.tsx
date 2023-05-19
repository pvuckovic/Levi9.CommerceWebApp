import styled from "styled-components";
import Logo from "../assets/icons/logo";
import Sync from "../assets/icons/sync";

export const Navbar = styled.div`
  width: 100%;
  height: 20%;
  display: flex;
  justify-content: space-between;
  @media (max-width: 480px) {
  flex-direction: column;
  align-items: center;
  }
`;
const NavItem = styled.div`
  margin: 10px 10px 0 10px;
  display:flex; 
  @media (max-width: 480px) {
  margin: 10px 0;
  }
`;

export const NavButton = styled.button`
    background-color: transparent;
    border: none;
    margin: 30px; 30px; 0; 0;
    cursor: pointer;
    font-size: 20px;
    @media (max-width: 480px) {
        margin: 10px;
        font-size: 16px;
      }
`;

export const SyncButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  @media (max-width: 480px) {
    margin-top: 10px;
  }
`;
const NavigationBar = () => {
    return (
        <Navbar>
            <NavItem>
                <Logo />
            </NavItem>
            <NavItem>
                <NavButton> Products </NavButton>
                <NavButton> Documents </NavButton>
                <NavButton> My profile </NavButton>
                <SyncButton>
                    <Sync />
                </SyncButton>
            </NavItem>
        </Navbar>
    );
};

export default NavigationBar;
