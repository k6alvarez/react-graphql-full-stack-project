import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Query, Mutation } from "react-apollo";
import Error from "./ErrorMessage";
import gql from "graphql-tag";
import Table from "../components/styles/Table";

const possiblePermissions = [
  "ADMIN",
  "USER",
  "ITEMCREATE",
  "ITEMUPDATE",
  "ITEMDELETE",
  "PERMISSIONUPDATE"
];

const UPDATE_PERMISSIONS_MUTATION = gql`
  mutation updatePermissions($permissions: [Permission], $userId: ID!) {
    updatePermissions(permissions: $permissions, userId: $userId) {
      id
      permissions
      name
      email
    }
  }
`;

const ALL_USERS_QUERY = gql`
  query {
    users {
      id
      name
      email
      permissions
    }
  }
`;

const Permissions = props => {
  return (
    <Query query={ALL_USERS_QUERY}>
      {({ data, loading, error }) => (
        <div>
          <Error error={error} />
          <div>
            <h2>Manage Permissions</h2>
            <Table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  {possiblePermissions.map(permission => (
                    <th key={permission}>{permission}</th>
                  ))}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {!loading &&
                  data.users.map(user => (
                    <UserPermissions key={user.id} user={user} />
                  ))}
              </tbody>
            </Table>
          </div>
        </div>
      )}
    </Query>
  );
};

const UserPermissions = ({ user, ...props }) => {
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    setPermissions(user.permissions);
  }, [user.permissions]);

  const handlePermissionChange = e => {
    const checkbox = e.target;
    let updatedPermissions = [...permissions];
    if (checkbox.checked) {
      updatedPermissions.push(checkbox.value);
    } else {
      updatedPermissions = updatedPermissions.filter(
        permission => permission !== checkbox.value
      );
    }
    setPermissions(updatedPermissions);
  };

  return (
    <Mutation
      mutation={UPDATE_PERMISSIONS_MUTATION}
      variables={{
        permissions,
        userId: user.id
      }}
    >
      {(updatePermissions, { loading, error }) => (
        <React.Fragment>
          {error && <Error error={error} />}
          <tr>
            <td>{user.name}</td>
            <td>{user.email}</td>
            {possiblePermissions.map((permission, index) => (
              <td key={permission}>
                <label htmlFor={`${user.id}-permission=${permission}`}>
                  <input
                    id={`${user.id}-permission=${permission}`}
                    type="checkbox"
                    checked={permissions.includes(permission)}
                    value={permission}
                    onChange={handlePermissionChange}
                  />
                </label>
              </td>
            ))}
            <td>
              <button
                type="button"
                disabled={loading}
                onClick={updatePermissions}
              >
                Updat{loading ? "ing" : "e"}
              </button>
            </td>
          </tr>
        </React.Fragment>
      )}
    </Mutation>
  );
};

UserPermissions.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    id: PropTypes.string,
    permissions: PropTypes.array
  }).isRequired
};

Permissions.propTypes = {};

export default Permissions;
