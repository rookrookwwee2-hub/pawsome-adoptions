import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Mail, Phone, MapPin, Send, MessageCircle } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { SocialIcons } from "@/components/shared/SocialIcons";
import { useTranslation } from "react-i18next";

const Contact = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success(t("contact.messageSent"), {
      description: t("contact.messageSentDesc"),
    });
    setFormData({ name: "", email: "", subject: "", message: "" });
    setIsSubmitting(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Helmet>
        <title>{t("contact.pageTitle")}</title>
        <meta name="description" content={t("contact.subtitle")} />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />

        <main className="pt-28 pb-16">
          <div className="container-custom">
            {/* Header */}
            <div className="max-w-2xl mx-auto text-center mb-16 space-y-4">
              <span className="text-primary font-medium tracking-wide uppercase text-sm animate-fade-up opacity-0">
                {t("contact.label")}
              </span>
              <h1 className="font-display text-4xl md:text-5xl font-bold animate-fade-up opacity-0 stagger-1">
                {t("contact.title")} <span className="text-gradient">{t("contact.titleHighlight")}</span>
              </h1>
              <p className="text-muted-foreground text-lg animate-fade-up opacity-0 stagger-2">
                {t("contact.subtitle")}
              </p>
            </div>

            <div className="grid lg:grid-cols-5 gap-12">
              {/* Contact Info */}
              <div className="lg:col-span-2 space-y-8 animate-fade-up opacity-0 stagger-3">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{t("contact.emailLabel")}</h3>
                      <p className="text-muted-foreground">hello@pawsfam.pet</p>
                      <p className="text-muted-foreground">support@pawsfam.pet</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{t("contact.phoneLabel")}</h3>
                      <p className="text-muted-foreground">(555) 123-4567</p>
                      <p className="text-muted-foreground text-sm">{t("contact.phoneHours")}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{t("contact.visitUs")}</h3>
                      <p className="text-muted-foreground">123 Pet Street</p>
                      <p className="text-muted-foreground">New York, NY 10001</p>
                    </div>
                  </div>
                </div>

                {/* Social Media Section */}
                <div className="p-6 bg-card rounded-2xl shadow-soft">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                      <MessageCircle className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{t("contact.connectWithUs")}</h3>
                      <p className="text-sm text-muted-foreground">{t("contact.followSocial")}</p>
                    </div>
                  </div>
                  <SocialIcons iconSize="md" showLabels className="justify-start" />
                </div>

                {/* Interactive Map */}
                <div className="space-y-3">
                  <h3 className="font-semibold">{t("contact.findOnMap")}</h3>
                  <div className="aspect-video rounded-2xl overflow-hidden bg-muted">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.9!2d-73.991777!3d40.747123!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDQ0JzQ5LjYiTiA3M8KwNTknMzAuNCJX!5e0!3m2!1sen!2sus!4v1"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Pawsfam Office Location"
                      className="w-full h-full"
                    />
                  </div>
                  <a
                    href="https://www.google.com/maps?q=40.747123,-73.991777"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <MapPin className="w-4 h-4" />
                    {t("contact.openGoogleMaps")}
                  </a>
                </div>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-3 animate-fade-up opacity-0 stagger-4">
                <form
                  onSubmit={handleSubmit}
                  className="bg-card p-8 rounded-3xl shadow-soft space-y-6"
                >
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium text-foreground">
                        {t("contact.yourName")}
                      </label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        required
                        className="h-12 rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium text-foreground">
                        {t("contact.emailAddress")}
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        required
                        className="h-12 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium text-foreground">
                      {t("contact.subject")}
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder={t("contact.subjectPlaceholder")}
                      required
                      className="h-12 rounded-xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium text-foreground">
                      {t("contact.messageLabel")}
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder={t("contact.messagePlaceholder")}
                      rows={6}
                      required
                      className="rounded-xl resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      t("contact.sending")
                    ) : (
                      <>
                        {t("contact.sendMessage")}
                        <Send className="ml-2 w-5 h-5" />
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Contact;
