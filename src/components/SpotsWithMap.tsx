import Map from "@/components/Map";
import Spots from "@/components/Spots";

export function SpotsWithMap({ id }: { id: string }) {
  return (
    <>
      <figure className="not-prose">
        <Map id={id} height="480px" />
      </figure>
      <Spots id={id} />
    </>
  );
}

export default SpotsWithMap;
