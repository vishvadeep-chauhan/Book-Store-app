export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/30">
      <div className="container flex flex-col items-center justify-between gap-4 py-8 text-sm text-muted-foreground md:flex-row">
        <p>© {new Date().getFullYear()} Bookify. All rights reserved.</p>
        <nav className="flex gap-4">
          <a href="/about" className="hover:text-primary">About</a>
          <a href="/contact" className="hover:text-primary">Contact</a>
          <a href="/api-docs" className="hover:text-primary">API</a>
        </nav>
      </div>
    </footer>
  );
}
