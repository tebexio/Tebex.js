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
    ident: "your checkout request ID goes here"
})
```

The only required option is `ident`, which you must replace with the checkout request ID retrieved from using the Headless API or the Checkout API (depending on your integration method).

For further information regarding configuration options - such as checkout branding colors - please refer to the [Tebex.js Documentation](https://docs.tebex.io/developers/tebex.js).

### 🚀 Launch

When you are ready to show the Tebex.js checkout to your user, you can call the `Tebex.checkout.launch()` method. On desktop devices this will open the checkout as a popup, while on mobile devices it will open as a new tab.

### What's Next?

We recommend reading the full [Tebex.js Documentation](https://docs.tebex.io/developers/tebex.js) to get an overview of all available options, events, and advanced functionality.

## 🔗 Useful Links

- [Tebex.js Documentation](https://docs.tebex.io/developers/tebex.js)
- [Headless API Documentation](https://docs.tebex.io/developers/headless-api/overview)
- [Headless Store Template](https://github.com/tebexio/Headless-Template)

## 🙋‍♂️ Support

For issues relating to this library, please contact [support@tebex.io](mailto:support@tebex.io).