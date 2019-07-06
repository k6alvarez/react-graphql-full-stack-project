import React from "react";
import PropTypes from "prop-types";
import { Query } from "react-apollo";
import { format } from "date-fns";
import Head from "next/head";
import gql from "graphql-tag";
import formatMoney from "../lib/formatMoney";
import Error from "../components/ErrorMessage";
import OrderStyles from "../components/styles/OrderStyles";
import styled from "styled-components";

const StyledItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const SINGLE_ORDER_QUERY = gql`
  query SINGLE_ORDER_QUERY($id: ID!) {
    order(id: $id) {
      id
      charge
      total
      createdAt
      user {
        id
      }
      items {
        id
        title
        description
        price
        image
        quantity
      }
    }
  }
`;

const Order = props => {
  return (
    <Query query={SINGLE_ORDER_QUERY} variables={{ id: props.id }}>
      {({ data, error, loading }) => {
        if (error) return <Error error={error} />;
        if (loading) return <p>Loading...</p>;
        const { order } = data;

        return (
          <OrderStyles>
            <Head>
              <title>Order {order.id}</title>
            </Head>
            <p>Order {props.id}</p>
            <p>Charge {order.charge}</p>
            <p>Date {format(order.createdAt, "MMMM d, YYYY h:mm a")}</p>
            <p>Total {formatMoney(order.charge)}</p>
            <p>Item Count {order.items.length}</p>
            <div>
              {order.items.map(item => (
                <StyledItem key={item.id}>
                  <img alt={item.title} src={item.image} />
                  <span>{item.title}</span>
                  <span>Qty: {item.quantity}</span>
                  <span>Each: {formatMoney(item.price)}</span>
                  <span>
                    SubTotal: {formatMoney(item.price * item.quantity)}
                  </span>
                  <p>{item.description}</p>
                </StyledItem>
              ))}
            </div>
          </OrderStyles>
        );
      }}
    </Query>
  );
};

Order.propTypes = {
  id: PropTypes.string.isRequired
};

export default Order;
