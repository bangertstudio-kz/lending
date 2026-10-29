import { Html, Head, Main, NextScript } from 'next/document';

// data-scroll-behavior: в globals.css у html стоит scroll-behavior: smooth — с этим атрибутом Next.js
// отключает его на время смены маршрута, и новая страница открывается сверху без плавной прокрутки.
// lang Next.js проставляет сам из текущей локали.
export default function Document() {
  return (
    <Html data-scroll-behavior="smooth">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
