window.launchCheckout = function launchCheckout() {
    const colorInputs = Array.from(document.querySelectorAll(".checkout-demo .color-selections"));
    const colors = [];

    colorInputs.forEach(el => {
        if (!el.value) return;
        colors.push({
            name: el.name,
            color: el.value,
        });
    });

    const themeInput = document.querySelector(".checkout-demo .popup-theme");
    const theme = themeInput?.value ?? "default";

    Tebex.checkout.init({
        theme: theme,
        colors: colors,
        endpoint: "https://pay.tebex.io",
        defaultPaymentMethod: "paypal",
        launchTimeout: 20_000,
    });

    Tebex.checkout.launch(async () => {
        const response = await fetch("/token");
        const data = await response.json();
        return data.ident;
    });
};

window.launchPortal = function launchPortal() {
    const colorInputs = Array.from(document.querySelectorAll(".portal-demo .color-selections"));
    const colors = [];

    colorInputs.forEach(el => {
        if (!el.value) return;
        colors.push({
            name: el.name,
            color: el.value,
        });
    });

    const themeInput = document.querySelector(".portal-demo .popup-theme");
    const theme = themeInput?.value ?? "default";

    Tebex.portal.init({
        token: "t6c9-0927595131662ac732bf5f1d9bd5570482db5316",
        theme: theme,
        colors: colors,
        endpoint: "https://portal.tebex.io",
    });

    Tebex.portal.launch();
};

addEventListener("load", function (e) {
    document
        .getElementById("loading-container")
        ?.classList.remove("hide");
    document.getElementById("loading-spinner")?.classList.add("hide");

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

    Tebex.portal.on("open", () => {
        console.log("portal opened");
    });

    Tebex.portal.on("close", () => {
        console.log("portal closed");
    });
});
