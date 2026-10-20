import { ENVIRONMENT } from "./environment";

const getEndpoints = () => {
  switch (ENVIRONMENT) {
    case "production":
      return {
        base: "https://api.ekoru.cl",
        graphql: "https://api.ekoru.cl/graphql",
        rest: "https://api.ekoru.cl/session",
        web: "https://app.ekoru.cl",
      };
    case "staging":
      return {
        base: "https://staging-api.ekoru.cl",
        graphql: "https://staging-api.ekoru.cl/graphql",
        rest: "https://staging-api.ekoru.cl/session",
        web: "https://staging-app.ekoru.cl",
      };
    default: {
      const devBase = "https://staging-api.ekoru.cl";
      return {
        base: devBase,
        graphql: `${devBase}/graphql`,
        rest: `${devBase}/session`,
        web: "https://staging-app.ekoru.cl",
      };
    }
  }
};

const endpoints = getEndpoints();

export const GATEWAY_BASE_URL = endpoints.base;
export const GRAPHQL_URL = endpoints.graphql;
export const REST_URL = endpoints.rest;
/** The web app, for what only the web can do (the Mercado Pago connection, MOB-6). */
export const WEB_APP_BASE_URL = endpoints.web;
