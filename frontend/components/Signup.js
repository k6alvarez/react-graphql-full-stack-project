import React, { useState } from "react";
import PropTypes from "prop-types";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import Form from "./styles/Form";
import Error from "./ErrorMessage";
import { CURRENT_USER_QUERY } from "./User";

const SIGNUP_MUTATION = gql`
  mutation SIGNUP_MUTATION(
    $email: String!
    $name: String!
    $password: String!
  ) {
    signup(email: $email, name: $name, password: $password) {
      id
      email
      name
    }
  }
`;

const Signup = props => {
  const [inputValues, setInputValues] = useState({
    name: "",
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
      mutation={SIGNUP_MUTATION}
      variables={inputValues}
      refetchQueries={[{ query: CURRENT_USER_QUERY }]}
    >
      {(signup, { error, loading }) => (
        <Form
          method="post"
          onSubmit={async e => {
            e.preventDefault();
            const res = await signup();
            console.log(res);
            setInputValues({
              name: "",
              email: "",
              password: ""
            });
          }}
        >
          <fieldset disabled={loading} aria-busy={loading}>
            <p>Signup for an account</p>
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
            <label htmlFor="name">
              name
              <input
                type="text"
                name="name"
                placeholder="name"
                value={inputValues.name}
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
            <button type="submit">Signup!</button>
          </fieldset>
        </Form>
      )}
    </Mutation>
  );
};

Signup.propTypes = {};

export default Signup;
