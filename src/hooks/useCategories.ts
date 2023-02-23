import { useState, useEffect } from "react";
import { GraphQLClient } from "graphql-request";

import { getSdk } from "@/graphql/documents";

type Status = "idle" | "pending" | "rejected" | "resolved";

function useCategories({ withSpots }: { withSpots: boolean }) {
  const [categories, setCategories] = useState([]);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState(null);

  useEffect(() => {
    const client = new GraphQLClient("/api/graphql");
    const sdk = getSdk(client);

    const fetchCategories = async () => {
      setStatus("pending");
      try {
        const { categories } = await sdk.GetCategories({
          withSpots,
        });
        setCategories(categories);
        setStatus("resolved");
      } catch (error) {
        setError(error.message);
        setStatus("rejected");
      }
    };

    fetchCategories();
  }, [withSpots]);

  return {
    categories,
    error,
    isLoading: status === "idle" || status === "pending",
    isResolved: status === "resolved",
    isRejected: status === "rejected",
  };
}

export default useCategories;
