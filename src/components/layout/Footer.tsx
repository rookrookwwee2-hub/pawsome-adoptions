import { Link } from "react-router-dom";
import { Heart, Mail, Phone, MapPin } from "lucide-react";
import { SocialIcons } from "@/components/shared/SocialIcons";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();

  const quickLinks = [
    { name: t("footer.availablePets"), path: "/pets" },
    { name: t("footer.adoptionProcess"), path: "/about" },
    { name: t("footer.successStories"), path: "/about" },
    { name: t("footer.volunteer"), path: "/foster" },
    { name: t("nav.catBreeds"), path: "/cat-breeds" },
    { name: t("nav.dogBreeds"), path: "/dog-breeds" },
  ];

  const supportLinks = [
    { name: t("footer.support"), path: "/contact" },
    { name: t("footer.donate"), path: "/donate" },
    { name: t("footer.partnerWithUs"), path: "/contact" },
    { name: t("nav.healthGuarantee"), path: "/health-guarantee" },
    { name: t("nav.deliveryOptions"), path: "/delivery-options" },
    { name: t("nav.emotionalSupport"), path: "/emotional-support" },
    { name: t("footer.privacy"), path: "/privacy" },
    { name: t("footer.terms"), path: "/terms" },
  ];

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
              <span className="font-display text-2xl font-bold">Pawsfam</span>
            </Link>
            <p className="text-background/70 font-body leading-relaxed">
              {t("footer.description")}
            </p>
            <SocialIcons iconSize="sm" />
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4">{t("footer.quickLinks")}</h4>
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
            <h4 className="font-display text-lg font-semibold mb-4">{t("footer.support")}</h4>
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
            <h4 className="font-display text-lg font-semibold mb-4">{t("footer.contactUs")}</h4>
            <ul className="space-y-3 font-body">
              <li className="flex items-center gap-3 text-background/70">
                <Mail className="w-5 h-5 text-primary" />
                hello@pawsfam.pet
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
            © 2026 Pawsfam. {t("footer.rights")} {t("footer.madeWith")}{" "}
            <Heart className="w-4 h-4 inline text-primary fill-primary" /> {t("footer.forPets")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
