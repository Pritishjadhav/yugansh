import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "YugAnsh | Premium IT Solutions, Software & AI Automation Pune",
  description: "YugAnsh delivers enterprise-grade IT solutions, custom software engineering, AI-powered automation, web development, cloud integration, and digital transformation in Pune, India.",
  keywords: "IT Solutions, Software Development Pune, AI Solutions, Web Development, Digital Transformation, AI Automation, Hadapsar, YugAnsh",
  authors: [{ name: "YugAnsh" }],
  creator: "YugAnsh",
  publisher: "YugAnsh",
  metadataBase: new URL("https://yugansh.in"),
  openGraph: {
    title: "YugAnsh | Premium IT Solutions & Digital Transformation",
    description: "Build Faster. Innovate Smarter. Transform your business with YugAnsh's cutting-edge software solutions, AI automation, and cloud integrations.",
    url: "https://yugansh.in",
    siteName: "YugAnsh",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "YugAnsh | Premium IT Solutions",
    description: "Accelerate business growth with YugAnsh web development, AI automation, and cloud integration.",
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
    <html lang="en" className="scroll-smooth">
      <body className="light antialiased min-h-screen text-slate-100 flex flex-col" suppressHydrationWarning>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var savedTheme = localStorage.getItem('theme');
                  if (savedTheme === 'dark') {
                    document.body.classList.remove('light');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
