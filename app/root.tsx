import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import "./tailwind.css";

export async function loader() {
  return {
    ENV: {
      CONTENTSTACK_API_KEY: process.env.CONTENTSTACK_API_KEY,
      CONTENTSTACK_DELIVERY_TOKEN: process.env.CONTENTSTACK_DELIVERY_TOKEN,
      CONTENTSTACK_PREVIEW_TOKEN: process.env.CONTENTSTACK_PREVIEW_TOKEN,
      CONTENTSTACK_ENVIRONMENT: process.env.CONTENTSTACK_ENVIRONMENT,
      CONTENTSTACK_REGION: process.env.CONTENTSTACK_REGION,
      CONTENTSTACK_PREVIEW: process.env.CONTENTSTACK_PREVIEW,
    },
  };
}

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

type LoaderData = {
  ENV: {
    CONTENTSTACK_API_KEY: string;
    CONTENTSTACK_DELIVERY_TOKEN: string;
    CONTENTSTACK_PREVIEW_TOKEN: string;
    CONTENTSTACK_ENVIRONMENT: string;
    CONTENTSTACK_REGION: string;
    CONTENTSTACK_PREVIEW: string;
  };
};

export function Layout({ children }: { children: React.ReactNode }) {
  const data = useLoaderData<LoaderData>();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(data.ENV)}`,
          }}
        />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
