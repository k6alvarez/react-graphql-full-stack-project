import React from "react";
import PropTypes from "prop-types";
import Signup from "../components/Signup";
import Signin from "../components/Signin";
import RequestReset from "../components/RequestReset";
import styled from "styled-components";

const Columns = styled.div`
  display: flex;
`;

const SignupPage = props => {
  return (
    <Columns>
      <Signup />
      <Signin />
      <RequestReset />
    </Columns>
  );
};

SignupPage.propTypes = {};

export default SignupPage;
