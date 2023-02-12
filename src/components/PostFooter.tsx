import Heading from "@/components/Heading";

type FooterProps = {
  title: "You Might Also Like";
  children: React.ReactNode;
};

export function PostFooter({
  title = "You Might Also Like",
  children,
}: FooterProps) {
  return (
    <footer>
      <hr />
      <Heading>{title}</Heading>
      {children}
    </footer>
  );
}
