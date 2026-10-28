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
  useMap,
} from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";
import { usePlacePin } from "@/components/place-pin-button";

export type MapSpot = {
  slug: string;
  title: string;
  emoji: string;
  latitude: number;
  longitude: number;
  body: string;
  url?: string;
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

function FocusPin({
  slug,
  request,
  spots,
  onOpen,
}: {
  slug: string | null;
  request: number | null;
  spots: MapSpot[];
  onOpen: (slug: string) => void;
}) {
  const map = useMap();

  useEffect(() => {
    if (!map || !slug || request === null) return;
    const spot = spots.find((item) => item.slug === slug);
    if (!spot) return;
    onOpen(slug);
    map.setCenter({ lat: spot.latitude, lng: spot.longitude });
    if ((map.getZoom() ?? 0) < 16) map.setZoom(16);
  }, [map, onOpen, request, slug, spots]);

  return null;
}

function CityMap({
  mapId,
  center,
  spots,
}: {
  mapId: string;
  center: LatLng;
  spots: MapSpot[];
}) {
  const status = useApiLoadingStatus();
  const pins = usePlacePin();
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const open = spots.find((spot) => spot.slug === openSlug);

  if (
    status === APILoadingStatus.FAILED ||
    status === APILoadingStatus.AUTH_FAILURE
  ) {
    return <MapUnavailable />;
  }

  return (
    <div className={mapClassName}>
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
        <FocusPin
          slug={pins?.focus?.slug ?? null}
          request={pins?.focus?.request ?? null}
          spots={spots}
          onOpen={setOpenSlug}
        />
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
              {open.url || open.map ? (
                <p className="mt-3 flex flex-wrap items-baseline gap-x-3">
                  {open.url ? (
                    <a href={open.url} className={noteLinkClassName}>
                      Website
                    </a>
                  ) : null}
                  {open.url && open.map ? (
                    <span aria-hidden="true" className="text-slate-400">
                      ·
                    </span>
                  ) : null}
                  {open.map ? (
                    <a href={open.map} className={noteLinkClassName}>
                      Google Maps
                    </a>
                  ) : null}
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
  center,
  spots,
}: {
  apiKey: string;
  mapId: string;
  center: LatLng;
  spots: MapSpot[];
}) {
  return (
    <APIProvider apiKey={apiKey}>
      <CityMap mapId={mapId} center={center} spots={spots} />
    </APIProvider>
  );
}
