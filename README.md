# `browser-window`

A small themed zero-dependency Web Component for demos with a fake browser window (Safari-esque).

* [**Go to the Demo**](https://zachleat.github.io/browser-window/demo.html)
* [Read the blog post](https://www.zachleat.com/web/browser-window/)

> “this is maybe my favoritest [web component] yet.”—[Dave Rupert, President of Web Components](https://mastodon.social/@davatron5000/111301972550207963)

## Installation

Via [`npm`](https://www.npmjs.com/package/@zachleat/browser-window) or download [`browser-window.js`](./browser-window.js) directly for use in your project.

```sh
npm install @zachleat/browser-window
```

## Changelog

- `v3.2.0` `url` accepts a root-relative path (`url="/post1/"`), shown as-is.
- `v3.1.0` adds an opt-in `fill` attribute so the window fills the height of a stretched flex or grid item.
- `v3.0.0` swaps to use `light-dark` and `color-scheme` for easier light/dark mode configuration! This has browser support implications!
- `v2.0.0` URL bar now shows the full url by default (including pathname, searchParams, et al). Use `url-mode="hostname-only"` to swap back to previous behavior.