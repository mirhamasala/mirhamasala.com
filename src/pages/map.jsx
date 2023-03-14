import Categories from "@/components/Categories";
import { SimpleLayout } from "@/components/SimpleLayout";

function Map() {
  return (
    <SimpleLayout title="Map" intro="My favorite places in the world.">
      <Categories withSpots={false} />
    </SimpleLayout>
  );
}

export default Map;
