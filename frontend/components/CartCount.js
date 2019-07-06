import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { useSpring, animated } from "react-spring";

const Dot = styled.div`
  background-color: ${props => props.theme.red};
  color: white;
  padding: 5px;
  font-size: 12px;
  height: 25px;
  width: 25px;
`;

const CartCount = ({ count }) => {
  const props = useSpring({ count: count });

  return (
    <Dot>
      <animated.div>{props.count.interpolate(x => x.toFixed(0))}</animated.div>
    </Dot>
  );
};

CartCount.propTypes = {};

export default CartCount;
