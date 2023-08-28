import React, { useEffect, useState } from "react";
import Head from "next/head";
import { Listbox } from "@headlessui/react";

import { publishedCities } from "@/data/cities";
import { getAllSpots } from "@/lib/getAllSpots";
import { getPublishedSpotsWithCategoryAndCity } from "@/lib/getPublishedSpotsWithCategoryAndCity";

import Map from "@/components/Map";
import { Spinner } from "@/components/Spinner";
import { SimpleLayout } from "@/components/SimpleLayout";

function Icon(props) {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {props.children}
    </svg>
  );
}

function CheckIcon() {
  return (
    <Icon>
      <path d="M4.5 12.75l6 6 9-13.5" />
    </Icon>
  );
}

function ChevronUpDownIcon() {
  return (
    <Icon>
      <path d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
    </Icon>
  );
}

function CitySelect({ selectedCity, setSelectedCity }) {
  const handleCityChange = (city) => {
    setSelectedCity(city);
    sessionStorage.setItem("selectedCity", city.id);
  };

  return (
    <div className="relative z-10 mb-12 w-full xs:w-72">
      <Listbox value={selectedCity} onChange={handleCityChange}>
        <Listbox.Button className="relative w-full cursor-default rounded-md border border-zinc-900/10 bg-white py-2 pl-3 pr-10 text-left shadow-md shadow-zinc-800/5 dark:border-zinc-700 dark:bg-zinc-800-50 dark:font-medium dark:text-zinc-200 sm:text-sm">
          <span className="grid min-h-[1.5rem] content-center truncate">
            {selectedCity ? selectedCity.label : <Spinner />}
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon />
          </span>
        </Listbox.Button>
        <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md border border-zinc-900/10 bg-white p-2 shadow-lg shadow-zinc-800/5 dark:border-zinc-700 dark:bg-zinc-800-50 dark:text-zinc-200 sm:text-sm">
          {publishedCities.map((city) => (
            <Listbox.Option
              key={city.id}
              className={({ active }) =>
                `relative cursor-default select-none rounded-md py-2 pl-10 pr-4 ${
                  active
                    ? "bg-zinc-50 font-medium text-teal-500 dark:bg-zinc-800/50 dark:text-teal-400"
                    : "dark:text-zinc-200"
                }`
              }
              value={city}
            >
              {({ selected }) => (
                <>
                  <span
                    className={`block truncate ${
                      selected ? "font-medium" : "font-normal"
                    }`}
                  >
                    {city.label}
                  </span>
                  {selected && (
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-teal-500 dark:text-teal-400">
                      <CheckIcon />
                    </span>
                  )}
                </>
              )}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </Listbox>
    </div>
  );
}

function MapPage({ spots }) {
  const publishedSpotsWithCategoryAndCity =
    getPublishedSpotsWithCategoryAndCity(spots);

  const [selectedCity, setSelectedCity] = useState(null);

  useEffect(() => {
    const savedCityId = sessionStorage.getItem("selectedCity");

    if (savedCityId) {
      const city = publishedCities.find((city) => city.id === savedCityId);

      if (city) {
        setSelectedCity(city);
      }
    }
  }, []);

  return (
    <>
      <Head>
        <title>Map - Mirha Masala</title>
        <meta
          name="description"
          content="A map with my favorite parks, coffee haunts, eateries, and other spots from Amsterdam to Tel Aviv."
        />
      </Head>
      <SimpleLayout
        title="Sharing my favorite coffee haunts, eateries, and more."
        intro="From my hometown Sarajevo to cities like Amsterdam and Singapore, where I lived for years, and other places that I visited many times."
      >
        <div className="relative">
          <h2 className="mb-2 text-base font-semibold text-zinc-800 dark:text-zinc-100">
            Choose a city
          </h2>
          <CitySelect
            selectedCity={selectedCity}
            setSelectedCity={setSelectedCity}
          />
          {selectedCity ? (
            <Map
              center={selectedCity.geo}
              spots={publishedSpotsWithCategoryAndCity}
            />
          ) : (
            <Spinner />
          )}
        </div>
      </SimpleLayout>
    </>
  );
}

export async function getStaticProps() {
  const spots = await getAllSpots();
  return {
    props: {
      spots,
    },
  };
}

export default MapPage;
