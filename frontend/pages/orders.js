import React from "react";
import PropTypes from "prop-types";
import OrderList from "../components/OrderList";
import PleaseSignin from "../components/PleaseSignin";

const OrdersPage = props => {
  return (
    <div>
      <PleaseSignin>
        <OrderList />
      </PleaseSignin>
    </div>
  );
};

OrdersPage.propTypes = {};

export default OrdersPage;
