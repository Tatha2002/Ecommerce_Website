"use client";

import "./globals.css";
import HeaderClient from "../components/HeaderClient";
import { CartProvider } from "./context/CartContext";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <HeaderClient />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
