let ident = null;

function launch() {
    const config = {
        ident: ident,
        theme: document.getElementById("popup-theme")?.value,
        colors: [],
        endpoint: "https://pay.dev.tebex.io",
        defaultPaymentMethod: "paypal",
    };

    Array.prototype.forEach.call(
        document.getElementsByClassName("color-selections"),
        function (el) {
            if (!el.value) return;
            config.colors.push({
                name: el.name,
                color: el.value,
            });
        }
    );

    Tebex.checkout.init(config);
    Tebex.checkout.launch();
}

addEventListener("load", function (e) {
    fetch("/token")
        .then((response) => response.json())
        .then((response) => {
            ident = response.ident;
            document
                .getElementById("loading-container")
                ?.classList.remove("hide");
            document.getElementById("loading-spinner")?.classList.add("hide");
        });

    Tebex.checkout.on("open", () => {
        console.log("checkout opened");
    });

    Tebex.checkout.on("close", () => {
        console.log("checkout closed");
    });

    Tebex.checkout.on("payment:complete", (event) => {
        console.log("payment completed", event);
    });

    Tebex.checkout.on("payment:error", (event) => {
        console.log("payment errored", event);
    });
});

window.launch = launch;
