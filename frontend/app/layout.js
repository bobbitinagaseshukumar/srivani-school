import "./globals.css";

export const metadata = {
  title: "SRI VANI VIDYANIKETHAN EM SCHOOL",
  description: "Sri Vani Vidyanikethan EM School website with admissions, academics, campus life, and role-based portal previews.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col justify-between font-sans transition-colors duration-300">
        {children}
      </body>
    </html>
  );
}
