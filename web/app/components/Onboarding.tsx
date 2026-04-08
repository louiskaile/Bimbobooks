"use client";

/**
 * This file is used for onboarding when you don't have content yet and are using the template for the first time.
 * Once you have provided a url for the environment variable NEXT_PUBLIC_SANITY_STUDIO_URL, and have content, you can delete this file.
 */

import Link from "next/link";
import { useIsPresentationTool } from "next-sanity/hooks";
import { createDataAttribute } from "next-sanity";
import { uuid } from "@sanity/uuid";

import { studioUrl } from "@/sanity/lib/api";

type OnboardingMessageProps = {
  message: {
    title: string;
    description: string;
  };
  link: {
    title: string;
    href: string;
    showIcon?: boolean;
  };
  type?: string;
  path?: string;
};

const OnboardingMessage = ({
  message,
  link,
  type,
  path,
}: OnboardingMessageProps) => {
  const isPresentation = useIsPresentationTool();

  return (
    <>
      <div>
        <h3 className="text-2xl font-semibold">{message.title}</h3>
        <p className="mt-1 text-sm text-white/80">{message.description}</p>
      </div>

      <div>
        {!isPresentation ? (
          <Link
            className="inline-flex rounded-full gap-2 items-center bg-white text-brand hover:bg-brand focus:bg-brand hover:text-white focus:text-white py-3 px-6 transition-colors duration-200"
            href={link.href}
            target="_blank"
          >
            {link.title}
            {(link.showIcon ?? true) && (
              <svg
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
              </svg>
            )}
          </Link>
        ) : (
          <button
            className="cursor-pointer inline-flex rounded-full gap-2 items-center bg-white text-brand hover:bg-blue focus:bg-blue py-3 px-6 transition-colors duration-200"
            data-sanity={createDataAttribute({
              id: uuid(),
              type,
              path,
            }).toString()}
          >
            {link.title}
            {(link.showIcon ?? true) && (
              <svg
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
              </svg>
            )}
          </button>
        )}
      </div>
    </>
  );
};

export default function Onboarding() {
  return (
    <div className="max-w-2xl mx-auto grid grid-flow-row gap-6 py-12 text-center bg-brand text-white rounded-lg p-8">

      <OnboardingMessage
        message={{
          title: "No posts yet",
          description: "Get started by creating a new post.",
        }}
        link={{
          title: "Create Post",
          href: `${studioUrl}/structure/intent/create/template=post;type=post;path=title`,
        }}
        type="post"
        path="title"
      />
    </div>
  );
}

export function PageOnboarding({ slug = "about" }: { slug?: string }) {
  return (
    <div className="max-w-2xl mx-auto grid grid-flow-row gap-6 py-12 text-center bg-brand text-white rounded-lg p-8">
      <OnboardingMessage
        message={{
          title: `Page (/${slug}) does not exist yet`,
          description: `Get started by creating a ${slug} page.`,
        }}
        link={{
          title: "Create Page",
          href: `${studioUrl}/structure/intent/create/template=page;type=page;path=name`,
        }}
        type="page"
        path="name"
      />
    </div>
  );
}
