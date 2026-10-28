export function Eyebrow({ children }: { children: string }) {
  return (
    // The display title's line-height reaches up over this label.
    <p className="relative z-10 mb-4 text-[1rem] leading-none font-medium text-slate-600 md:mb-6">
      {children}
    </p>
  );
}
