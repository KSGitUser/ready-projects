import Document, { Html, Head, Main, NextScript } from 'next/document'

const fontsPaths = {
  ibmPlexSansLatinExtNormal400:
    '/fonts/ibm-plex-sans-latin-ext-normal-400.woff2',
  ibmPlexSansLatinExtNormal600:
    '/fonts/ibm-plex-sans-latin-ext-normal-600.woff2',
  ibmPlexSansLatinExtNormal700:
    '/fonts/ibm-plex-sans-latin-ext-normal-700.woff2',
  ibmPlexSansLatinNormal400: '/fonts/ibm-plex-sans-latin-normal-400.woff2',
  ibmPlexSansLatinNormal600: '/fonts/ibm-plex-sans-latin-normal-600.woff2',
  ibmPlexSansLatinNormal700: '/fonts/ibm-plex-sans-latin-normal-700.woff2'
}

class MyDocument extends Document {
  render () {
    console.log('Document')
    return (
      <Html lang='en'>
        <Head>
          {Object.values(fontsPaths).map(path => {
            return (
              <link
                key={path}
                rel='preload'
                href={path}
                as='font'
                crossOrigin='anonymous'
              />
            )
          })}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
