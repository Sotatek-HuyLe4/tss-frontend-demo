import type { Metadata } from "next";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { Bounce, ToastContainer } from "react-toastify";

import "./globals.scss";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "TSS App",
  description: "Tss app for generate key, singning message for tss service",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AntdRegistry>
        <body id="main">
          <Header />

          <div id="content">{children}</div>

          <ToastContainer
            position="top-right"
            autoClose={5_000}
            hideProgressBar={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
            transition={Bounce}
          />
        </body>
      </AntdRegistry>
    </html>
  );
}
