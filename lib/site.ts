export const site = {
  name: "Mirha Masala",
  url: process.env.SITE_URL ?? "http://localhost:3000",
  nav: [
    { href: "/posts", label: "Writing" },
    { href: "/about", label: "About" },
  ],
} as const;
