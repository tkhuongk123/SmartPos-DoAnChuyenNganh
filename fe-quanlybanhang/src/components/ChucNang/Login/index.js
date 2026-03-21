import validation from "../../../utils/validation";
import { NotifyError, NotifyWarning } from "../../components/Toast";
import "./Login.css";
import { LoginAPI } from "../../../services/UserAPI";

function Login() {

    const login = async() => {
        const tenDangNhapE = document.getElementById('tendangnhap');
        const matKhauE = document.getElementById('matkhau');
        
        if(validation(tenDangNhapE) && validation(matKhauE)) {
            const username = tenDangNhapE.value.trim();
            const password = matKhauE.value.trim();
            const data = await LoginAPI({username, password})

            if(data.taiKhoan) {
                // console.log(">>> data: ", data.taiKhoan);
                sessionStorage.setItem('user', JSON.stringify(data.taiKhoan))
                if(data.taiKhoan.role == "MANAGER") {
                    window.location.href = "/quanly/thongke";
                } else if(data.taiKhoan.role == "CASHIER") {
                    window.location.href = "/nhanvien/xemtrangthaiban";
                } else if(data.taiKhoan.role == "KITCHEN") {
                    window.location.href = ("/bep/nhandon");
                } else {
                    window.location.reload();
                }
            } else {
                NotifyError(data.error)
            }
        } else {
            NotifyWarning('Vui lòng nhập thông tin đầy đủ')
        }
    }

    return (
        <div className="DangNhap">
            <div className="DangNhap_main">
                <h2>Đăng nhập</h2>
                <form className="DangNhap_form" onSubmit={(e) => {
                    e.preventDefault();
                    login();
                }}>
                    <input id="tendangnhap" type="text" placeholder="Tên đăng nhập"/>
                    <input id="matkhau" type="password" placeholder="Mật khẩu"/>

                    <div className="DangNhap_option">
                        <div className="DangNhap_option-nhoMatKhau">
                            <input id="nhomatkhau" type="checkbox"/>
                            <label htmlFor="nhomatkhau">Nhớ mật khẩu</label>
                        </div>
                        <div className="DangNhap_option-quenMatKhau">
                            <span>Quên mật khẩu?</span>
                        </div>
                    </div>  

                    <button type="submit">Đăng nhập</button>
                </form> 
            </div>
        </div>
    )
}

export default Login