export default function Head() {
  return (
    <>
      <title>JOK Cosmetics</title>
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      <meta name="description" content="Ihr Kosmetikstudio in der Region" />
      <link rel="icon" href="/favicon.ico" />
      <link 
        rel="preload" 
        href="/images/logo/jok-text-logo.svg" 
        as="image" 
        type="image/svg+xml"
        fetchPriority="high"
      />
      <link
        rel="preload"
        href="/fonts/Inter.var.woff2"
        as="font"
        type="font/woff2"
        fetchPriority="high"
      />
    </>
  )
}
