// components/layout/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Mail,
  Phone,
  MapPin,
  Heart,
  ChefHat,
} from "lucide-react";
import logo from "@/assets/images/logo.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { path: "/", label: "Home" },
    { path: "/recipes", label: "Recipes" },
    { path: "/about", label: "About Us" },
    { path: "/contact", label: "Contact" },
    { path: "/submit-recipe", label: "Submit Recipe" },
  ];

  const categories = [
    { path: "/recipes?category=appetizers", label: "Appetizers" },
    { path: "/recipes?category=soups-salads", label: "Soups & Salads" },
    { path: "/recipes?category=main-courses", label: "Main Courses" },
    { path: "/recipes?category=side-dishes", label: "Side Dishes" },
    { path: "/recipes?category=breakfast", label: "Breakfast" },
    { path: "/recipes?category=beverages", label: "Beverages" },
    { path: "/recipes?category=desserts", label: "Desserts" },
  ];

  const socialLinks = [
    { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
    { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
    { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
    { icon: Youtube, href: "https://youtube.com", label: "YouTube" },
  ];

  const contactInfo = [
    {
      icon: Mail,
      text: "hello@lutongbahay.com",
      href: "mailto:hello@lutongbahay.com",
    },
    { icon: Phone, text: "+63 (2) 1234 5678", href: "tel:+63212345678" },
    { icon: MapPin, text: "Metro Manila, Philippines", href: "#" },
  ];

  return (
    <footer className="bg-white border-t border-cardBorder">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
          {/* Brand Column - 3 cols */}
          <div className="lg:col-span-3 space-y-4">
            <Link
              to="/"
              className="flex items-center text-2xl font-heading tracking-wider"
            >
              <img
                src={logo}
                alt="LutongBahay Logo"
                className="w-8 h-8 object-contain"
              />
              <span className="text-primary hover:text-primaryDark transition-colors">
                LutongBahay
              </span>
            </Link>
            <p className="text-textSecondary text-sm leading-relaxed">
              Discover the authentic taste of Filipino home cooking. Share your
              favorite Lutong Bahay recipes with our growing community.
            </p>

            {/* Social Links */}
            <div className="flex items-center space-x-3 pt-2">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="bg-primary/10 hover:bg-primary text-primary hover:text-white p-2 rounded-lg transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links - 2 cols */}
          <div className="lg:col-span-2">
            <h3 className="font-heading text-lg text-textPrimary mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-textSecondary hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories - 3 cols */}
          <div className="lg:col-span-3">
            <h3 className="font-heading text-lg text-textPrimary mb-4">
              Categories
            </h3>
            <ul className="grid grid-cols-2 gap-2">
              {categories.map((category, index) => (
                <li key={index}>
                  <Link
                    to={category.path}
                    className="text-textSecondary hover:text-primary transition-colors text-sm"
                  >
                    {category.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info - 4 cols */}
          <div className="lg:col-span-4">
            <h3 className="font-heading text-lg text-textPrimary mb-4">
              Get in Touch
            </h3>
            <ul className="space-y-3">
              {contactInfo.map((item, index) => {
                const Icon = item.icon;
                return (
                  <li key={index}>
                    <a
                      href={item.href}
                      className="flex items-center gap-3 text-textSecondary hover:text-primary transition-colors text-sm group"
                    >
                      <span className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary group-hover:text-white transition-colors">
                        <Icon className="w-4 h-4" />
                      </span>
                      {item.text}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-cardBorder">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-2">
            <p className="text-textSecondary text-sm">
              © {currentYear} LutongBahay. All rights reserved.
            </p>
            <p className="text-textSecondary text-sm flex items-center gap-1">
              Made with <Heart className="w-4 h-4 text-red-500 fill-current" />{" "}
              for Filipino food lovers
            </p>
            <div className="flex gap-4">
              <Link
                to="/privacy"
                className="text-textSecondary hover:text-primary text-sm transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-textSecondary hover:text-primary text-sm transition-colors"
              >
                Terms of Use
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
