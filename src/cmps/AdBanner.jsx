import { useEffect } from "react"

function AdBanner() {
  const isTesting = import.meta.env.VITE_IS_TESTING === "true"

  const clientId = import.meta.env.VITE_ADSENSE_CLIENT_ID
  const slotId = import.meta.env.VITE_ADSENSE_SLOT_ID

  useEffect(() => {
    if (!isTesting) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({})
      } catch (e) {
        console.error(e)
      }
    }
  }, [isTesting])

  if (isTesting) {
    return (
      <div
        style={{
          width: "100%",
          height: 90,
          backgroundColor: "#eee",
          color: "#666",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          border: "1px dashed #aaa",
          fontSize: 14,
        }}
      >
      </div>
    )
  }

  return (
    <>
      <script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
        crossOrigin="anonymous"
      ></script>

      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={clientId}
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </>
  )
}

export default AdBanner
