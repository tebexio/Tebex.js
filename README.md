# Tebex.js

Integrate Tebex Checkout directly into your own website or game using our embedded checkout experience.

## Demo

You can view a live demo of this repo by visiting https://js.tebex.io

## 🛠️ Quick Start

### ⚡ Install

#### From NPM

Tebex.js is available as an NPM package, which you can install using your preferred JS package manager:

```sh
npm install @tebexio/tebex.js
```

The `Tebex` object can then be imported into your code like so:

```js
import Tebex from '@tebexio/tebex.js'
```

#### From Our CDN

Alternatively, we also provide Tebex.js via our own CDN, which you can add as a script within the `<head>` tag of your website:

```html
<script defer src="https://js.tebex.io/v/1.0.0.js"></script>
```

> We will automatically update `v/1.js` with new minor and patch releases of Tebex.js. This shouldn't present any breaking changes, but if you would prefer to stay on a fixed version, you can specify the full version number in the URL, for example `https://js.tebex.io/v/1.1.1.js`. Version history can be found on our [releases](https://github.com/tebexio/Tebex.js/releases) page.

When installing Tebex.js this way, the `Tebex` object will become available globally on the `window` object.

We recommend using `defer` on the script to prevent it from blocking your website's initial page render, but when doing do, it's important to **wait for the page `load` event** before you begin configuring the checkout:

```html
<script>
    addEventListener('load', function() {
        
        // Configure Tebex.js here

    })
</script>
```

### ⚙️ Config

Before your checkout can be launched, it must first be configured by calling the ```Tebex.checkout.init()``` method:

```js
Tebex.checkout.init({
    ident: "your checkout request ident goes here"
})
```

The only required option is `ident`, which you must replace with the checkout request ident retrieved from using the Headless API or the Checkout API (depending on your integration method).

For further information regarding configuration options - such as checkout branding colors - please refer to the [Tebex.js Documentation](https://docs.tebex.io/developers/tebex.js).

### 🚀 Launch

When you are ready to show the Tebex.js checkout to your user, you can call the `Tebex.checkout.launch()` method. On desktop devices this will open the checkout as a popup, while on mobile devices it will open as a new tab.

### 🧩 Web Components

As an alternative to using the `Tebex.checkout` JavaScript API, Tebex.js also provides a `tebex-checkout` [Web Component](https://developer.mozilla.org/en-US/docs/Web/API/Web_components).

With this, you can embed a Tebex Checkout into your page by placing the `<tebex-checkout></tebex-checkout>` HTML tag anywhere in your page's `<body>`, so long as Tebex.js is also loaded into the page:

```html
<html>
    <head>
        <script defer src="https://js.tebex.io/v/1.js"></script>
    </head>
    <body>
        <tebex-checkout ident="your checkout request ident goes here">
            <button>Open Checkout</button>
        </tebex-checkout>
    </body>
</html>
```

In the example above, we also add a `<button>` element inside the `tebex-checkout` element. Tebex.js can automatically attach click handlers to any elements you place inside the `tebex-checkout` element, so that when they're clicked, the checkout will launch as a popup.

The `tebex-checkout` element also has an "inline" mode for rendering the checkout directly inline with the rest of the page content, along with various HTML attributes for checkout configuration. For more details, please refer to the [Tebex.js Web Components Documentation](https://docs.tebex.io/developers/tebex.js).

### ❓ What's Next?

We recommend reading the full [Tebex.js Documentation](https://docs.tebex.io/developers/tebex.js) to get an overview of all available options, events, and advanced functionality.

## 🔗 Useful Links

- [Tebex.js Documentation](https://docs.tebex.io/developers/tebex.js)
- [Headless API Documentation](https://docs.tebex.io/developers/headless-api/overview)
- [Headless Store Template](https://github.com/tebexio/Headless-Template)

## 🙋‍♂️ Support

For issues relating to this library, please contact [support@tebex.io](mailto:support@tebex.io).