import styled from "styled-components";

const FooterContainer = styled.footer`
  width: 100%;
  height: 10%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  flex-shrink: 0;
`;

const FooterText = styled.p`
  font-size: 14px;
  color: #888888;
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterText>© 2023 Levi9 Internship.</FooterText>
    </FooterContainer>
  );
};

export default Footer;