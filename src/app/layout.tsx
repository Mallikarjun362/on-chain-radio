import type { Metadata } from "next";
import MainNavigationBar from "./_components/MainNavigationBar";
import { GlobalContextProvider } from "./_context/store";
import "./globals.css";

export const metadata: Metadata = {
  title: "On Chain Radio",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <GlobalContextProvider>
          <MainNavigationBar />
          {children}
        </GlobalContextProvider>
      </body>
    </html>
  );
}
