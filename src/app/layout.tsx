import { Metadata } from 'next'
import { ToastContainer } from 'react-toastify';
import Nav from '@/components/Layout/Nav';

export const metadata: Metadata = {
  title: 'Home',
  description: 'Welcome to Next.js',
}
export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>


        <div className='layout'>
          <Nav />
          <div>asdf</div>
          {children}
        </div>

      </body>
    </html>
  )
}
