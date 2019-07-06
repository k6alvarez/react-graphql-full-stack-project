import React from "react";
import PropTypes from "prop-types";
import Items from "../components/Items";

const Home = props => {
  return (
    <div>
      <Items page={parseFloat(props.query.page) || 1} />
    </div>
  );
};

Home.propTypes = {};

export default Home;
