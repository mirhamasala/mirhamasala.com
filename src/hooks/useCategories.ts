import { request } from "graphql-request";
import { useQuery } from "@tanstack/react-query";
import { GetCategoriesQuery, GetCategoriesDocument } from "@/graphql/documents";

function useCategories({
  withSpots,
  city,
}: {
  withSpots: boolean;
  city: string;
}) {
  const {
    data: { categories } = { categories: [] },
    isLoading,
    isError,
    error,
  } = useQuery<GetCategoriesQuery, Error>({
    queryKey: ["categories"],
    queryFn: async () =>
      await request("/api/graphql", GetCategoriesDocument, { withSpots, city }),
    enabled: !!withSpots && !!city,
  });

  return {
    categories,
    isLoading,
    isError,
    error,
  };
}

export default useCategories;
