import React from "react";
import PropTypes from "prop-types";
import CreateItem from "../components/CreateItem";
import PleaseSignin from "../components/PleaseSignin";

const Sell = props => {
  return (
    <div>
      <PleaseSignin>
        <CreateItem />
      </PleaseSignin>
    </div>
  );
};

Sell.propTypes = {};

export default Sell;
