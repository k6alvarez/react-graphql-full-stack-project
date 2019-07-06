import React, { useEffect } from "react";
import Router from "next/router";
import NProgress from "nprogress";
import { useSpring, animated } from "react-spring";
import Link from "next/link";
import Cart from "./Cart";
import PropTypes from "prop-types";
import styled from "styled-components";
import Search from "./Search";

Router.onRouteChangeStart = () => {
  NProgress.start();
};
Router.onRouteChangeComplete = () => {
  NProgress.done();
};
Router.onRouteChangeError = () => {
  NProgress.done();
};

const Logo = styled.h1`  
  margin: 0;
  position: relative;

  a {
    padding: 0.5rem 1rem;
    color: ${props => props.theme.offWhite};
    /* background: ${props => props.theme.red}; */
    text-decoration: none;
  }
`;

const StyledHeader = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: ${props => props.theme.gkRed};
  color: ${props => props.theme.offWhite};
  z-index: 100;

  .bar {
    border-bottom: 2px solid ${props => props.theme.black};
    display: grid;
    grid-template-columns: auto 1fr;
    justify-content: space-between;
    align-items: stretch;
    @media (max-width: 1300px) {
      grid-template-columns: 1fr;
      justify-content: center;
    }
  }
  .sub-bar {
    display: grid;
    grid-template-columns: 1fr auto;
    border-bottom: 1px solid ${props => props.theme.lightgrey};
  }
`;

const Header = props => {
  return (
    <StyledHeader>
      <div className="bar">
        <Logo>
          <Link href="/">
            <a>Gillette Kennels</a>
          </Link>
        </Logo>
      </div>
      <div className="sub-bar">
        <Search />
      </div>
      <Cart />
    </StyledHeader>
  );
};

Header.propTypes = {};

export default Header;
