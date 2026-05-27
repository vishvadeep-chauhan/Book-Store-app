export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-8 text-sm text-muted-foreground flex flex-col md:flex-row items-center justify-between gap-4">
        <p>© {new Date().getFullYear()} Bookstore. All rights reserved.</p>
        <nav className="flex gap-4">
          <a href="/about" className="hover:text-primary">About</a>
          <a href="/contact" className="hover:text-primary">Contact</a>
          <a href="/api-docs" className="hover:text-primary">API</a>
        </nav>
      </div>
    </footer>
  );
}
