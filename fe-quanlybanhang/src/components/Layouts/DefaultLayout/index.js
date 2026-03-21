import Footer from "../components/Footer";
import Toolbar from "../components/Toolbar";
import "./DefaultLayout.css";

function DefaultLayout({ children }) {
    return (
        <div className="DefaultLayout">
            <div className="DefaultLayout_Header">
            </div>
            <div className="DefaultLayout_Toolbar">
                <Toolbar />
            </div>
            <div className="DefaultLayout_Main">
                {children}
            </div>
            <div className="DefaultLayout_Footer"> 
                <Footer />
            </div>
        </div>
    )
}

export default DefaultLayout
