import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import formatMoney from "../lib/formatMoney";
import RemoveFromCart from "./RemoveFromCart";

const CartItemStyles = styled.li`
  padding: 5px;
  /* border-bottom: 1px solid white; */
  margin-bottom: 3px;
  display: grid;
  align-items: center;
  grid-template-columns: auto 1fr auto;

  img {
    margin-right: 5px;
  }
`;

const CartItem = ({ cartItem, ...props }) =>
  !cartItem.item ? (
    <CartItemStyles>
      <p>This item has been removed</p>
      <RemoveFromCart id={cartItem.id} />
    </CartItemStyles>
  ) : (
    <CartItemStyles>
      <img width="100" src={cartItem.item.image} alt={cartItem.item.title} />
      <div>
        <div>{cartItem.item.title} </div>
        {formatMoney(cartItem.item.price * cartItem.quantity)} {" - "}
        <em>
          {cartItem.quantity} &times; {formatMoney(cartItem.item.price)} each
        </em>
      </div>
      <RemoveFromCart id={cartItem.id} />
    </CartItemStyles>
  );

CartItem.propTypes = {};

export default CartItem;
