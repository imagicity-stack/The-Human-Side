import "./globals.css";
import ScrollReveal from "@/components/ScrollReveal";
import SmoothScroll from "@/components/SmoothScroll";
import Preloader from "@/components/Preloader";
import Cursor from "@/components/Cursor";

export const metadata = {
  title: {
    default: "The Human Side — The Side That Still Cares",
    template: "%s · The Human Side",
  },
  description:
    "A student-led social initiative by Edenwoods Eduhub Foundation, in partnership with The Elden Heights School — working on women's empowerment, safety, the environment, and community.",
  applicationName: "The Human Side",
  icons: {
    icon: "/assets/logo-icon.png",
    apple: "/assets/logo-icon.png",
  },
  openGraph: {
    title: "The Human Side — The Side That Still Cares",
    description:
      "A student-led social initiative for empathy, dignity, and small acts that add up.",
    siteName: "The Human Side",
    type: "website",
  },
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F3EFE8" },
    { media: "(prefers-color-scheme: dark)", color: "#150C20" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

/* Runs before first paint. `motion` lets CSS hold animated elements in their
   start state; `has-intro` shows the preloader once per session. The timeout
   is a failsafe so nothing stays hidden if a script never arrives. */
const BOOT = `(function(){var d=document.documentElement;try{if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;d.classList.add('motion');if(!sessionStorage.getItem('ths-intro'))d.classList.add('has-intro');}catch(e){}setTimeout(function(){d.classList.add('hero-ready');d.classList.remove('has-intro');},6000);})();`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script dangerouslySetInnerHTML={{ __html: BOOT }} />
      </head>
      <body>
        <Preloader />
        {children}
        <SmoothScroll />
        <ScrollReveal />
        <Cursor />
      </body>
    </html>
  );
}
