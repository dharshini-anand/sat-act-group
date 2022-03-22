import '../styles/tailwind.css'
import Layout from '../components/layout';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider } from "../lib/auth";

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AuthProvider>
      
  )
}

export default MyApp

