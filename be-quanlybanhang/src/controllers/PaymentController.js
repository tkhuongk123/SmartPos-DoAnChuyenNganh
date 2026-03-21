const db = require("../config/db");
const axios = require("axios");

class PaymentController {
    async thanhToan(req, res, next) {
        const {tongTien, redirectUrlFe} = req.body;
        var accessKey = 'F8BBA842ECF85';
        var secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
        var orderInfo = 'pay with MoMo';
        var partnerCode = 'MOMO';
        var redirectUrl = redirectUrlFe;
        var ipnUrl = 'http://localhost:8000/payment/momoIPN';
        var requestType = "payWithMethod";
        var amount = String(tongTien);
        var orderId = partnerCode + new Date().getTime();
        var requestId = orderId;
        const extraData = '';
        var orderGroupId = '';
        var autoCapture = true;
        var lang = 'vi';

        // tạo chữ ký
        var rawSignature =
            "accessKey=" + accessKey +
            "&amount=" + amount +
            "&extraData=" + extraData +
            "&ipnUrl=" + ipnUrl +
            "&orderId=" + orderId +
            "&orderInfo=" + orderInfo +
            "&partnerCode=" + partnerCode +
            "&redirectUrl=" + redirectUrl +
            "&requestId=" + requestId +
            "&requestType=" + requestType;

        const crypto = require('crypto');
        var signature = crypto.createHmac('sha256', secretKey)
            .update(rawSignature)
            .digest('hex');

        const requestBody = JSON.stringify({
            partnerCode: partnerCode,
            partnerName: "Test",
            storeId: "MomoTestStore",
            requestId: requestId,
            amount: amount,
            orderId: orderId,
            orderInfo: orderInfo,
            redirectUrl: redirectUrl,
            ipnUrl: ipnUrl,
            lang: lang,
            requestType: requestType,
            autoCapture: autoCapture,
            extraData: extraData,
            orderGroupId: orderGroupId,
            signature: signature
        });

        // option for axios
        const options = {
            method: "POST",
            url: "https://test-payment.momo.vn/v2/gateway/api/create",
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(requestBody)
            },
            data: requestBody
        }

        
        try {
            const result = await axios(options);
            return res.status(200).json({
                message: "Sửa loại sản phẩm thành công",
                shortLink: result.data.shortLink
            })
        } catch (error) {
            return res.status(500).json({
                error: error,
                message: "Server Error"
            })
        }
    }


    
}

module.exports = new PaymentController()
