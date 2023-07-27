import Head from "next/head"

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link href="/styles.css" rel="stylesheet" />
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans&display=swap"
          rel="stylesheet"
        ></link>
      </Head>
      <Component {...pageProps} />
    </>
  )
}
