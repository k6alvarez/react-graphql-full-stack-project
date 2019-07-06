import React from "react";
import PropTypes from "prop-types";
import Reset from "../components/Reset";

const Sell = props => {
  return (
    <div>
      <p>Reset your password {props.query.resetToken}</p>
      <Reset resetToken={props.query.resetToken} />
    </div>
  );
};

Sell.propTypes = {};

export default Sell;
