import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";

const basePath =
  process.env.DEPLOY_TARGET === "github-pages" ? "/crivo-landing-page" : "";
const assetPath = (path: string) => `${basePath}${path}`;

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
  variable: "--font-montserrat",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://crivo.local"),
  applicationName: "Crivo",
  title: {
    default: "Crivo | Sistemas, sites e apps para rotinas claras",
    template: "%s | Crivo",
  },
  description:
    "A Crivo transforma rotinas confusas em sistemas, sites, apps e dashboards com lógica de negócio, clareza de uso e cuidado visual.",
  keywords: [
    "Crivo",
    "sites para pequenos negócios",
    "sistemas para negócios locais",
    "apps para empresas",
    "software para clínicas",
    "software para restaurantes",
    "landing page profissional",
  ],
  authors: [{ name: "Crivo" }],
  creator: "Crivo",
  publisher: "Crivo",
  category: "technology",
  icons: {
    icon: assetPath("/assets/crivo-mark-blue-ui.png"),
    apple: assetPath("/assets/crivo-mark-blue-ui.png"),
  },
  openGraph: {
    title: "Crivo | Sistemas, sites e apps para rotinas claras",
    description:
      "Produtos digitais sob medida para organizar operações, explicar ofertas e transformar processos em experiências claras.",
    url: "/",
    siteName: "Crivo",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/imagens/bg_1.jpg",
        width: 2560,
        height: 1707,
        alt: "Crivo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Crivo | Sistemas, sites e apps para rotinas claras",
    description:
      "Produtos digitais sob medida para organizar operações, explicar ofertas e transformar processos em experiências claras.",
    images: ["/imagens/bg_1.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} ${montserrat.variable}`}>{children}</body>
    </html>
  );
}
