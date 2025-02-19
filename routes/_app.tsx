import { Head } from "$fresh/runtime.ts";
import { AppProps } from "$fresh/src/server/types.ts";

export default function App(props: AppProps) {
  const { Component } = props;

  return (
    <html>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <title>Fresh project | starter code</title>
        <link rel="icon" type="image/png" href="../favicon.ico" />
        <link rel="stylesheet" href="../styles/tailwind.css" />
      </Head>
      <body class="antialiased">
        <Component />
        <script>
          {`
            // Restore scroll position on load.
            window.addEventListener("load", () => {
              const scrollY = localStorage.getItem("scrollY");
              if (scrollY) {
                window.scrollTo(0, parseInt(scrollY, 10));
              }
            });
            // Save scroll position on scroll.
            window.addEventListener("scroll", () => {
              localStorage.setItem("scrollY", window.scrollY.toString());
            });
          `}
        </script>
      </body>
    </html>
  );
}