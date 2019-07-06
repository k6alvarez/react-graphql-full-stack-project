import React, { useState } from "react";
import PropTypes from "prop-types";
import { Mutation, Query } from "react-apollo";
import Router from "next/router";
import gql from "graphql-tag";
import Form from "./styles/Form";
import formatMoney from "../lib/formatMoney";
import Error from "./ErrorMessage";

const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    item(where: { id: $id }) {
      id
      title
      description
      price
    }
  }
`;

const UPDATE_ITEM_MUTATION = gql`
  mutation UPDATE_ITEM_MUTATION(
    $id: ID!
    $title: String
    $description: String
    $price: Int
  ) {
    updateItem(
      id: $id
      title: $title
      description: $description
      price: $price
    ) {
      id
      title
      description
      price
    }
  }
`;

const UpdateItem = props => {
  const [inputValues, setInputValues] = useState({});

  function handleChange(e) {
    const { name, type, value } = e.target;
    const val = type === "number" ? parseFloat(value) : value;
    setInputValues({
      ...inputValues,
      [name]: val
    });
  }

  async function handleFormSubmit(e, updateItem) {
    e.preventDefault();
    const res = await updateItem({
      variables: {
        id: props.id,
        ...inputValues
      }
    });
    console.log(res);
    // Router.push({
    //   pathname: "/item",
    //   query: { id: res.data.updateItem.id }
    // });
  }

  return (
    <div>
      <Query
        query={SINGLE_ITEM_QUERY}
        variables={{
          id: props.id
        }}
      >
        {({ data, loading }) => {
          if (loading) return <p>Loading</p>;
          if (!data.item) return <p>No item found</p>;
          return (
            <Mutation mutation={UPDATE_ITEM_MUTATION} variables={inputValues}>
              {(updateItem, { loading, error }) => (
                <Form onSubmit={e => handleFormSubmit(e, updateItem)}>
                  <Error error={error} />
                  <fieldset disabled={loading} aria-busy={loading}>
                    <label htmlFor="title">
                      Title
                      <input
                        defaultValue={data.item.title}
                        type="text"
                        id="title"
                        name="title"
                        placeholder="Title"
                        required
                        onChange={e => {
                          handleChange(e);
                        }}
                      />
                    </label>
                    <label htmlFor="price">
                      Price
                      <input
                        defaultValue={data.item.price}
                        type="number"
                        id="price"
                        name="price"
                        placeholder="price"
                        required
                        onChange={e => {
                          handleChange(e);
                        }}
                      />
                    </label>
                    <label htmlFor="description">
                      Description
                      <textarea
                        defaultValue={data.item.description}
                        id="description"
                        name="description"
                        placeholder="Enter a description"
                        required
                        onChange={e => {
                          handleChange(e);
                        }}
                      />
                    </label>
                    <button>Submit</button>
                  </fieldset>
                </Form>
              )}
            </Mutation>
          );
        }}
      </Query>
    </div>
  );
};

UpdateItem.propTypes = {};

export default UpdateItem;
export { UPDATE_ITEM_MUTATION };
