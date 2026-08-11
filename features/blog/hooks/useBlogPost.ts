import { useQuery } from "@apollo/client/react";

import { GET_BLOG_POST_BY_SLUG } from "@/graphql/blog/queries";

import type { BlogPost } from "../types";

export default function useBlogPost(slug: string, language: string) {
  const { data, loading, error } = useQuery<{ getBlogPostBySlug: BlogPost }>(
    GET_BLOG_POST_BY_SLUG,
    {
      variables: { slug, language: language.toUpperCase() },
      skip: !slug,
      fetchPolicy: "cache-and-network",
    },
  );

  return { post: data?.getBlogPostBySlug ?? null, loading, error };
}
