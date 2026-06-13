import './globals.css';

export const metadata = {
  title: 'Sri Vani Vidyanikethan EM School',
  description:
    'Sri Vani Vidyanikethan EM School website with admissions, academics, campus life, and role-based portal previews.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
