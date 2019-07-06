import React, { useState } from "react";
import PropTypes from "prop-types";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import Form from "./styles/Form";
import Error from "./ErrorMessage";
import { CURRENT_USER_QUERY } from "./User";

const SIGNIN_MUTATION = gql`
  mutation SIGNIN_MUTATION($email: String!, $password: String!) {
    signin(email: $email, password: $password) {
      id
      email
      name
    }
  }
`;

const Signin = props => {
  const [inputValues, setInputValues] = useState({
    email: "",
    password: ""
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
      mutation={SIGNIN_MUTATION}
      variables={inputValues}
      refetchQueries={[{ query: CURRENT_USER_QUERY }]}
    >
      {(signin, { error, loading }) => (
        <Form
          method="post"
          onSubmit={async e => {
            e.preventDefault();
            const res = await signin();
            console.log(res);
            setInputValues({
              email: "",
              password: ""
            });
          }}
        >
          <fieldset disabled={loading} aria-busy={loading}>
            <p>Sign into your account</p>
            <Error error={error} />
            <label htmlFor="email">
              email
              <input
                type="email"
                name="email"
                placeholder="email"
                value={inputValues.email}
                onChange={handleChange}
              />
            </label>

            <label htmlFor="password">
              password
              <input
                type="password"
                name="password"
                placeholder="password"
                value={inputValues.password}
                onChange={handleChange}
              />
            </label>
            <button type="submit">Sign In!</button>
          </fieldset>
        </Form>
      )}
    </Mutation>
  );
};

Signin.propTypes = {};

export default Signin;
