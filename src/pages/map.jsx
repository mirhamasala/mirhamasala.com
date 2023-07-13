import Map from "@/components/Map";
import { SimpleLayout } from "@/components/SimpleLayout";

function MapPage() {
  return (
    <SimpleLayout title="Map" intro="My favorite places in the world.">
      <Map id="all" />
    </SimpleLayout>
  );
}

export default MapPage;
