import "./globals.css";

export const metadata = {
  title: "Drishti - AI Marketing Optimization",
  description:
    "Plug-and-play AI SDK that tracks user behavior, detects emotions, and adapts your website content in real-time.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
