import { useState, useEffect } from "react";
import { getCategories } from "@/graphql/queries";

function useCategories() {
  const [categoriesWithSpots, setCategoriesWithSpots] = useState([]);

  useEffect(() => {
    getCategories().then(setCategoriesWithSpots);
  }, []);

  return categoriesWithSpots;
}

export default useCategories;
