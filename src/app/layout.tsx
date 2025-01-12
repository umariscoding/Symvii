import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import ReduxProvider from '@/providers/ReduxProvider'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Symvii",
  description: "Your intelligent healthcare companion",
  icons: {
    icon: [
      {
        url: "/favicon.ico",
        sizes: "32",
      },
      {
        url: "/icon.png",
        type: "image/png",
        sizes: "32x32",
      },
    ],
    apple: {
      url: "/apple-icon.png",
      type: "image/png",
      sizes: "180x180",
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <ReduxProvider>
          {children}
        </ReduxProvider>
      </body>
    </html>
  )
}