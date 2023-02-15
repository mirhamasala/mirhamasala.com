import { useState, useEffect } from "react";
import { getCategories } from "@/graphql/queries";
import { type Category } from "@/graphql/documents";

function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    getCategories().then(setCategories);

    setLoading(false);
  }, []);


  return {categories, loading};
}

export default useCategories;
