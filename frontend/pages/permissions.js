import React from "react";
import PropTypes from "prop-types";
import PleaseSignin from "../components/PleaseSignin";
import Permissions from "../components/Permissions";

const PermissionsPage = props => {
  return (
    <PleaseSignin>
      <Permissions />
    </PleaseSignin>
  );
};

PermissionsPage.propTypes = {};

export default PermissionsPage;
