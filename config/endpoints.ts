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
        base: "https://api.staging.ekoru.cl",
        graphql: "https://api.staging.ekoru.cl/graphql",
        rest: "https://api.staging.ekoru.cl/session",
      };
    default: {
      const devBase = "https://api.staging.ekoru.cl";
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
