import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import { CURRENT_USER_QUERY } from "./User";

const REMOVE_FROM_CART_MUTATION = gql`
  mutation removeFromCart($id: ID!) {
    removeFromCart(id: $id) {
      id
    }
  }
`;

const Remove = styled.button`
  font-size: 10px;
`;

const RemoveFromCart = ({ id, ...props }) => {
  const update = (cache, payload) => {
    //read cache from apollo
    const data = cache.readQuery({
      query: CURRENT_USER_QUERY
    });
    //remove item from cart
    const cartItemId = payload.data.removeFromCart.id;
    data.me.cart = data.me.cart.filter(cartItem => cartItem.id !== cartItemId);

    //write it back to cache
    cache.writeQuery({ query: CURRENT_USER_QUERY, data });
  };

  return (
    <Mutation
      mutation={REMOVE_FROM_CART_MUTATION}
      variables={{ id }}
      update={update}
      //will optimistically reply with this info but run the query in the background
      optimisticResponse={{
        __typename: "Mutation",
        removeFromCart: {
          __typename: "CartItem",
          id: id
        }
      }}
    >
      {(removeFromCart, { loading, error }) => (
        <Remove
          disabled={loading}
          onClick={() => {
            removeFromCart().catch(err => alert(err.message));
          }}
        >
          &times; Remove
        </Remove>
      )}
    </Mutation>
  );
};

RemoveFromCart.propTypes = {
  id: PropTypes.string.isRequired
};

export default RemoveFromCart;
