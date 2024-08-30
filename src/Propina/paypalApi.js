let baseUrl = 'https://api.paypal.com';
//let baseUrl = 'https://api.sandbox.paypal.com';
const base64 = require('base-64');

let clientId = 'AQl4TzM8BAncjaaZRaaCydJ6NT1RgQay_oKSWzKFgbcXjmPsVinlOONOlCzbxX-8jXWwTBkNtonKctFt';
let secretKey = 'EITosbu46w2d-SUYVNv_JqMcMgVmlIeHHR_CSRt6CcO76e-vH9HHlGAglTlY9P87v0tTOsBY2JcsvZh7';
//let clientId =  'ARERv9GgCAdH2290uv7X7P_qtAN5g-2CSVp6rYYmCmMZknIK-m67TNMFE__svnyx2NPxmsN0MApuKSoy';
//let secretKey = 'ECvCfs7B1MUUAhk4HS6lxIgwGp6WHTM8piZqejPvBJ4fNFsv7z4KQDsj5D6vizgj75Caa7mn4y2szJAg';

const generateToken = () => {
    var headers = new Headers()
    headers.append("Content-Type", "application/x-www-form-urlencoded");
    headers.append("Authorization", "Basic " + base64.encode(`${clientId}:${secretKey}`));

    var requestOptions = {
        method: 'POST',
        headers: headers,
        body: 'grant_type=client_credentials',
    };

    return new Promise((resolve, reject) => {
        fetch(baseUrl + '/v1/oauth2/token', requestOptions).then(response => response.text()).then(result => {
            console.log("result print", result)
            const { access_token } = JSON.parse(result)
            resolve(access_token)
        }).catch(error => {
            console.log("error raised", error)
            reject(error)
        })
    })
}

const createOrder = (token = '', donacion = 0) => {
    let orderDetail = {
        "intent": "CAPTURE",
        "purchase_units": [
            {
                "items": [
                    {
                        "name": "Donation",
                        "description": "Donation",
                        "quantity": "1",
                        "unit_amount": {
                            "currency_code": "USD",
                            "value": donacion.toString()
                        }
                    }
                ],
                "amount": {
                    "currency_code": "USD",
                    "value": donacion.toString(),
                    "breakdown": {
                        "item_total": {
                            "currency_code": "USD",
                            "value": donacion.toString()
                        }
                    }
                }
            }
        ],
        "application_context": {
            "return_url": "https://example.com/return",
            "cancel_url": "https://example.com/cancel"
        }
    }
    
    var requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`

        },
        body: JSON.stringify(orderDetail)
    };

    return new Promise((resolve, reject) => {
        fetch(baseUrl + '/v2/checkout/orders', requestOptions).then(response => response.text()).then(result => {
            console.log("result print", result)
            const res = JSON.parse(result)
            resolve(res)
        }).catch(error => {
            console.log("error raised", error)
            reject(error)
        })
    })
}

const capturePayment = (id, token = '') => {
    var requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`

        },
    };

    return new Promise((resolve, reject) => {
        fetch(baseUrl + `/v2/checkout/orders/${id}/capture`, requestOptions).then(response => response.text()).then(result => {
            console.log("result print", result)
            const res = JSON.parse(result)
            resolve(res.purchase_units[0].payments.captures[0].seller_receivable_breakdown.net_amount.value)
        }).catch(error => {
            reject('error')
        })
    })
}


export default {
    generateToken,
    createOrder,
    capturePayment
}