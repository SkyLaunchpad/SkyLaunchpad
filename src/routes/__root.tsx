import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { Toaster } from "sonner";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { AuthProvider } from "@/lib/auth/provider";
import { ProtocolProvider } from "@/lib/chain/protocol";
import { WalletProvider } from "@/lib/chain/wallet";
import appCss from "../styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Sky Launchpad" },
      {
        name: "description",
        content:
          "SkyLaunchpad is a non-custodial token launchpad on Robinhood Chain mainnet. Fixed supply, locked curve liquidity, one signature.",
      },
      { name: "theme-color", content: "#d7ecfb" },
    ],
    links: [
      { rel: "icon", type: "image/png", href: "/sky-mark.png" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
    ],
  }),
  component: () => (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: "try{if(localStorage.getItem('sky.theme')==='dark')document.documentElement.dataset.theme='dark'}catch(e){}",
          }}
        />
        <PreviewHostBridge />
        <AuthProvider>
          <WalletProvider>
            <ProtocolProvider>
              <Outlet />
              <Toaster theme="dark" position="top-center" />
            </ProtocolProvider>
          </WalletProvider>
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  ),
});
