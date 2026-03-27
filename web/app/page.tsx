import { Suspense } from "react";
import Link from "next/link";
import { PortableText } from "@portabletext/react";

import { AllPosts } from "@/app/components/Posts";
import BlockRenderer from "@/app/components/BlockRenderer";
import { homePageQuery } from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/live";
import HeroImageText from "@/app/components/HeroImageText";

export default async function Page() {
  const { data: homePage } = await sanityFetch({
    query: homePageQuery,
  });

  let heroImage: string = "/images/hero.jpg";
  let heroLogo: string | null = null;

  if (homePage?.hero) {
    if (typeof homePage.hero.image === "string") {
      heroImage = homePage.hero.image;
    } else if (homePage.hero.image && (homePage.hero.image as any).asset) {
      heroImage = (homePage.hero.image as any).asset.url || heroImage;
    }

    if (typeof homePage.hero.logo === "string") {
      heroLogo = homePage.hero.logo;
    } else if (homePage.hero.logo && (homePage.hero.logo as any).asset) {
      heroLogo = (homePage.hero.logo as any).asset.url || null;
    }
  }

  let heroEmail = "info@bimbobooks.com";
  if (homePage?.hero && typeof (homePage.hero as any).email === "string") {
    heroEmail = (homePage.hero as any).email;
  }

  let heroLetters: string = "BIMBO";
  if (homePage?.hero) {
    if (typeof (homePage.hero as any).letters === "string" && (homePage.hero as any).letters) {
      heroLetters = (homePage.hero as any).letters;
    } else if (typeof homePage.hero.headline === "string" && homePage.hero.headline) {
      heroLetters = homePage.hero.headline.replace(/\s+/g, "").toUpperCase();
    }
  }

  return (
    <>
      {/* Hero Section */}
      {homePage?.hero && (
        <HeroImageText
          image={heroImage}
          letters={heroLetters}
          email={heroEmail}
          logo={heroLogo}
        />
      )}

      {/* Page Builder Content (temporarily commented out) */}
      {/**
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
      */}

      {/* Posts Section (temporarily commented out) */}
      {/**
      <div className="border-t border-gray-100 bg-gray-50">
        <div className="container">
          <aside className="py-12 sm:py-20">
            <Suspense>{await AllPosts()}</Suspense>
          </aside>
        </div>
      </div>
      */}
    </>
  );
}
