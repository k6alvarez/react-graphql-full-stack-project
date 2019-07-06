import React from "react";
import PropTypes from "prop-types";
import Order from "../components/Order";

const OrderPage = props => {
  return <Order id={props.query.id} />;
};

OrderPage.propTypes = {};

export default OrderPage;
