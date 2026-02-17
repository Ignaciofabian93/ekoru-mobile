import { ENVIRONMENT } from "./environment";

const getEndpoints = () => {
  switch (ENVIRONMENT) {
    case "production":
      return {
        graphql: "https://gateway.ekoru.cl/graphql",
        rest: "https://gateway.ekoru.cl/session",
      };
    case "qa":
      return {
        graphql: "https://qa.gateway.ekoru.cl/graphql",
        rest: "https://qa.gateway.ekoru.cl/session",
      };
    default:
      return {
        graphql: "http://localhost:4000/graphql",
        rest: "http://localhost:4000/session",
      };
  }
};

const endpoints = getEndpoints();

export const GRAPHQL_URL = endpoints.graphql;
export const REST_URL = endpoints.rest;
