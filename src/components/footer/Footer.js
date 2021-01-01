import React from "react";
import styled from "styled-components";

const Footer = () => {
  return (
    <FooterDiv>
      <span className="copyright">&copy; Orhan Özkerçin & Karahan Özen</span>
    </FooterDiv>
  );
};

const FooterDiv = styled.div`
  position: relative;
  margin-top:50px;
  left: 0px;
  right: 0px;
  color: white;
  background-color: #1d1d1d;
  font-family: "Roboto";
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default Footer;
