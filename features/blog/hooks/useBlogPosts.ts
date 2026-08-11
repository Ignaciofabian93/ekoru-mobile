import { useQuery } from "@apollo/client/react";
import { useState } from "react";

import { GET_BLOG_POSTS_BY_CATEGORY } from "@/graphql/blog/queries";

import type { BlogPost, PageInfo } from "../types";

export default function useBlogPosts({
  categorySlug,
  language,
}: {
  categorySlug: string;
  language: string;
}) {
  const [page, setPage] = useState(1);

  const { data, loading, error, previousData } = useQuery<{
    getBlogPostsByCategory: { nodes: BlogPost[]; pageInfo: PageInfo };
  }>(GET_BLOG_POSTS_BY_CATEGORY, {
    variables: { categorySlug, language: language.toUpperCase(), page, pageSize: 12 },
    skip: !categorySlug,
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  return {
    posts:
      data?.getBlogPostsByCategory.nodes ??
      previousData?.getBlogPostsByCategory.nodes ??
      [],
    pageInfo:
      data?.getBlogPostsByCategory.pageInfo ??
      previousData?.getBlogPostsByCategory.pageInfo,
    loading,
    error,
    page,
    setPage,
  };
}
