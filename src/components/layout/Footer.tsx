import { Link } from "react-router-dom";
import { Heart, Mail, Phone, MapPin, Instagram, Facebook, Twitter } from "lucide-react";

const quickLinks = [
  { name: "Available Pets", path: "/pets" },
  { name: "Adoption Process", path: "/about" },
  { name: "Success Stories", path: "/about" },
  { name: "Volunteer", path: "/foster" },
  { name: "Cat Breeds", path: "/cat-breeds" },
  { name: "Dog Breeds", path: "/dog-breeds" },
];

const supportLinks = [
  { name: "Support", path: "/contact" },
  { name: "Donate", path: "/donate" },
  { name: "Partner With Us", path: "/contact" },
  { name: "Health Guarantee", path: "/health-guarantee" },
  { name: "Delivery Options", path: "/delivery-options" },
  { name: "Emotional Support", path: "/emotional-support" },
  { name: "Privacy Policy", path: "/privacy" },
  { name: "Terms & Conditions", path: "/terms" },
];

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-16">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-primary-foreground fill-current" />
              </div>
              <span className="font-display text-2xl font-bold">PawHaven</span>
            </Link>
            <p className="text-background/70 font-body leading-relaxed">
              Finding loving homes for pets since 2020. Every pet deserves a second chance at happiness.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 rounded-full bg-background/10 hover:bg-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 rounded-full bg-background/10 hover:bg-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 rounded-full bg-background/10 hover:bg-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3 font-body">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-background/70 hover:text-primary transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-3 font-body">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-background/70 hover:text-primary transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 font-body">
              <li className="flex items-center gap-3 text-background/70">
                <Mail className="w-5 h-5 text-primary" />
                hello@pawhaven.com
              </li>
              <li className="flex items-center gap-3 text-background/70">
                <Phone className="w-5 h-5 text-primary" />
                (555) 123-4567
              </li>
              <li className="flex items-center gap-3 text-background/70">
                <MapPin className="w-5 h-5 text-primary" />
                123 Pet Street, NY 10001
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-background/10 text-center">
          <p className="text-background/50 font-body text-sm">
            © 2024 PawHaven. All rights reserved. Made with{" "}
            <Heart className="w-4 h-4 inline text-primary fill-primary" /> for pets everywhere.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
