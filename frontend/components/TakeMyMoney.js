import React from "react";
import PropTypes from "prop-types";
import StripeCheckout from "react-stripe-checkout";
import { Mutation } from "react-apollo";
import Router from "next/router";
import NProgress from "nprogress";
import gql from "graphql-tag";
import calcTotalPrice from "../lib/calcTotalPrice";
import Error from "./ErrorMessage";
import User, { CURRENT_USER_QUERY } from "./User";

function totalItems(cart) {
  return cart.reduce((tally, cartItem) => tally + cartItem.quantity, 0);
}

const CREATE_ORDER_MUTATION = gql`
  mutation createOrder($token: String!) {
    createOrder(token: $token) {
      id
      charge
      total
      items {
        id
        title
      }
    }
  }
`;

const TakeMyMoney = props => {
  const onToken = async (res, createOrder) => {
    NProgress.start();
    const order = await createOrder({
      variables: {
        token: res.id
      }
    }).catch(err => {
      alert(err.message);
    });

    Router.push({
      pathname: "/order",
      query: { id: order.data.createOrder.id }
    });
  };

  return (
    <User>
      {({ data: { me } }) => (
        <Mutation
          mutation={CREATE_ORDER_MUTATION}
          refetchQueries={[{ query: CURRENT_USER_QUERY }]}
        >
          {createOrder => (
            <StripeCheckout
              name="GK App"
              description={`Order for ${totalItems(me.cart)} items.`}
              amount={calcTotalPrice(me.cart)}
              image={me.cart.length && me.cart[0].item && me.cart[0].item.image}
              stripeKey="pk_test_yPCmWZi67AfOH2xPOc8MXn9O00Xbb5Cp4y"
              currency="USD"
              email={me.email}
              token={res => onToken(res, createOrder)}
            >
              {props.children}
            </StripeCheckout>
          )}
        </Mutation>
      )}
    </User>
  );
};

TakeMyMoney.propTypes = {};

export default TakeMyMoney;
