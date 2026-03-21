export const layNgayGio = () => {
    const now = new Date();

    // Lấy giờ, phút, giây
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    // Lấy ngày, tháng, năm
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0, cần cộng thêm 1
    const year = now.getFullYear();

    return `${hours}:${minutes}:${seconds} - ${day}/${month}/${year}`;
}