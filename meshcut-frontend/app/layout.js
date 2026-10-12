import "./globals.css";
import { MeshProvider } from "../lib/store";

export const metadata = {
  title: "MeshCut — Online Video Editor",
  description: "Upload, trim, merge, add text and filters, and export video online.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <MeshProvider>{children}</MeshProvider>
      </body>
    </html>
  );
}
