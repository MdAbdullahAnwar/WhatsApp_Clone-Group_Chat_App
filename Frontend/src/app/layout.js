export const metadata = {
  title: 'Group Chat App',
  description: 'Real-time group chat application',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
