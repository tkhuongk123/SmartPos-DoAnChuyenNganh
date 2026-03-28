import Footer from "../components/Footer";
import Toolbar from "../components/Toolbar";
import AdminNavbar from "../components/AdminNavbar";
import "./DefaultLayout.css";

function DefaultLayout({ children }) {
    const user = JSON.parse(sessionStorage.getItem('user')) || '';
    const isAdmin = user.role === "MANAGER";

    return (
        <div className="DefaultLayout">
            {isAdmin && (
                <div className="DefaultLayout_AdminNavbar">
                    <AdminNavbar />
                </div>
            )}
            <div className="DefaultLayout_Header">
            </div>
            <div className="DefaultLayout_Toolbar">
                <Toolbar />
            </div>
            <div className={`DefaultLayout_Main ${isAdmin ? 'with-navbar' : ''}`}>
                {children}
            </div>
            <div className="DefaultLayout_Footer">
                <Footer />
            </div>
        </div>
    )
}

export default DefaultLayout
