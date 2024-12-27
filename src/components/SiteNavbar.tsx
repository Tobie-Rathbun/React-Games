"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

const SiteNavbar = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleLinkClick = () => {
    setIsLoading(true);
  };

  useEffect(() => {
    // Simulate the end of loading when the pathname or search params change
    setIsLoading(false); // This ensures the spinner stops after the page renders
  }, [usePathname(), useSearchParams()]);

  return (
    <div>
      <nav className="site-navbar">
        <Link href="/" className="navbar-brand" onClick={handleLinkClick}>
          Tobie Rathbun
        </Link>
        <div>
          <Link href="/" className="nav-link" onClick={handleLinkClick}>
            Home
          </Link>
          <Link href="/about" className="nav-link" onClick={handleLinkClick}>
            About
          </Link>
          <a
            href="https://github.com/Tobie-Rathbun"
            className="nav-link"
            onClick={handleLinkClick}
          >
            GitHub
          </a>
          <Link href="/pokerfrogs" className="nav-link" onClick={handleLinkClick}>
            Poker3D
          </Link>
          <Link href="/poker2d" className="nav-link" onClick={handleLinkClick}>
            Poker2D
          </Link>
          <Link href="/rps" className="nav-link" onClick={handleLinkClick}>
            RPS
          </Link>
          <Link
            href="/chord-player"
            className="nav-link"
            onClick={handleLinkClick}
          >
            Chords
          </Link>
          <Link href="/login" className="nav-link" onClick={handleLinkClick}>
            Login
          </Link>
        </div>
      </nav>

      {isLoading && (
        <div className="loading-indicator">
          <div className="spinner"></div>
        </div>
      )}
    </div>
  );
};

export default SiteNavbar;
