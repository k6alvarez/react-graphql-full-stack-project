import React from "react";
import PropTypes from "prop-types";
import PaginationStyles from "./styles/PaginationStyles";
import gql from "graphql-tag";
import Head from "next/head";
import Link from "next/link";
import { Query } from "react-apollo";
import { perPage } from "../config";
import styled from "styled-components";

const PaginationStatus = styled.div`
  display: flex;
  flex-direction: column;
`;

const Page = styled.div`
  display: flex;
`;

const PageTotal = styled.div`
  display: flex;
  font-size: 12px;
  line-height: 12px;
  justify-content: center;
`;

const PAGINATION_QUERY = gql`
  query PAGINATION_QUERY {
    itemsConnection {
      aggregate {
        count
      }
    }
  }
`;

const Pagination = props => {
  return (
    <Query query={PAGINATION_QUERY}>
      {({ data, loading, error }) => {
        if (loading) return <p>Loading...</p>;
        const count = data.itemsConnection.aggregate.count;
        const pages = Math.ceil(count / perPage);
        return (
          <PaginationStyles>
            <Head>
              <title>
                Gillette Kennels | Page {props.page} of {pages}
              </title>
            </Head>
            <Link
              prefetch
              href={{
                pathName: "items",
                query: { page: props.page - 1 }
              }}
            >
              <a aria-disabled={props.page <= 1}>Prev</a>
            </Link>
            <PaginationStatus>
              <Page>
                Page {props.page} of {pages}
              </Page>
              <PageTotal>{count} Items Total</PageTotal>
            </PaginationStatus>
            <Link
              prefetch
              href={{
                pathName: "items",
                query: { page: props.page + 1 }
              }}
            >
              <a aria-disabled={props.page >= pages}>Next</a>
            </Link>
          </PaginationStyles>
        );
      }}
    </Query>
  );
};

Pagination.propTypes = {};

export default Pagination;
