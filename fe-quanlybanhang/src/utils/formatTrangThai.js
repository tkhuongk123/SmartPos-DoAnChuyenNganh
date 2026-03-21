
export function formatTrangThai(trangthai) {
    if(trangthai === '30') {
        return 'Đã đặt'
    } else if (trangthai === '10') {
        return 'Nhân viên đã nhận đơn'
    } else if (trangthai === '11') {
        return 'Đã xong'
    } else if (trangthai === '12') {
        return 'Đơn hàng bị từ chối'
    } else if (trangthai === '20') {
        return 'Bếp nhận đơn'
    } else if (trangthai === '21') {
        return 'Bếp nấu xong'
    }
}
