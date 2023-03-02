import { request } from "graphql-request";
import { useQuery } from "@tanstack/react-query";
import { GetCityQuery, GetCityDocument } from "@/graphql/documents";

function useCity(id: string) {
  const {
    data: { city } = { city: { spots: [] } },
    isLoading,
    isError,
    error,
  } = useQuery<GetCityQuery, Error>({
    queryKey: ["city"],
    queryFn: async () => await request("/api/graphql", GetCityDocument, { id }),
    enabled: !!id,
  });

  return {
    spots: city.spots,
    isLoading,
    isError,
    error,
  };
}

export default useCity;
