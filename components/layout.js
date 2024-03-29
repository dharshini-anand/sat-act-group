import Footer from "./footer";
import Header from "./header";

const Layout = props => (
    <div className="site-wrapper">
        <Header />
        <div className="content-wrapper">{props.children}</div>
        <Footer />
        <style jsx global>{`
            *,
            *::before,
            *::after {
                box-sizing: border-box;
            }

            body {
                margin: 0;
                font-size: 20px;
                line-height: 1.7;
                font-weight: 400;
                background: #fff;
                color: #454545;
                font-family: -apple-system, BlinkMacSystemFont, Roboto, 'Segoe UI', 'Fira Sans', Avenir, 'Helvetica Neue',
                'Lucida Grande', sans-serif;
                text-rendering: optimizeLegibility;
            }

            a {
                color: #1b789e;
                text-decoration: none;
            }

            a:hover {
                color: #166281;
            }

            h1,
            h2,
            h3 {
                margin: 30px 0 30px;
            }

            h1 {
                font-size: 42px;
            }

            h2 {
                font-size: 36px;
            }

            p {
                margin: 0 0 10px;
            }

            img {
                max-width: 100%;
            }

            /* Layout */

            .content-wrapper {
                min-height: 100%;
                text-align: center;
            }
        `}</style>
    </div>
);
  
export default Layout;