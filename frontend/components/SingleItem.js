import React from "react";
import PropTypes from "prop-types";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import Error from "./ErrorMessage";
import styled from "styled-components";
import Head from "next/head";

const SingleItemStyles = styled.div`
  margin: 1rem;
  display: flex;
  flex-direction: column;

  img {
    max-width: 100%;
    object-fit: contain;
  }
`;

const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    item(where: { id: $id }) {
      id
      title
      description
      largeImage
    }
  }
`;

const SingleItem = props => {
  return (
    <Query
      query={SINGLE_ITEM_QUERY}
      variables={{
        id: props.id
      }}
    >
      {({ error, loading, data }) => {
        if (error) return <Error error={error} />;
        if (loading) return <p>Loading!</p>;
        console.log(data.item);
        if (!data.item) return <p>No Item found!</p>;
        const item = data.item;
        return (
          <SingleItemStyles>
            <Head>
              <title>Gillette Kennels | {item.title}</title>
            </Head>
            <img src={item.largeImage} alt={item.title} />
            <div>
              <h2>{item.title}</h2>
              <p>{item.description}</p>
            </div>
          </SingleItemStyles>
        );
      }}
    </Query>
  );
};

SingleItem.propTypes = {};

export default SingleItem;
