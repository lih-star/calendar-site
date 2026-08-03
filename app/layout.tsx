import Navigation from "./component/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "일정 관리 앱",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="layout">
        <Navigation />
        {children}
      </body>
    </html>
  );
}