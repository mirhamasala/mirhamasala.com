export interface NavLink {
  href: string;
  label: string;
}

export const navLinks: NavLink[] = [
  { href: "/about", label: "About" },
  { href: "/posts", label: "Posts" },
  { href: "/letters", label: "Letters" },
  { href: "/moments", label: "Moments" },
  { href: "/map", label: "Map" },
];
