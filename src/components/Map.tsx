import React, { useMemo, useState } from "react";
import {
  GoogleMap,
  InfoWindowF,
  LoadScript,
  MarkerF,
} from "@react-google-maps/api";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Link } from "@/components/Link";
import { cities } from "@/data/cities";
import { Spot } from "@/graphql/documents";
import { useCity } from "@/hooks/useCity";

export type MapProps = {
  id: string;
  height?: string;
  zoom?: number;
};

type LatLngLiteral = google.maps.LatLngLiteral;
type MapOptions = google.maps.MapOptions;
type MapSpot = Omit<Spot, "category" | "city" | "published" | "url">;

function Map({ id, height = "60vh", zoom = 13 }: MapProps) {
  const { data, isLoading, isError, error } = useCity(id);

  const [isOpenInfoWindow, setIsOpenInfoWindow] = useState(false);
  const [selectedSpot, setSelectedSpot] = useState<MapSpot | undefined>();

  const centerMemoized = useMemo<LatLngLiteral>(
    () => ({ lat: cities[id].geo.latitude, lng: cities[id].geo.longitude }),
    [id]
  );

  const mapOptions = useMemo<MapOptions>(
    () => ({
      disableDefaultUI: true,
      clickableIcons: false,
    }),
    []
  );

  function openInfoWindow(spot: MapSpot) {
    setSelectedSpot(spot);
    setIsOpenInfoWindow(true);
  }

  if (isLoading) return <div>Loading...</div>;

  if (isError) return <div>Oops. {error.message}</div>;

  return (
    <GoogleMap
      mapContainerStyle={{ height: height, width: "100%" }}
      center={centerMemoized}
      options={mapOptions}
      zoom={zoom}
    >
      <>
        {isOpenInfoWindow && selectedSpot && (
          <InfoWindowF
            position={{
              lat: selectedSpot.geo.latitude,
              lng: selectedSpot.geo.longitude,
            }}
            options={{
              pixelOffset: new window.google.maps.Size(0, -40),
              maxWidth: 300,
            }}
            onCloseClick={() => setIsOpenInfoWindow(false)}
          >
            <div style={{ padding: "0.125rem", color: "#18181b" }}>
              <header
                style={{
                  marginBottom: "0.375rem",
                  fontSize: "0.875rem",
                  fontWeight: 400,
                }}
              >
                {selectedSpot.name}
              </header>
              <main
                style={{
                  marginBottom: "0.75rem",
                  fontSize: "0.75rem",
                  fontWeight: 300,
                }}
              >
                <p style={{ lineHeight: 1.25 }}>{selectedSpot.description}</p>
              </main>
              <footer
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 400,
                  color: "#0f766e",
                }}
              >
                <Link href={selectedSpot.googleMapsUrl}>
                  View in Google Maps
                </Link>
                <span style={{ paddingLeft: "0.5rem", paddingRight: "0.5rem" }}>
                  ·
                </span>
                <Link href={`${cities[id].post}#${selectedSpot.slug}`}>
                  View in Post
                </Link>
              </footer>
            </div>
          </InfoWindowF>
        )}
        {data.city.spots.map((spot) => (
          <MarkerF
            key={spot.slug}
            options={{
              icon: {
                scaledSize: new window.google.maps.Size(56, 56),
                url: spot.category.marker,
              },
            }}
            position={{
              lat: spot.geo.latitude,
              lng: spot.geo.longitude,
            }}
            onClick={() => openInfoWindow(spot)}
            onMouseOver={() => openInfoWindow(spot)}
          />
        ))}
      </>
    </GoogleMap>
  );
}

function WrappedMap(props: MapProps) {
  let googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  return (
    <QueryClientProvider client={new QueryClient()}>
      <LoadScript googleMapsApiKey={googleMapsApiKey}>
        <Map {...props} />
      </LoadScript>
    </QueryClientProvider>
  );
}

export default WrappedMap;
