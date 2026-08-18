import { ENVIRONMENT } from "./environment";

const getEndpoints = () => {
  switch (ENVIRONMENT) {
    case "production":
      return {
        base: "https://api.ekoru.cl",
        graphql: "https://api.ekoru.cl/graphql",
        rest: "https://api.ekoru.cl/session",
      };
    case "staging":
      return {
        base: "https://staging-api.ekoru.cl",
        graphql: "https://staging-api.ekoru.cl/graphql",
        rest: "https://staging-api.ekoru.cl/session",
      };
    default: {
      const devBase = "https://staging-api.ekoru.cl";
      return {
        base: devBase,
        graphql: `${devBase}/graphql`,
        rest: `${devBase}/session`,
      };
    }
  }
};

const endpoints = getEndpoints();

export const GATEWAY_BASE_URL = endpoints.base;
export const GRAPHQL_URL = endpoints.graphql;
export const REST_URL = endpoints.rest;
