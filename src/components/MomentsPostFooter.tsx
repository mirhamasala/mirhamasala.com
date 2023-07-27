import { Link } from "@/components/Link";

type MomentsPostFooterProps = {
  location: {
    name: string;
    city: string;
    country: string;
    googleMapsURL: string;
  };
};

export function MomentsPostFooter({
  location: { name, city, country, googleMapsURL },
}: MomentsPostFooterProps) {
  return (
    <footer>
      <span aria-hidden="true">📌 </span>
      <Link href={googleMapsURL}>{name}</Link>
      <span>
        {" "}
        · {city}, {country}
      </span>
    </footer>
  );
}
