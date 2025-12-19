import { Helmet } from "react-helmet-async";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import FeaturedPets from "@/components/home/FeaturedPets";
import HowItWorks from "@/components/home/HowItWorks";
import Testimonials from "@/components/home/Testimonials";
import CallToAction from "@/components/home/CallToAction";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>PawHaven - Find Your Perfect Pet Companion</title>
        <meta
          name="description"
          content="Adopt your new best friend from PawHaven. Browse thousands of dogs, cats, and other pets looking for loving homes. Start your adoption journey today."
        />
        <meta property="og:title" content="PawHaven - Pet Adoption Platform" />
        <meta
          property="og:description"
          content="Find your perfect companion. Thousands of pets are waiting for their forever homes."
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />
        <main>
          <Hero />
          <FeaturedPets />
          <HowItWorks />
          <Testimonials />
          <CallToAction />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
