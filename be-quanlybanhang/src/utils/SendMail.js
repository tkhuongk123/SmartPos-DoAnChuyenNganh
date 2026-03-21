const nodemailer = require('nodemailer')

// Tạo transporter để kết nối với dịch vụ email của bạn
const transporter = nodemailer.createTransport({
  service: 'gmail', // hoặc sử dụng 'yahoo', 'hotmail', tùy dịch vụ bạn sử dụng
  auth: {
    user: 'nguyendinhthongdhsg@gmail.com', // Thay bằng email của bạn
    pass: 'brev druz dltn ttpl'   // Thay bằng mật khẩu hoặc mật khẩu ứng dụng
  }
})

// Hàm gửi email
function SendEmail(to, subject, text) {
  const mailOptions = {
    from: 'nguyendinhthongdhsg@gmail.com',
    to: to,
    subject: subject,
    text: text,
  }

  return transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error)
    } else {
      console.log(succes)
    }
  })
}

module.exports = SendEmail
