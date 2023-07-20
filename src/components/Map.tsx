import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  GoogleMap,
  InfoWindowF as InfoWindow,
  MarkerF as Marker,
  useLoadScript,
} from "@react-google-maps/api";

import { Link } from "@/components/Link";
import { type PublishedSpotWithCategoryAndCity } from "@/types/spots.type";

type Props = {
  center: {
    latitude: number;
    longitude: number;
  };
  height?: string;
  zoom?: number;
  spots: PublishedSpotWithCategoryAndCity[];
};

function Map({ center, height = "60vh", zoom = 13, spots }: Props) {
  const [selectedSpot, setSelectedSpot] =
    useState<PublishedSpotWithCategoryAndCity | null>(null);

  const mapRef = useRef<google.maps.Map | null>(null);
  const centerMemoized = useMemo<google.maps.LatLngLiteral>(
    () => ({ lat: center.latitude, lng: center.longitude }),
    [center]
  );
  const options = useMemo<google.maps.MapOptions>(
    () => ({
      disableDefaultUI: true,
      clickableIcons: false,
    }),
    []
  );
  const onLoad = useCallback((map: google.maps.Map | null) => {
    if (map) {
      mapRef.current = map;
    }
  }, []);

  function openInfoWindow(spot: PublishedSpotWithCategoryAndCity) {
    setSelectedSpot(spot);
  }

  function closeInfoWindow() {
    setSelectedSpot(null);
  }

  return (
    <GoogleMap
      mapContainerStyle={{
        height: height,
        width: "100%",
        borderRadius: "1.5rem",
      }}
      center={centerMemoized}
      onLoad={onLoad}
      options={options}
      zoom={zoom}
    >
      {selectedSpot && (
        <InfoWindow
          position={{
            lat: selectedSpot.geo.latitude,
            lng: selectedSpot.geo.longitude,
          }}
          options={{
            pixelOffset: new window.google.maps.Size(0, -40),
            maxWidth: 300,
          }}
          onCloseClick={closeInfoWindow}
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
            {selectedSpot.description && (
              <main
                style={{
                  marginBottom: "0.75rem",
                  fontSize: "0.75rem",
                  fontWeight: 300,
                }}
              >
                <p style={{ lineHeight: 1.25 }}>{selectedSpot.description}</p>
              </main>
            )}
            <footer
              style={{
                fontSize: "0.75rem",
                fontWeight: 400,
                color: "#0f766e",
              }}
            >
              <Link href={selectedSpot.googleMapsUrl}>View in Google Maps</Link>
              {selectedSpot.city.post && (
                <>
                  <span
                    style={{ paddingLeft: "0.5rem", paddingRight: "0.5rem" }}
                  >
                    ·
                  </span>
                  <Link href={`${selectedSpot.city.post}#${selectedSpot.slug}`}>
                    View in Post
                  </Link>
                </>
              )}
            </footer>
          </div>
        </InfoWindow>
      )}

      {spots.map((spot) => (
        <Marker
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
    </GoogleMap>
  );
}

function WrappedMap(props: Props) {
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!googleMapsApiKey) {
    throw new Error("Missing Google Maps API key");
  }

  const { isLoaded } = useLoadScript({
    googleMapsApiKey,
  });

  if (!isLoaded) return <div>Loading...</div>;

  return <Map {...props} />;
}

export default WrappedMap;
