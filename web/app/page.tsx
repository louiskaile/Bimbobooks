import { Suspense } from "react";
import Link from "next/link";
import { PortableText } from "@portabletext/react";

import { AllPosts } from "@/app/components/Posts";
import BlockRenderer from "@/app/components/BlockRenderer";
import { homePageQuery } from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/live";

export default async function Page() {
  const { data: homePage } = await sanityFetch({
    query: homePageQuery,
  });

  return (
    <>
      {/* Hero Section */}
      {homePage?.hero && (
        <div className="relative">
          <div className="relative bg-[url(/images/tile-1-black.png)] bg-size-[5px]">
            <div className="bg-gradient-to-b from-white w-full h-full absolute top-0"></div>
            <div className="container">
              <div className="relative min-h-[40vh] mx-auto max-w-2xl pt-10 xl:pt-20 pb-30 space-y-6 lg:max-w-4xl lg:px-12 flex flex-col items-center justify-center">
                <div className="flex flex-col gap-4 items-center">

              <div className="flex flex-col gap-4 items-center">
                <div className="text-md leading-6 prose uppercase py-1 px-3 bg-white font-mono italic">
                  StudioSmall Starter Boilerplate
                </div>
                <h3 className="text-5xl sm:text-4xl md:text-7xl lg:text-5xl font-bold tracking-tighter text-black">
                  <Link
                    className="underline decoration-brand hover:text-brand underline-offset-8 hover:underline-offset-4 transition-all ease-out"
                    href="https://sanity.io/"
                  >
                    Sanity
                  </Link>
                  +
                  <Link
                    className="underline decoration-black text-framework underline-offset-8 hover:underline-offset-4 transition-all ease-out"
                    href="https://nextjs.org/"
                  >
                    Next.js
                  </Link>
                </h3>
              </div>

                  {homePage.hero.headline && (
                    <h1 className="text-5xl sm:text-4xl md:text-7xl lg:text-5xl font-bold tracking-tighter text-black text-center">
                      {homePage.hero.headline}
                    </h1>
                  )}
                  {homePage.hero.subtitle && (
                    <p className="text-lg text-gray-600 text-center max-w-2xl">
                      {homePage.hero.subtitle}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Page Builder Content */}
      {homePage?.pageBuilder && (
        <div className="">
          {homePage.pageBuilder.map((section: any, index: number) => (
            <BlockRenderer 
              key={section._key} 
              block={section} 
              index={index}
              pageId={homePage._id || 'homePage'}
              pageType="homePage"
            />
          ))}
        </div>
      )}

      {/* Posts Section */}
      <div className="border-t border-gray-100 bg-gray-50">
        <div className="container">
          <aside className="py-12 sm:py-20">
            <Suspense>{await AllPosts()}</Suspense>
          </aside>
        </div>
      </div>
    </>
  );
}
