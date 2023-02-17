import { useState, useEffect } from "react";

import { type Category } from "@/graphql/documents";
import { getCategories } from "@/graphql/queries";

type StatusProps = "idle" | "pending" | "rejected" | "resolved";

function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [status, setStatus] = useState<StatusProps>("idle");
  const [error, setError] = useState(null);

  useEffect(() => {
    setStatus("pending");

    getCategories()
      .then((data) => {
        setCategories(data);
        setStatus("resolved");
      })
      .catch((error) => {
        setError(error.message);
        setStatus("rejected");
      });
  }, []);

  return {
    categories,
    error,
    isLoading: status === "idle" || status === "pending",
    isResolved: status === "resolved",
    isRejected: status === "rejected",
  };
}

export default useCategories;
