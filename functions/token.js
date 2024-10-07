export async function onRequest(request) {
    const env = request.env;

    let basketIdent;

    try {
        let createBasketRequest = await fetch(
            `${env.HEADLESS_API_ENDPOINT}/api/accounts/${env.ACCOUNT_ID}/baskets`,
            {
                method: "POST",
                body: JSON.stringify({
                    username: "Notch",
                    complete_url: "https://tebex-js.pages.dev/complete",
                    cancel_url: "https://tebex-js.pages.dev/cancel",
                }),
                headers: {
                    "content-type": "application/json;charset=UTF-8",
                },
            }
        );

        const createBasketResponse = await createBasketRequest.json();
        basketIdent = createBasketResponse.data.ident;

    } catch (e) {
        return new Response("Failed to create basket", {
            status: 500,
        });
    }

    let packageIds = env.PACKAGE_IDS.split(",");

    for (let packageId of packageIds) {
        await fetch(
            `${env.HEADLESS_API_ENDPOINT}/api/baskets/${basketIdent}/packages`,
            {
                method: "POST",
                body: JSON.stringify({
                    package_id: packageId,
                }),
                headers: {
                    "content-type": "application/json;charset=UTF-8",
                },
            }
        );
    }

    const json = JSON.stringify({ ident: basketIdent }, null, 2);

    return new Response(json, {
        headers: {
            "content-type": "application/json;charset=UTF-8",
        },
    });
}
