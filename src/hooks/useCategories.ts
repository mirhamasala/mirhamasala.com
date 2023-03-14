import { request } from "graphql-request";
import { useQuery } from "@tanstack/react-query";
import { GetCategoriesQuery, GetCategoriesDocument } from "@/graphql/documents";

const fetchCategories = async (withSpots: boolean) =>
  await request("http://localhost:3000/api/graphql", GetCategoriesDocument, {
    withSpots,
  });

const useCategories = (withSpots: boolean) =>
  useQuery<GetCategoriesQuery, Error>({
    queryKey: ["categories"],
    queryFn: () => fetchCategories(withSpots),
  });

export { useCategories, fetchCategories };
