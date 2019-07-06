import React from "react";
import PropTypes from "prop-types";
import SingleItem from "../components/SingleItem";

const Item = props => {
  return (
    <div>
      <SingleItem id={props.query.id} />
    </div>
  );
};

Item.propTypes = {};

export default Item;
