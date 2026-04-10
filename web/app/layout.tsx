import "./globals.scss";

import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { VisualEditing, toPlainText } from "next-sanity";
import { Toaster } from "sonner";
import Script from "next/script";
import BodyClassUpdater from "@/app/components/BodyClassUpdater";
// Site credit removed
import TouchTapEffect from "@/app/components/TouchTapEffect";

import DraftModeToast from "@/app/components/DraftModeToast";
import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import PageTransition from "@/app/components/PageTransition";
import * as demo from "@/sanity/lib/demo";
import { sanityFetch, SanityLive } from "@/sanity/lib/live";
import { settingsQuery, navigationQuery } from "@/sanity/lib/queries";
import { resolveOpenGraphImage } from "@/sanity/lib/utils";
import { handleError } from "./client-utils";

/**
 * Generate metadata for the page.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-metadata#generatemetadata-function
 */
export async function generateMetadata(): Promise<Metadata> {
  const { data: settings } = await sanityFetch({
    query: settingsQuery,
    // Metadata should never contain stega
    stega: false,
  });
  const title = settings?.title || demo.title;
  const description = settings?.description || demo.description;

  const ogImage = resolveOpenGraphImage(settings?.ogImage);
  let metadataBase: URL | undefined = undefined;
  try {
    metadataBase = settings?.ogImage?.metadataBase
      ? new URL(settings.ogImage.metadataBase)
      : undefined;
  } catch {
    // ignore
  }
  return {
    metadataBase,
    title: {
      template: `%s | ${title}`,
      default: title,
    },
    description: toPlainText(description),
    openGraph: {
      images: ogImage ? [ogImage] : [],
    },
    icons: {
      icon: '/favicon.svg?v=3',
      shortcut: '/favicon.svg?v=3',
      other: [
        { rel: 'icon', url: '/favicon.svg?v=3' },
      ],
    }
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isEnabled: isDraftMode } = await draftMode();
  const { data: navigation } = await sanityFetch({ query: navigationQuery });

  return (
    <html lang="en">
      <body>
        <BodyClassUpdater />
        {process.env.NEXT_PUBLIC_GTM_CONTAINER_ID && (
          <noscript dangerouslySetInnerHTML={{ __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTM_CONTAINER_ID}" height="0" width="0" style="display:none;visibility:hidden"></iframe>` }} />
        )}

        <section className="site-wrapper">

          {/* The <Toaster> component is responsible for rendering toast notifications used in /app/client-utils.ts and /app/components/DraftModeToast.tsx */}
          {/* Toaster and analytics scripts */}
          <Toaster />
          {/* If GTM is configured, inject GTM script + noscript iframe; else fall back to direct GA */}
          {process.env.NEXT_PUBLIC_GTM_CONTAINER_ID ? (
            <>
              <Script id="gtm-script" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'? '&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_CONTAINER_ID}');` }} />
            </>
          ) : process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ? (
            <>
              <Script src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`} strategy="afterInteractive" />
              <Script id="ga-init" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: `window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');` }} />
            </>
          ) : null}
          {isDraftMode && (
            <>
              <DraftModeToast />
              {/*  Enable Visual Editing, only to be rendered when Draft Mode is enabled */}
              <VisualEditing />
            </>
          )}
          {/* The <SanityLive> component is responsible for making all sanityFetch calls in your application live, so should always be rendered. */}
          <SanityLive onError={handleError} />
          <Header navigation={navigation} />
          <main className="">
            <PageTransition>{children}</PageTransition>
          </main>
          {/* <Footer /> */}
        </section>
        <TouchTapEffect />
        <SpeedInsights />
      </body>
    </html>
  );
}
