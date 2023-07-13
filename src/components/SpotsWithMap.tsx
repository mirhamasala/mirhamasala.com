import Map from "@/components/Map";
import Spots from "@/components/Spots";

export function SpotsWithMap({ id }: { id: string }) {
  return (
    <>
      <div className="not-prose">
        <Map id={id} height="480px" />
      </div>
      <Spots id={id} />
    </>
  );
}

export default SpotsWithMap;
