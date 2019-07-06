import React, { useState } from "react";
import PropTypes from "prop-types";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import Form from "./styles/Form";
import Error from "./ErrorMessage";
import { CURRENT_USER_QUERY } from "./User";

const RESET_MUTATION = gql`
  mutation RESET_MUTATION(
    $resetToken: String!
    $password: String!
    $confirmPassword: String!
  ) {
    resetPassword(
      resetToken: $resetToken
      password: $password
      confirmPassword: $confirmPassword
    ) {
      id
      email
      name
    }
  }
`;

const Reset = props => {
  const [inputValues, setInputValues] = useState({
    password: "",
    confirmPassword: ""
  });

  function handleChange(e) {
    const { name, type, value } = e.target;
    const val = type === "number" ? parseFloat(value) : value;
    setInputValues({
      ...inputValues,
      [name]: val
    });
  }

  return (
    <Mutation
      mutation={RESET_MUTATION}
      variables={{
        resetToken: props.resetToken,
        password: inputValues.password,
        confirmPassword: inputValues.confirmPassword
      }}
      refetchQueries={[{ query: CURRENT_USER_QUERY }]}
    >
      {(reset, { error, loading }) => (
        <Form
          method="post"
          onSubmit={async e => {
            e.preventDefault();
            const res = await reset();
            setInputValues({
              password: "",
              confirmPassword: ""
            });
          }}
        >
          <fieldset disabled={loading} aria-busy={loading}>
            <p>Reset your password</p>
            <Error error={error} />
            <label htmlFor="password">
              Password
              <input
                type="password"
                name="password"
                placeholder="password"
                value={inputValues.password}
                onChange={handleChange}
              />
            </label>
            <label htmlFor="confirmPassword">
              Confirm password
              <input
                type="password"
                name="confirmPassword"
                placeholder="confirmPassword"
                value={inputValues.confirmPassword}
                onChange={handleChange}
              />
            </label>

            <button type="submit">Reset your password</button>
          </fieldset>
        </Form>
      )}
    </Mutation>
  );
};

Reset.propTypes = {
  resetToken: PropTypes.string.isRequired
};

export default Reset;
