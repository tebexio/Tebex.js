
export async function onRequest(context) {

    let accounts = [
        {
            "name": "Hypixel",
            "logo": "https://dunb17ur4ymx4.cloudfront.net/webstore/logos/6c9b0cbd5c2f0ceef98f01068102b0d056c04b7b.png"
        },
        {
            "name": "InsanityCraft",
            "logo": "https://dunb17ur4ymx4.cloudfront.net/webstore/logos/57d195757d22d2883825769ad27d5ec22366ece7.png"
        },
        {
            "name": "Moonsworth",
            "logo": "https://dunb17ur4ymx4.cloudfront.net/webstore/logos/bd7dacbcd260476788914962aad8aa50d9fd948d.png"
        },
        {
            "name": "UnityRP",
            "logo": "https://dunb17ur4ymx4.cloudfront.net/webstore/logos/8f8d63237dba9c367f960681b950156d2051e887.png"
        }
    ];

    let account = accounts.random();

    const { searchParams } = new URL(context.request.url)
    let basketId = searchParams.get('basket')

    let request = await fetch("https://checkout.tebex.io/api/baskets/" + basketId, {
        method: "GET",
        headers: {
            "Authorization": 'Basic ' + btoa("1361241" + ":" + "G21pZO4WidlTq8uWvU6NF9GZvu9rOZZj")
        }
    });

    if (request.status !== 200) {
        return new Response("404 Not Found", {
            status: 404
        });
    }

    const json = JSON.stringify({
        "services": {
            "nsure": {
                "endpointSdk": "",
                "appId": ""
            },
            "adyen": {
                "originKey": "",
                "clientKey": "",
                "environment": "",
                "disallowedBins": []
            },
            "ebanx": {
                "publicKey": "",
                "environment": "",
                "binList": []
            }
        },
        "id": 123,
        "name": "Hypixel",
        "logoUrl": "https://dunb17ur4ymx4.cloudfront.net/webstore/logos/6c9b0cbd5c2f0ceef98f01068102b0d056c04b7b.png",
        "currency": {
            "name": "US Dollars",
            "symbol": "$",
            "code": "USD"
        },
        "hasCreatorCodes": true,
        "hasCouponCodes": true,
        "hasGiftCards": true,
        "isStandalone": false,
        "darkMode": false,
        "support": {
            "email": "support@hypixel.net",
            "url": "https://support.hypixel.net"
        }
    }, null, 2);

    return new Response(json, {
        headers: {
            "content-type": "application/json;charset=UTF-8",
        },
    });
}



Array.prototype.random = function () {
    return this[Math.floor((Math.random()*this.length))];
}
