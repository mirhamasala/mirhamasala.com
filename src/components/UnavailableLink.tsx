export function UnavailableLink({ linkText }: { linkText: string }) {
  return (
    <span>
      <s>{linkText}</s> <em>(Link no longer available)</em>
    </span>
  );
}
