import { request } from "graphql-request";
import { useQuery } from "@tanstack/react-query";
import { GetCityQuery, GetCityDocument } from "@/graphql/documents";

const fetchCity = async (id: string) =>
  await request("/api/graphql", GetCityDocument, { id });

const useCity = (id: string) =>
  useQuery<GetCityQuery, Error>({
    queryKey: ["city", id],
    queryFn: () => fetchCity(id),
    enabled: !!id,
  });

export { useCity, fetchCity };
