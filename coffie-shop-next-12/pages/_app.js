import '../styles/globals.css'

function MyApp ({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <footer>
        <p>New footer</p>
      </footer>
    </>
  )
}

export default MyApp
