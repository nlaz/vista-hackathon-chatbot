import Script from "next/script";

function GoogleAnalytics() {
	return (
    <>
      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-SHPPT7HQHE"
      />
      <Script id="google-analytics">
        {`
			window.dataLayer = window.dataLayer || [];
			function gtag(){dataLayer.push(arguments);}
			gtag('js', new Date());

			gtag('config', '');
			`}
      </Script>
    </>
  )
}

export default GoogleAnalytics;