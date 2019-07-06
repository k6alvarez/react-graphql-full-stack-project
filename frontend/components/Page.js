import React, { Component } from "react";
import Header from "../components/Header";
import Nav from "./Nav";
import Meta from "../components/Meta";
import styled, { ThemeProvider, createGlobalStyle } from "styled-components";

const theme = {
  red: "#FF0000",
  gkRed: "#740833",
  black: "#212121",
  grey: "#999999",
  lightGrey: "#E1E1E1",
  offWhite: "#EDEDED",
  maxWidth: "1000px",
  bs: "0 12px 24px 0 rgba(0, 0, 0, 0.09)",
  headerHtAdjustment: "126px"
};

const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
`;

const StyledPage = styled.div`
  background: white;
  color: ${props => props.theme.black};
  margin-top: ${props => props.theme.headerHtAdjustment};
`;

const Inner = styled.div`
  /* max-width: ${props => props.theme.maxWidth}; */
  padding: 0 2rem;
  flex-grow: 1;
  min-height: calc(100vh - 70px);
`;

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'Lato';
    font-display: auto;
    src: url('/static/fonts/Lato/Lato-Regular.ttf');
    font-weight: normal;
    font-style: normal;
  } 

  @font-face {
    font-family: 'Fondamento';
    font-display: auto;
    src: url('/static/fonts/Fondamento/Fondamento-Regular.ttf');
    font-weight: normal;
    font-style: normal;
  } 
  
  html {
    box-sizing: border-box;
    font-size: 14px;
  }

  *, *:before, *:after {
    box-sizing: inherit;
  }

  body {
    padding: 0;
    margin: 0;
    font-size: 1.25rem;
    line-height: 2;
    font-family: 'Lato', sans-serif;    
  }

  h1 {
    font-family: 'Fondamento', cursive;

  }

  a {
    text-decoration: none;
    color: ${theme.black};
  }
`;

export default class Page extends Component {
  render() {
    return (
      <ThemeProvider theme={theme}>
        <StyledPage>
          <GlobalStyle />
          <Meta />
          <Header />
          <FlexRow>
            <Nav />
            <Inner>{this.props.children}</Inner>
          </FlexRow>
        </StyledPage>
      </ThemeProvider>
    );
  }
}
