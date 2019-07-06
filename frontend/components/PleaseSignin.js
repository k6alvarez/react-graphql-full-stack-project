import React from "react";
import PropTypes from "prop-types";
import { Query } from "react-apollo";
import { CURRENT_USER_QUERY } from "./User";
import Signin from "./Signin";

const PleaseSignin = props => {
  return (
    <Query query={CURRENT_USER_QUERY}>
      {({ data, loading }) => {
        if (loading) {
          <p>Loading...</p>;
        }
        if (!data.me) {
          return (
            <div>
              <p>Must be signed in to view</p>
              <Signin />
            </div>
          );
        }

        return props.children;
      }}
    </Query>
  );
};

PleaseSignin.propTypes = {};

export default PleaseSignin;
