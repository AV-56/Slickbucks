import './globals.css'
import Link from 'next/link'
import Providers from "./Providers";
import Navbar from './components/Navbar';

export const metadata = {
  title: 'Slickbucks Coffee',
  description: 'Pre-order your premium coffee and earn loyalty points',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#1A0F0A] text-[#EEEBD3] font-sans antialiased min-h-screen flex flex-col">

        <Providers>
          {/* --- NAVBAR --- */}
          <Navbar />

          <main className="flex-grow">
            {children}
          </main>
        </Providers>

      </body>
    </html>
  )
}
