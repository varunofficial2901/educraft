import React from "react";
import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import InitialLoader from "@/components/InitialLoader";
import { ThemeProvider } from "@/components/ThemeProvider";
<<<<<<< HEAD
=======
import { CartProvider } from "@/components/CartContext";
>>>>>>> aa0808108ce08e9522b649e0d086794ebaf208f3
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
<<<<<<< HEAD
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('theme');
                  if (!stored || stored === 'system') {
                    localStorage.setItem('theme', 'light');
                    document.documentElement.classList.remove('dark');
                    document.documentElement.classList.add('light');
                  } else if (stored === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.classList.add('light');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
        <script src="https://accounts.google.com/gsi/client" async defer></script>
      </head>
      <body className="font-inter antialiased min-h-screen flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <InitialLoader />
          <Navigation />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
=======
      <body className="font-inter antialiased min-h-screen flex flex-col">
        <CartProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
            disableTransitionOnChange
          >
            <InitialLoader />
            <Navigation />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </ThemeProvider>
        </CartProvider>
>>>>>>> aa0808108ce08e9522b649e0d086794ebaf208f3
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
