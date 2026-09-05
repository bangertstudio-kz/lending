import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import { fontVariables } from './fonts';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'Bangert Studio — Mobile & Web Development',
  description:
    'Full-cycle mobile and web development. You know the timeline and the budget before the work starts.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${fontVariables} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
        <Script id="yandex-metrika" strategy="afterInteractive">
          {`
            (function(m,e,t,r,i,k,a){
                m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                m[i].l=1*new Date();
                for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
                k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
            })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=105997418', 'ym');

            ym(105997418, 'init', {ssr:true, webvisor:true, clickmap:true, ecommerce:'dataLayer', accurateTrackBounce:true, trackLinks:true});
          `}
        </Script>
      </body>
    </html>
  );
}
