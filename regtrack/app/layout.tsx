import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: 'RegTrack — Fleet Registration Management',
  description: 'Keep your entire fleet\'s vehicle registrations organized and get email reminders before they expire.',
  icons: { icon: '/favicon.ico' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#0C2340',
              color: '#fff',
              fontSize: '14px',
              borderRadius: '8px',
            },
            success: { iconTheme: { primary: '#639922', secondary: '#fff' } },
            error:   { iconTheme: { primary: '#E24B4A', secondary: '#fff' } },
          }}
        />
      </body>
    </html>
  )
}
