import React from "react";
import PropTypes from "prop-types";
import { Query } from "react-apollo";
import { formatDistance } from "date-fns";
import Link from "next/link";
import styled from "styled-components";
import gql from "graphql-tag";
import formatMoney from "../lib/formatMoney";
import OrderItemStyles from "./styles/OrderItemStyles";
import Error from "./ErrorMessage";

const USER_ORDERS_QUERY = gql`
  query USER_ORDERS_QUERY {
    orders(orderBy: createdAt_DESC) {
      id
      total
      createdAt
      items {
        id
        title
        price
        description
        quantity
        image
      }
    }
  }
`;

const StyledOrderList = styled.div`
  display: flex;
  flex-direction: column;
`;

const OrderList = props => {
  return (
    <Query query={USER_ORDERS_QUERY}>
      {({ data: { orders }, loading, error }) => {
        if (loading) return <p>Loading...</p>;
        if (error) return <Error error={error} />;
        console.log(orders);
        return (
          <div>
            <p>You have {orders.length} Orders</p>
            <StyledOrderList>
              {orders.map(order => (
                <OrderItemStyles key={order.id}>
                  <Link
                    href={{
                      pathname: "/order",
                      query: { id: order.id }
                    }}
                  >
                    <a>
                      <div>
                        <p>
                          {order.items.reduce((a, b) => a + b.quantity, 0)}{" "}
                          Items
                        </p>
                        <p>{formatDistance(order.createdAt, new Date())}</p>
                      </div>
                      <div>
                        {order.items.map(item => (
                          <div>
                            <img width="75" src={item.image} alt={item.title} />
                            <span>x{item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </a>
                  </Link>
                </OrderItemStyles>
              ))}
            </StyledOrderList>
          </div>
        );
      }}
    </Query>
  );
};

OrderList.propTypes = {};

export default OrderList;
