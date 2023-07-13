import Map from "@/components/Map";
import Spots from "@/components/Spots";

export function SpotsWithMap({ id }: { id: string }) {
  return (
    <>
      <Spots id={id} />
      <div className="not-prose">
        <Map id={id} height="480px" />
      </div>
    </>
  );
}

export default SpotsWithMap;
