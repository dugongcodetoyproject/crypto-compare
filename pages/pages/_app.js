// pages/_app.js
import '../styles/globals.css'; // Tailwind CSS 스타일 추가

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
