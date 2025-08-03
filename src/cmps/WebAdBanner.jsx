import { Capacitor } from "@capacitor/core"
import { useEffect } from "react"

function WebAdBanner() {
  const isWeb = !Capacitor.isNativePlatform()
  const isTesting = import.meta.env.VITE_IS_TESTING === "true"
  const clientId = import.meta.env.VITE_ADSENSE_CLIENT_ID
  const slotId = import.meta.env.VITE_ADSENSE_SLOT_ID

  useEffect(() => {
    if (isWeb && !isTesting && window.adsbygoogle) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({})
      } catch (e) {
        console.error("AdSense error", e)
      }
    }
  }, [isTesting])

  if (isWeb && isTesting) {
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
        AdSense placeholder (testing mode)
      </div>
    )
  }

  return (
    <>
      {isWeb && <div>
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client={clientId}
          data-ad-slot={slotId}
          data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>  
      </div>}
    </>
  )
}

export default WebAdBanner
