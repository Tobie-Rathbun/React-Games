"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import "./site.css";

const SiteNavbar = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const handleLinkClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const target = event.currentTarget as HTMLAnchorElement;
    const href = target.getAttribute("href");

    if (href === pathname) {
      if (href === "/") {
        window.location.href = "/";
      }
      event.preventDefault();
      setIsDropdownOpen(false);
      setIsMobileMenuOpen(false);
      console.log("Already on the current page");
      return;
    }

    setIsLoading(true);
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    setIsLoading(false);
  }, [pathname]);

  return (
    <div className="navbar-wrapper">
      <nav className="site-navbar">
        <Link href="/" className="navbar-brand" onClick={handleLinkClick}>
          Tobie&#39;s Projects
        </Link>
        <button
          className="hamburger-button"
          onClick={handleMobileMenuToggle}
        >
          ☰
        </button>
        <div className={`nav-links ${isMobileMenuOpen ? "open" : ""}`}>
          <Link href="/" className="nav-link" onClick={handleLinkClick}>
            Home
          </Link>
          <Link href="https://portfolio.tobie-developer.com" className="nav-link" onClick={handleLinkClick}>
            Portfolio
          </Link>
          <a
            href="https://github.com/Tobie-Rathbun"
            className="nav-link"
            onClick={handleLinkClick}
          >
            GitHub
          </a>

          <div className="dropdown">
            <button className="dropdown-toggle" onClick={handleDropdownToggle}>
              Projects
            </button>
            {isDropdownOpen && (
              <div className="dropdown-menu">
                <Link href="/rockpaperscissors" className="nav-link" onClick={handleLinkClick}>
                  Rock, Paper, Scissors
                </Link>
                <Link href="/texasholdem" className="nav-link" onClick={handleLinkClick}>
                  Texas Hold &#39;Em
                </Link>
                <Link href="/chord-player" className="nav-link" onClick={handleLinkClick}>
                  Chord Machine 
                </Link>
                <Link href="/pokerfrogs" className="nav-link" onClick={handleLinkClick}>
                  Poker Frogs 3D (Demo)
                </Link>
              </div>
            )}
          </div>

          <Link href="/contact" className="nav-link" onClick={handleLinkClick}>
            Contact
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
