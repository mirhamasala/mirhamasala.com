import { useState, useEffect } from "react";
import { getCategoriesWithSpots } from "@/graphql/queries";

function useCategoriesWithSpots() {
  const [categoriesWithSpots, setCategoriesWithSpots] = useState([]);

  useEffect(() => {
    getCategoriesWithSpots().then(setCategoriesWithSpots);
  }, []);

  return categoriesWithSpots;
}

export default useCategoriesWithSpots;
