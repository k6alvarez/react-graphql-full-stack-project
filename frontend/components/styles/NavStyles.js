import styled from "styled-components";

const NavStyles = styled.ul`
  margin-top: ${props => props.theme.headerHtAdjustment};
  border-right: 1px solid ${props => props.theme.black};
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  a,
  button {
    padding: 1em;
    display: flex;
    align-items: center;
    position: relative;
    text-transform: uppercase;
    font-weight: 900;
    font-size: 1em;
    background: none;
    border-bottom: 1px solid ${props => props.theme.grey};
    cursor: pointer;
  }
  /* @media (max-width: 1300px) {    
  } */
`;

export default NavStyles;
