import React from "react";
import PropTypes from "prop-types";
import UpdateItem from "../components/UpdateItem";

const Update = ({ query }) => {
  return (
    <div>
      <UpdateItem id={query.id} />
    </div>
  );
};

Update.propTypes = {};

export default Update;
