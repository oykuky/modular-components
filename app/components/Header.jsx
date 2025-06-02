"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ChevronDown } from "lucide-react";

const Header = ({ menuItems = [], logo = "Logo", className = "" }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState({});

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const toggleDropdown = (itemId) => {
    setIsDropdownOpen((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const handleLinkClick = () => {
    if (isMobileMenuOpen) {
      closeMobileMenu();
    }
  };

  // Logo - resim veya text
  const renderLogo = () => {
    if (typeof logo === "string") {
      return (
        <span className="text-xl font-bold text-primary hover:text-primary/80 transition-colors duration-200">
          {logo}
        </span>
      );
    }

    if (typeof logo === "object" && logo !== null) {
      if (logo.type === "image") {
        return (
          <Image
            src={logo.src}
            alt={logo.alt || "Logo"}
            width={logo.width || 120}
            height={logo.height || 40}
            className="object-contain hover:opacity-80 transition-opacity duration-200"
            priority
          />
        );
      }

      if (logo.type === "text") {
        return (
          <span className="text-xl font-bold text-primary hover:text-primary/80 transition-colors duration-200">
            {logo.content}
          </span>
        );
      }
    }

    return (
      <span className="text-xl font-bold text-primary hover:text-primary/80 transition-colors duration-200">
        Logo
      </span>
    );
  };

  const renderMenuItem = (item, isMobile = false) => {
    if (item.type === "menu" && item.children) {
      return (
        <div key={item.id} className={isMobile ? "block" : "relative group"}>
          <button
            onClick={() => toggleDropdown(item.id)}
            className={`flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary transition-colors duration-200 ${
              isMobile ? "border-b border-gray-100" : ""
            }`}
          >
            <span>{item.title}</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                isDropdownOpen[item.id] ? "rotate-180" : ""
              }`}
            />
          </button>

          {!isMobile && (
            /* Desktop Dropdown */
            <div className="hidden md:block absolute left-0 mt-1 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="py-1">
                {item.children.map((child) => (
                  <Link
                    key={child.id}
                    href={child.path}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors duration-200"
                  >
                    {child.title}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {isMobile && isDropdownOpen[item.id] && (
            /* Mobile Dropdown */
            <div className="bg-gray-50">
              {item.children.map((child) => (
                <Link
                  key={child.id}
                  href={child.path}
                  onClick={handleLinkClick}
                  className="block px-6 py-3 text-sm text-gray-600 hover:text-primary hover:bg-gray-100 transition-colors duration-200 border-b border-gray-100 last:border-b-0"
                >
                  {child.title}
                </Link>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={item.id}
        href={item.path}
        onClick={isMobile ? handleLinkClick : undefined}
        className={`block px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary transition-colors duration-200 ${
          isMobile ? "border-b border-gray-100" : ""
        }`}
      >
        {item.title}
      </Link>
    );
  };

  return (
    <header
      className={`bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50 ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              {renderLogo()}
            </Link>
          </div>

          {/* Desktop */}
          <nav className="hidden md:flex items-center space-x-4">
            {menuItems.map((item) => renderMenuItem(item, false))}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors duration-200"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Ana menüyü aç</span>
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation - Header accordion */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          } overflow-hidden`}
        >
          <div className="py-4 border-t border-gray-200">
            <nav className="space-y-1">
              {menuItems.map((item) => renderMenuItem(item, true))}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
