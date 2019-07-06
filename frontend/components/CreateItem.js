import React, { useState } from "react";
import PropTypes from "prop-types";
import { Mutation } from "react-apollo";
import Router from "next/router";
import gql from "graphql-tag";
import Form from "./styles/Form";
import formatMoney from "../lib/formatMoney";
import Error from "../components/ErrorMessage";

const CREATE_ITEM_MUTATION = gql`
  mutation CREATE_ITEM_MUTATION(
    $title: String!
    $description: String!
    $price: Int!
    $image: String
    $largeImage: String
  ) {
    createItem(
      title: $title
      description: $description
      price: $price
      image: $image
      largeImage: $largeImage
    ) {
      id
    }
  }
`;

const CreateItem = props => {
  const [inputValues, setInputValues] = useState({
    title: "",
    description: "",
    image: "",
    largeImage: "",
    price: ""
  });

  function handleChange(e) {
    const { name, type, value } = e.target;
    const val = type === "number" ? parseFloat(value) : value;
    setInputValues({
      ...inputValues,
      [name]: val
    });
  }

  async function uploadFile(e) {
    console.log("uploading file", e);
    const files = e.target.files;
    const data = new FormData();
    data.append("file", files[0]);
    data.append("upload_preset", "vidaatl");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dhcv2fdfq/image/upload",
      {
        method: "POST",
        body: data
      }
    );

    const file = await res.json();
    setInputValues({
      ...inputValues,
      image: file.secure_url,
      largeImage: file.eager[0].secure_url
    });
  }

  return (
    <div>
      <Mutation mutation={CREATE_ITEM_MUTATION} variables={inputValues}>
        {(createItem, { loading, error }) => (
          <Form
            onSubmit={async e => {
              e.preventDefault();
              const res = await createItem();
              console.log(res);
              Router.push({
                pathname: "/item",
                query: { id: res.data.createItem.id }
              });
            }}
          >
            <Error error={error} />
            <fieldset disabled={loading} aria-busy={loading}>
              <label htmlFor="file">
                Image
                <input
                  type="file"
                  id="file"
                  name="file"
                  placeholder="Upload an image"
                  required
                  onChange={e => {
                    uploadFile(e);
                  }}
                />
                {inputValues.image && (
                  <img src={inputValues.image} alt="Upload preview" />
                )}
              </label>
              <label htmlFor="title">
                Title
                <input
                  value={inputValues.title}
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
                  value={inputValues.price}
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
                  value={inputValues.description}
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
    </div>
  );
};

CreateItem.propTypes = {};

export default CreateItem;
export { CREATE_ITEM_MUTATION };
