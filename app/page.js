import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Hero from "@/components/home/Hero";
import Spotlight from "@/components/home/Spotlight";
import Marquee from "@/components/home/Marquee";
import Manifesto from "@/components/home/Manifesto";
import Facts from "@/components/home/Facts";
import Causes from "@/components/home/Causes";
import Gallery from "@/components/home/Gallery";
import Partners from "@/components/home/Partners";
import Closing from "@/components/home/Closing";
import "./home.css";

export default function HomePage() {
  return (
    <>
      <SiteHeader active="home" />

      <main id="main" className="pg-home">
        <Hero />
        <Spotlight />
        <Marquee />
        <Manifesto />
        <Facts />
        <Causes />
        <Gallery />
        <Partners />
        <Closing />
      </main>

      <SiteFooter />
    </>
  );
}
