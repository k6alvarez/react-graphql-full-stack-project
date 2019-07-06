import React, { useState } from "react";
import PropTypes from "prop-types";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import Form from "./styles/Form";
import Error from "./ErrorMessage";

const REQUEST_RESET_MUTATION = gql`
  mutation REQUEST_RESET_MUTATION($email: String!) {
    requestReset(email: $email) {
      message
    }
  }
`;

const RequestReset = props => {
  const [inputValues, setInputValues] = useState({
    email: ""
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
    <Mutation mutation={REQUEST_RESET_MUTATION} variables={inputValues}>
      {(reset, { error, loading, called }) => (
        <Form
          method="post"
          onSubmit={async e => {
            e.preventDefault();
            const res = await reset();
            setInputValues({
              email: ""
            });
          }}
        >
          <fieldset disabled={loading} aria-busy={loading}>
            <p>Request a password reset</p>
            <Error error={error} />
            {!error && !loading && called && (
              <p>Success! Check your email for reset link.</p>
            )}
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

            <button type="submit">Request Reset!</button>
          </fieldset>
        </Form>
      )}
    </Mutation>
  );
};

RequestReset.propTypes = {};

export default RequestReset;
