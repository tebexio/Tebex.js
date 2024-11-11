function respondWithError(message, status = 500) {
    return new Response(JSON.stringify({ error: message }), {
        status,
        headers: {
            "content-type": "application/json;charset=UTF-8",
        },
    });
}

export async function onRequest(request) {
    const env = request.env;

    let basketIdent;

    try {
        const response = await fetch(
            `${env.HEADLESS_API_ENDPOINT}/api/accounts/${env.ACCOUNT_ID}/baskets`,
            {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: `${env.USERNAME}`,
                    complete_url: "https://tebex-js.pages.dev/complete",
                    cancel_url: "https://tebex-js.pages.dev/cancel",
                }),
            }
        );

        if (!response.ok) {
            throw new Error("Failed to create basket");
        }

        const { data } = await response.json();

        console.log("Basket created", data);

        basketIdent = data.ident;
    } catch (e) {
        return respondWithError("Failed to create basket");
    }

    console.log("Basket ident: ", basketIdent);

    let packageIds = env.PACKAGE_IDS.split(",");

    for (let packageId of packageIds) {
        try {
            const response = await fetch(
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

            if (!response.ok) {
                console.log(await response.text());
                throw new Error("Failed to add package to basket");
            }
        } catch (e) {
            return respondWithError("Failed to add package to basket");
        }
    }

    const json = JSON.stringify({ ident: basketIdent }, null, 2);

    return new Response(json, {
        headers: {
            "content-type": "application/json;charset=UTF-8",
        },
    });
}
