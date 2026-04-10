import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Products from "@/components/Products";
import Pricing from "@/components/Pricing";
import Footer from "@/components/Footer";
import DrishtiToggle from "@/components/DrishtiToggle";
import DrishtiScript from "@/components/DrishtiScript";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Products />
        <Pricing />
      </main>
      <Footer />

      {/* Drishti SDK Integration */}
      <DrishtiScript />
      <DrishtiToggle />
    </>
  );
}
