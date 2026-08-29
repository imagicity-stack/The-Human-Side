import "./globals.css";
import ScrollReveal from "@/components/ScrollReveal";

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
    { media: "(prefers-color-scheme: light)", color: "#FCFAFE" },
    { media: "(prefers-color-scheme: dark)", color: "#1A0E2C" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        {children}
        <ScrollReveal />
      </body>
    </html>
  );
}
