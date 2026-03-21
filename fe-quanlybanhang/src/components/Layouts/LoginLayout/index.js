import "./LoginLayout.css";
import Footer from "../components/Footer";
import Header from "../components/Header";


function LoginLayout({ children }) {
    return (
        <div className="LoginLayout">
            <div className="LoginLayout_Header">
                <Header />
            </div>
            <div className="LoginLayout_Main">
                <img src={`${process.env.PUBLIC_URL}/favicon.png`} alt="Logo"/>
                {children}
            </div>
            <div className="LoginLayout_Footer">
                <Footer />
            </div>
        </div>
    )
}

export default LoginLayout
