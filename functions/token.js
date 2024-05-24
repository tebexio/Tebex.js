export async function onRequest(context) {
    let createBasketRequest = await fetch("https://headless.tebex.io/api/accounts/t6c9-0927595131662ac732bf5f1d9bd5570482db5316/baskets", {
        method: "POST",
        body: JSON.stringify({
            username: "Notch",
            complete_url: "https://tebex-js.pages.dev/complete",
            cancel_url: "https://tebex-js.pages.dev/cancel",
        }),
        headers: {
            "content-type": "application/json;charset=UTF-8",
        }
    });

    const createBasketResponse = await createBasketRequest.json();
    const basketIdent = createBasketResponse.data.ident;

    await fetch(`https://headless.tebex.io/api/baskets/${basketIdent}/packages`, {
        method: "POST",
        body: JSON.stringify({
            package_id: 5987844
        }),
        headers: {
            "content-type": "application/json;charset=UTF-8",
        }
    });

    await fetch(`https://headless.tebex.io/api/baskets/${basketIdent}/packages`, {
        method: "POST",
        body: JSON.stringify({
            package_id: 5987895
        }),
        headers: {
            "content-type": "application/json;charset=UTF-8",
        }
    });

    const json = JSON.stringify({ ident: basketIdent }, null, 2);

    return new Response(json, {
        headers: {
            "content-type": "application/json;charset=UTF-8",
        },
    });
}

