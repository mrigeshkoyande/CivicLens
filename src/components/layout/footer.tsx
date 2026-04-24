"use client";

export function Footer() {
  return (
    <footer className="border-t border-[#c6c8b7] flex flex-col md:flex-row justify-between items-center py-6 text-xs text-on-surface-variant gap-4">
      <div>© 2024 CivicLens — Empowering Democracy</div>
      <div className="flex gap-6">
        {["Privacy Policy", "Terms of Service", "Contact Support"].map((l) => (
          <a key={l} href="#" className="hover:text-primary transition-colors">{l}</a>
        ))}
      </div>
    </footer>
  );
}
