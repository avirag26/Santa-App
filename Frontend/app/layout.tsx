import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Santa's Workshop - Christmas Magic Management",
  description: 'The official digital workshop for Santa Claus - Managing Christmas magic worldwide!',
  keywords: 'Santa, Christmas, Workshop, Gifts, Children, North Pole',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} christmas-bg min-h-screen`}>
        {children}
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#059669',
              color: '#fff',
              fontWeight: 'bold',
            },
          }}
        />
      </body>
    </html>
  )
}