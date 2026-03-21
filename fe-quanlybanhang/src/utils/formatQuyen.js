export default function formatQuyen(idquyen) {
    if(idquyen === 0) {
        return "Quản lý"
    } else if(idquyen === 1) {
        return "Nhân viên"
    } else if(idquyen === 2) {
        return "Bếp"
    } else if(idquyen === 3) {
        return "Khách hàng"
    } else {
        return "error"
    }
}