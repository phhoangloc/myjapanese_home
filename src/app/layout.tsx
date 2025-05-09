import type { Metadata } from "next";
import "../style/globals.css";
import "../style/plus.css";

import { Nunito_Sans } from 'next/font/google'
import Provider from "@/redux/component/provider";

const font = Nunito_Sans({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800', '900',],
})

export const metadata: Metadata = {
  title: "日本語を食べるチャレンジ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${font.className} bg-slate-100`}
      >
        <Provider>
          {children}
        </Provider>
      </body>
    </html>
  );
}
