import React from "react";
import PropTypes from "prop-types";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import styled from "styled-components";
import Item from "./Item";
import Pagination from "../components/Pagination";
import { perPage } from "../config";

const Center = styled.div`
  text-align: center;
`;

const ALL_ITEMS_QUERY = gql`
  query ALL_ITEMS_QUERY($skip: Int = 0, $first: Int = ${perPage}) {
    items(first: $first, skip: $skip, orderBy: createdAt_DESC) {
      id
      title
      price
      description
      image
      largeImage
    }
  }
`;

const ItemsList = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  margin: 1rem auto;
`;

const Items = props => {
  return (
    <Center>
      <Pagination page={props.page} />
      <Query
        query={ALL_ITEMS_QUERY}
        // fetchPolicy={"network-only"}
        variables={{
          skip: props.page * perPage - perPage
        }}
      >
        {({ data, error, loading }) => {
          if (loading) {
            return <p>Loading...</p>;
          }

          if (error) {
            return <p>Error: {error.message}</p>;
          }
          return (
            <ItemsList>
              {data.items.map(item => (
                <Item key={item.id} item={item} />
              ))}
            </ItemsList>
          );
        }}
      </Query>
      <Pagination page={props.page} />
    </Center>
  );
};

Items.propTypes = {};

export default Items;
export { ALL_ITEMS_QUERY };
