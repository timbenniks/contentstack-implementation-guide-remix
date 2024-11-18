"use client";
import type { MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getPage, initLivePreview } from "~/lib/contentstack";
import { useEffect, useState } from "react";
import { VB_EmptyBlockParentClass } from "@contentstack/live-preview-utils";
import { LivePreviewQuery } from "@contentstack/delivery-sdk";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export async function loader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const live_preview = url.searchParams.get("live_preview");
  const entry_uid = url.searchParams.get("entry_uid") || "";
  const content_type_uid = url.searchParams.get("content_type_uid") || "";

  const page = await getPage("/", {
    live_preview,
    contentTypeUid: content_type_uid,
    entryUid: entry_uid,
  } as LivePreviewQuery);

  return { page };
}

export default function Index() {
  const { page } = useLoaderData<typeof loader>();

  useEffect(() => {
    initLivePreview();
  }, []);

  return (
    <main className="max-w-screen-md mx-auto">
      <section className="p-4">
        {page?.title ? (
          <h1
            className="text-4xl font-bold mb-4"
            {...(page?.$ && page?.$.title)}
          >
            {page?.title}
          </h1>
        ) : null}
        {page?.description ? (
          <p className="mb-4" {...(page?.$ && page?.$.description)}>
            {page?.description}
          </p>
        ) : null}
        {page?.image ? (
          <img
            className="mb-4"
            width={640}
            height={360}
            src={page?.image.url}
            alt={page?.image.title}
            {...(page?.image?.$ && page?.image?.$.url)}
          />
        ) : null}
        {page?.rich_text ? (
          <div
            {...(page?.$ && page?.$.rich_text)}
            dangerouslySetInnerHTML={{ __html: page?.rich_text }}
          />
        ) : null}

        <div
          className={`space-y-8 max-w-screen-sm mt-4 ${
            !page?.blocks || page.blocks.length === 0
              ? VB_EmptyBlockParentClass
              : ""
          }`}
          {...(page?.$ && page?.$.blocks)}
        >
          {page?.blocks?.map((item, index) => {
            const { block } = item;
            const isImageLeft = block.layout === "image_left";

            return (
              <div
                key={block._metadata.uid}
                {...(page?.$ && page?.$[`blocks__${index}`])}
                className={`flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 bg-slate-100 ${
                  isImageLeft ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                <div className="w-full md:w-1/2">
                  {block.image ? (
                    <img
                      src={block.image.url}
                      alt={block.image.title}
                      width={200}
                      height={112}
                      className="w-full"
                      {...(block?.$ && block?.$.image)}
                    />
                  ) : null}
                </div>
                <div className="w-full md:w-1/2 ">
                  {block.title ? (
                    <h2
                      className="text-2xl font-bold"
                      {...(block?.$ && block?.$.title)}
                    >
                      {block.title}
                    </h2>
                  ) : null}
                  {block.copy ? (
                    <div
                      {...(block?.$ && block?.$.copy)}
                      dangerouslySetInnerHTML={{ __html: block.copy }}
                      className="prose"
                    />
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
