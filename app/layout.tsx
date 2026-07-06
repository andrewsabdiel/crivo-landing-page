import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
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

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://crivo.local"),
  applicationName: "Crivo",
  title: {
    default: "Crivo | Ferramentas digitais claras para negócios locais",
    template: "%s | Crivo",
  },
  description:
    "Sites, sistemas e apps pensados para organizar a rotina de pequenos negócios e deixar cada atendimento mais simples.",
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
    icon: assetPath("/assets/crivo-mark-blue.png"),
    apple: assetPath("/assets/crivo-mark-blue.png"),
  },
  openGraph: {
    title: "Crivo | Ferramentas digitais claras para negócios locais",
    description:
      "Sites, sistemas e apps pensados para organizar a rotina de pequenos negócios e deixar cada atendimento mais simples.",
    url: "/",
    siteName: "Crivo",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/imagens/bg_1.jpg",
        width: 1200,
        height: 630,
        alt: "Crivo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Crivo | Ferramentas digitais claras para negócios locais",
    description:
      "Sites, sistemas e apps pensados para organizar a rotina de pequenos negócios e deixar cada atendimento mais simples.",
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
      <body className={montserrat.variable}>{children}</body>
    </html>
  );
}
