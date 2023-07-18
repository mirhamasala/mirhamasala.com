import { useState } from "react";
import { Listbox } from "@headlessui/react";

import Map from "@/components/Map";
import { SimpleLayout } from "@/components/SimpleLayout";
import { cities } from "@/data/cities";

function CheckIcon(props) {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 12.75l6 6 9-13.5"
      />
    </svg>
  );
}

function ChevronUpDownIcon(props) {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
      />
    </svg>
  );
}
function MapPage() {
  const [selectedCity, setSelectedCity] = useState(cities.amsterdam);

  function SelectCity({ cities }) {
    return (
      <div className="relative z-10 mb-12 w-full xs:w-72">
        <Listbox value={selectedCity} onChange={setSelectedCity}>
          <Listbox.Button className="relative w-full cursor-default rounded-md border border-zinc-900/10 bg-white py-2 pl-3 pr-10 text-left shadow-md shadow-zinc-800/5 dark:border-zinc-700 dark:bg-zinc-800-50 dark:font-medium dark:text-zinc-200 sm:text-sm">
            <span className="block truncate">{selectedCity.label}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon className="h-5 w-5" aria-hidden="true" />
            </span>
          </Listbox.Button>
          <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md border border-zinc-900/10 bg-white p-2 shadow-lg shadow-zinc-800/5 dark:border-zinc-700 dark:bg-zinc-800-50 dark:text-zinc-200 sm:text-sm">
            {Object.entries(cities).map(([_, city]) => (
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
                    {selected ? (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-teal-500 dark:text-teal-400">
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    ) : null}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Listbox>
      </div>
    );
  }

  return (
    <SimpleLayout
      title="Sharing my favorite coffee haunts, eateries, and more."
      intro="From my hometowns, Sarajevo and Amsterdam, to places like Singapore, where I lived for years, and other cities that I visited many times."
    >
      <div className="relative">
        <h2 className="mb-2 text-base font-semibold text-zinc-800 dark:text-zinc-100">
          Choose a city
        </h2>
        <SelectCity cities={cities} />
        <Map id={selectedCity.id} />
      </div>
    </SimpleLayout>
  );
}

export default MapPage;
