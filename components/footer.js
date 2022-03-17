export default function Footer() {
    return (
        <div className = "footer-wrapper">
            <div className = "copyright">© {new Date().getFullYear()} SAT/ACT Group.</div>
            <style jsx>{`
                .footer-wrapper {
                    text-align: center;
                    padding: 10px 30px;
                }
                .copyright {
                    margin-bottom: 0;
                }
            `}</style>
        </div>
    )
}