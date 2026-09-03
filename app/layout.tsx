import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "J R Grace Realty | Property Management in Waco, TX",
  description: "Professional property management and homes for rent across Waco and Central Texas.",
  openGraph: {
    title: "J R Grace Realty",
    description: "Property management and available homes across Waco and Central Texas.",
    images: ["/assets/waco-sunset-river.jpg"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
