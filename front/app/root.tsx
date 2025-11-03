import { Text, Theme } from "@radix-ui/themes";
import { QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import i18n from "./shared/utils/i18n"; // Import i18n instance
import { queryClient } from "./shared/utils/queryClient";

import "@radix-ui/themes/styles.css";
import "./app.css";

export function Layout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Set initial language on mount
    if (typeof window !== "undefined" && window.document) {
      window.document.documentElement.lang = i18n.language || "en";
    }
  }, []);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <Theme asChild>
        <body>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
          <ScrollRestoration />
          <Scripts />
        </body>
      </Theme>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function HydrateFallback() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
      <div className="flex flex-col items-center gap-8">
        {/* Logo/Brand Name with fade-in animation */}
        <div className="flex flex-col items-center gap-3 animate-fade-in">
          <div className="text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent animate-gradient">
            PM Tools
          </div>
          <Text as="p" size="2" className="text-sm text-gray-600 font-medium">
            Project Management
          </Text>
        </div>

        {/* Spinner with pulse animation */}
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          <div className="w-16 h-16 border-4 border-purple-600 border-r-transparent rounded-full animate-spin-reverse absolute top-0 left-0 opacity-50"></div>
        </div>

        {/* Loading text with pulse animation */}
        <Text as="p" size="2" className="text-sm text-gray-500 animate-pulse">
          Loading, please wait...
        </Text>
      </div>
    </div>
  );
}

// export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
//   let message = "Oops!";
//   let details = "An unexpected error occurred.";
//   let stack: string | undefined;

//   if (isRouteErrorResponse(error)) {
//     message = error.status === 404 ? "404" : "Error";
//     details =
//       error.status === 404
//         ? "The requested page could not be found."
//         : error.statusText || details;
//   } else if (import.meta.env.DEV && error && error instanceof Error) {
//     details = error.message;
//     stack = error.stack;
//   }

//   return (
//     <main className="pt-16 p-4 container mx-auto">
//       <h1>{message}</h1>
//       <p>{details}</p>
//       {stack && (
//         <pre className="w-full p-4 overflow-x-auto">
//           <code>{stack}</code>
//         </pre>
//       )}
//     </main>
//   );
// }
