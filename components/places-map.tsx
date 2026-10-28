"use client";

import {
  AdvancedMarker,
  AdvancedMarkerAnchorPoint,
  APILoadingStatus,
  APIProvider,
  ColorScheme,
  InfoWindow,
  Map,
  useApiLoadingStatus,
} from "@vis.gl/react-google-maps";
import { useState } from "react";

export type MapSpot = {
  slug: string;
  title: string;
  emoji: string;
  latitude: number;
  longitude: number;
  body: string;
  map?: string;
};

type LatLng = {
  latitude: number;
  longitude: number;
};

const mapClassName = "h-[32rem] bg-slate-200 md:h-[38rem]";

const noteLinkClassName =
  "underline decoration-slate-500 decoration-1 underline-offset-[0.22em] hover:decoration-current";

function MapUnavailable() {
  return (
    <div className={`flex items-center justify-center px-6 ${mapClassName}`}>
      <p className="max-w-[24rem] text-center font-serif text-[1.15rem] leading-snug text-slate-600">
        The map isn’t available just now.
      </p>
    </div>
  );
}

function frame(
  spots: MapSpot[],
  center: LatLng,
): google.maps.LatLngBoundsLiteral & { padding: number } {
  const points =
    spots.length > 0
      ? spots
      : [{ latitude: center.latitude, longitude: center.longitude }];
  let north = Math.max(...points.map((point) => point.latitude));
  let south = Math.min(...points.map((point) => point.latitude));
  let east = Math.max(...points.map((point) => point.longitude));
  let west = Math.min(...points.map((point) => point.longitude));
  const minSpan = 0.02;

  if (north - south < minSpan) {
    const mid = (north + south) / 2;
    north = mid + minSpan / 2;
    south = mid - minSpan / 2;
  }
  if (east - west < minSpan) {
    const mid = (east + west) / 2;
    east = mid + minSpan / 2;
    west = mid - minSpan / 2;
  }

  return { north, south, east, west, padding: 64 };
}

function CityMap({
  mapId,
  city,
  center,
  spots,
}: {
  mapId: string;
  city: string;
  center: LatLng;
  spots: MapSpot[];
}) {
  const status = useApiLoadingStatus();
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const open = spots.find((spot) => spot.slug === openSlug);

  if (
    status === APILoadingStatus.FAILED ||
    status === APILoadingStatus.AUTH_FAILURE
  ) {
    return <MapUnavailable />;
  }

  return (
    <div
      id="places-map"
      role="region"
      aria-label={`Map of ${city}`}
      className={mapClassName}
    >
      <Map
        mapId={mapId}
        defaultBounds={frame(spots, center)}
        colorScheme={ColorScheme.LIGHT}
        gestureHandling="cooperative"
        disableDefaultUI
        clickableIcons={false}
        keyboardShortcuts
        style={{ width: "100%", height: "100%" }}
      >
        {spots.map((spot) => (
          <AdvancedMarker
            key={spot.slug}
            position={{ lat: spot.latitude, lng: spot.longitude }}
            title={spot.title}
            clickable
            anchorPoint={AdvancedMarkerAnchorPoint.CENTER}
            onClick={() =>
              setOpenSlug((current) =>
                current === spot.slug ? null : spot.slug,
              )
            }
            className="flex size-11 items-center justify-center rounded-full border border-slate-300 bg-white text-[1.35rem] leading-none"
          >
            <span aria-hidden="true">{spot.emoji}</span>
          </AdvancedMarker>
        ))}
        {open ? (
          <InfoWindow
            position={{ lat: open.latitude, lng: open.longitude }}
            pixelOffset={[0, -28]}
            maxWidth={360}
            headerDisabled
            onCloseClick={() => setOpenSlug(null)}
          >
            <div className="font-sans text-[1rem] leading-snug text-slate-950">
              <p className="font-serif text-[1.15rem] leading-snug">
                {open.title}
              </p>
              {open.body ? (
                <p className="mt-2 text-slate-700">{open.body}</p>
              ) : null}
              {open.map ? (
                <p className="mt-3">
                  <a href={open.map} className={noteLinkClassName}>
                    Google Maps
                  </a>
                </p>
              ) : null}
            </div>
          </InfoWindow>
        ) : null}
      </Map>
    </div>
  );
}

export function PlacesMap({
  apiKey,
  mapId,
  city,
  center,
  spots,
}: {
  apiKey: string;
  mapId: string;
  city: string;
  center: LatLng;
  spots: MapSpot[];
}) {
  return (
    <APIProvider apiKey={apiKey}>
      <CityMap mapId={mapId} city={city} center={center} spots={spots} />
    </APIProvider>
  );
}
