import React from "react";
import PropTypes from "prop-types";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import { ALL_ITEMS_QUERY } from "./Items";

const DELETE_ITEM_MUTATAION = gql`
  mutation DELETE_ITEM_MUTATAION($id: ID!) {
    deleteItem(id: $id) {
      id
    }
  }
`;

const DeleteItem = props => {
  function update(store, payload) {
    //manually update cache on client to match server
    const data = store.readQuery({ query: ALL_ITEMS_QUERY });
    data.items = data.items.filter(item => {
      return item.id !== payload.data.deleteItem.id;
    });
    store.writeQuery({ query: ALL_ITEMS_QUERY, data });
  }

  return (
    <Mutation
      mutation={DELETE_ITEM_MUTATAION}
      variables={{
        id: props.id
      }}
      update={update}
    >
      {(deleteItem, { error }) => (
        <button
          onClick={() => {
            if (confirm("Are you sure?")) {
              deleteItem().catch(err => {
                alert(err.message);
              });
            }
          }}
        >
          {props.children}
        </button>
      )}
    </Mutation>
  );
};

DeleteItem.propTypes = {};

export default DeleteItem;
