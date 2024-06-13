import type { Metadata } from "next";
import MainNavigationBar from "./_components/MainNavigationBar";
import { GlobalContextProvider } from "./_context/store";
import "./globals.css";
import HoverComponent from "./_components/HoverComponent";

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
          <HoverComponent />
        </GlobalContextProvider>
      </body>
    </html>
  );
}
