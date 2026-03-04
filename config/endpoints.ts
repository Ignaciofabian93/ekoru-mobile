import { ENVIRONMENT } from "./environment";

const getEndpoints = () => {
  switch (ENVIRONMENT) {
    case "production":
      return {
        base: "https://gateway.ekoru.cl",
        graphql: "https://gateway.ekoru.cl/graphql",
        rest: "https://gateway.ekoru.cl/session",
      };
    case "qa":
      return {
        base: "https://qa.gateway.ekoru.cl",
        graphql: "https://qa.gateway.ekoru.cl/graphql",
        rest: "https://qa.gateway.ekoru.cl/session",
      };
    default: {
      const devBase =
        process.env.EXPO_PUBLIC_GATEWAY_URL ?? "http://192.168.0.8:4000";
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
