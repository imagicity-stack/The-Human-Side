import "./globals.css";

export const metadata = {
  title: "The Human Side — The Side That Still Cares",
  description:
    "A student-led social initiative by Edenwoods Eduhub Foundation, in partnership with The Elden Heights School.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
