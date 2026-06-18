import React from "react";
import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import NavigationWrapper from "@/components/NavigationWrapper";
import InitialLoader from "@/components/InitialLoader";
import { ThemeProvider } from "@/components/ThemeProvider";
import { CartProvider } from "@/components/CartContext";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ['400', '600', '700', '900'],
  style: ['normal', 'italic'],
});

export const metadata: Metadata = {
  title: "EduCraft - Learn Without Limits",
  description: "A professional course website built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${fraunces.variable} ${inter.variable}`}>
      <body className="font-inter antialiased min-h-screen flex flex-col">
        <CartProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
            disableTransitionOnChange
          >
            <InitialLoader />
            <NavigationWrapper>
              {children}
            </NavigationWrapper>
          </ThemeProvider>
        </CartProvider>
      </body>
    </html>
  );
}
























// import type { Metadata } from "next";
// import { Inter, Fraunces } from "next/font/google";
// import Navigation from "@/components/Navigation";
// import Footer from "@/components/Footer";
// import InitialLoader from "@/components/InitialLoader";
// import { ThemeProvider } from "@/components/ThemeProvider";
// import "./globals.css";

// const inter = Inter({
//   subsets: ["latin"],
//   variable: "--font-inter",
// });

// const fraunces = Fraunces({
//   subsets: ["latin"],
//   variable: "--font-fraunces",
//   weight: ['400', '600', '700', '900'],
//   style: ['normal', 'italic'],
// });

// export const metadata: Metadata = {
//   title: "EduCraft - Learn Without Limits",
//   description: "A professional course website built with Next.js",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en" suppressHydrationWarning className={`${fraunces.variable} ${inter.variable}`}>
//       <head>
//         <script
//           dangerouslySetInnerHTML={{
//             __html: `
//               (function() {
//                 try {
//                   var stored = localStorage.getItem('theme');
//                   if (!stored || stored === 'system') {
//                     localStorage.setItem('theme', 'light');
//                     document.documentElement.classList.remove('dark');
//                     document.documentElement.classList.add('light');
//                   } else if (stored === 'dark') {
//                     document.documentElement.classList.add('dark');
//                   } else {
//                     document.documentElement.classList.remove('dark');
//                     document.documentElement.classList.add('light');
//                   }
//                 } catch(e) {}
//               })();
//             `,
//           }}
//         />
//       </head>
//       <body className="font-inter antialiased min-h-screen flex flex-col">
//         <ThemeProvider
//           attribute="class"
//           defaultTheme="light"
//           enableSystem={false}
//           disableTransitionOnChange
//         >
//           <InitialLoader />
//           {/* The layout is flexible so Footer stays at the bottom */}
//           <Navigation />
//           <main className="flex-grow">
//             {children}
//           </main>
//           <Footer />
//         </ThemeProvider>
//       </body>
//     </html>
//   );
// }
