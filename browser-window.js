class BrowserWindow extends HTMLElement {
	static tagName = "browser-window";

	static attrs = {
		url: "url",
		icon: "icon",
		flush: "flush",
		shadow: "shadow",
		grayscale: "grayscale",
		os: "os",
		mode: "mode", // values: "dark", "light"
	};

	static style = `
:host {
	--bw-internal-bg: var(--bw-background, transparent);
	--bw-internal-fg: var(--bw-foreground, inherit);
	--bw-internal-border: var(--bw-border, 1px solid rgba(0,0,0,.1));
	--bw-internal-shadow-hsl: var(--bw-shadow-hsl, 0deg 0% 75%);

	--bw-internal-title-bg: rgba(0,0,0,.155);
	--bw-internal-title-fg: #000;

	--bw-internal-circle-1: var(--bw-internal-circle, var(--bw-circle-1, var(--bw-circle, #FF5F56)));
	--bw-internal-circle-2: var(--bw-internal-circle, var(--bw-circle-2, var(--bw-circle, #FFBD2E)));
	--bw-internal-circle-3: var(--bw-internal-circle, var(--bw-circle-3, var(--bw-circle, #27C93F)));
}
:host([${BrowserWindow.attrs.mode}="light"]) {
	--bw-internal-bg: var(--bw-background, #fff);
	--bw-internal-fg: var(--bw-foreground, #000);
}
:host([${BrowserWindow.attrs.mode}="dark"]) {
	--bw-internal-bg: var(--bw-background, #33373f);
	--bw-internal-fg: var(--bw-foreground, #fff);
	--bw-internal-shadow-hsl: var(--bw-shadow-hsl, 0deg 0% 25%);
	--bw-internal-title-bg: rgba(255,255,255,.063);
	--bw-internal-title-fg: #fff;
}

:host([${BrowserWindow.attrs.grayscale}]) {
	--bw-internal-circle: #e5e5e5;
}
:host([${BrowserWindow.attrs.mode}="dark"][${BrowserWindow.attrs.grayscale}]) {
	--bw-internal-circle: #49505e;
}

.window {
	display: flex;
	flex-direction: column;
	min-width: 100px;
	border-radius: .5em;
	border: var(--bw-internal-border);
	background: var(--bw-internal-bg);
	color: var(--bw-internal-fg);
}
:host([${BrowserWindow.attrs.shadow}]) .window {
	/* via https://www.joshwcomeau.com/shadow-palette/ */
	box-shadow: 0px 0.3px 0.5px hsl(var(--bw-internal-shadow-hsl) / 0),
		0.1px 2.4px 3.6px hsl(var(--bw-internal-shadow-hsl) / 0.07),
		0.1px 4.3px 6.5px hsl(var(--bw-internal-shadow-hsl) / 0.14),
		0.2px 6.7px 10.1px hsl(var(--bw-internal-shadow-hsl) / 0.22),
		0.3px 10.6px 15.9px hsl(var(--bw-internal-shadow-hsl) / 0.29),
		0.5px 16.5px 24.8px hsl(var(--bw-internal-shadow-hsl) / 0.36);
}
.hed {
	display: flex;
	align-items: center;
	gap: 0.375em; /* 6px /16 */
	padding: 0.5625em; /* 9px /16 */
}
.hed.windows {
	flex-direction: row-reverse;
}
.circle {
	display: inline-block;
	height: .75em;
	min-width: .75em;
	max-width: .75em;
	border-radius: .75em;
	background-color: #e5e5e5;
}
.hed.windows .controls {
	display: inline-block;
	height: 14px;
	width: 58px;
	background-color: transparent !important;
}
:host .circle:nth-child(1) {
	background-color: var(--bw-internal-circle-1);
}
:host .circle:nth-child(2) {
	background-color: var(--bw-internal-circle-2);
}
:host .circle:nth-child(3) {
	background-color: var(--bw-internal-circle-3);
}
.main {
	padding: .5em;
}
:host([${BrowserWindow.attrs.flush}]) .main {
	padding: 0;
	border-radius: 0 0 .5em .5em;
	overflow: hidden;
}
:host([${BrowserWindow.attrs.flush}]) .main > ::slotted(img:only-child),
:host([${BrowserWindow.attrs.flush}]) .main > ::slotted(iframe:only-child) {
	display: flex;
}
.title {
	display: flex;
	align-items: center;
	justify-content: center;
	flex-grow: 999;
	text-align: center;
	font-family: system-ui;
	font-size: 0.8125em; /* 13px /16 */
	background: var(--bw-internal-title-bg);
	border-radius: 0.3333333333333em; /* 3px /9 */
	margin: -4px 1em -4px 1em;
	text-decoration: none;
	line-height: 1.5;
	padding: 0 .5em;
	max-width: calc(100% - 54px - 3em);
}
.title,
.title:visited {
	color: var(--bw-internal-title-fg);
}
.title-text {
	display: inline-block;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}
::slotted(img[slot="icon"]),
.title-icon {
	width: 1.2em;
	height: 1.2em;
	object-fit: contain;
	margin-right: .5em;
}
`;

	static isValidUrl(url) {
		try {
			new URL(url);
			return true;
		} catch(e) {
			return false;
		}
	}

	setMode(isDarkMode) {
		this.setAttribute(BrowserWindow.attrs.mode, isDarkMode ? "dark" : "light");
	}

	connectedCallback() {
		if (!("replaceSync" in CSSStyleSheet.prototype) || this.shadowRoot) {
			return;
		}

		let shadowroot = this.attachShadow({ mode: "open" });

		let sheet = new CSSStyleSheet();
		sheet.replaceSync(BrowserWindow.style);
		shadowroot.adoptedStyleSheets = [sheet];

		let url = this.getAttribute(BrowserWindow.attrs.url) || "";
		let urlObj = url && BrowserWindow.isValidUrl(url) ? new URL(url) : {};
		let displayUrl = urlObj.hostname || "";

		let template = document.createElement("template");

		let iconHtml = "";
		if (this.hasAttribute(BrowserWindow.attrs.icon)) {
			let iconUrl = `https://v1.indieweb-avatar.11ty.dev/${encodeURIComponent(urlObj.origin || "")}/`;
			let iconAlt = `Favicon for ${urlObj.origin}`;

			iconHtml = `<img src="${iconUrl}" alt="${iconAlt}" width="32" height="32" loading="lazy" decoding="async" class="title-icon">`;
		}

		let prefersDarkMode = matchMedia("(prefers-color-scheme: dark)");
		if(!this.hasAttribute(BrowserWindow.attrs.mode)) {
			this.setMode(prefersDarkMode.matches);

			prefersDarkMode.addListener(e => {
				this.setMode(e.matches);
      });
		}

		let os = this.getAttribute(BrowserWindow.attrs.os) || "osx";
		let windowsIcons = `<svg width="58" height="14" viewBox="0 0 58 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 7H11" stroke="#878787" stroke-linecap="round" stroke-linejoin="round"></path><path d="M35 1H25C24.4477 1 24 1.44772 24 2V12C24 12.5523 24.4477 13 25 13H35C35.5523 13 36 12.5523 36 12V2C36 1.44772 35.5523 1 35 1Z" stroke="#878787"></path><path d="M47 2L57 12" stroke="#878787" stroke-linecap="round" stroke-linejoin="round"></path><path d="M47 12L57 2" stroke="#878787" stroke-linecap="round" stroke-linejoin="round"></path></svg>`;

		template.innerHTML = `<div class="window">
		<div class="hed ${os}">
			${
				os === "windows"
					? `<div class="controls">${windowsIcons}</div>`
					: `<div class="circle"></div>
						<div class="circle"></div>
						<div class="circle"></div>`
			}
			${
				url
					? `<a href="${url}" class="title"><slot name="icon">${iconHtml}</slot><span class="title-text">${displayUrl}</span></a>`
					: ""
			}
		</div>
		<div class="main"><slot></slot></div>
	</div>`;

		shadowroot.appendChild(template.content.cloneNode(true));
	}
}

if ("customElements" in window) {
	customElements.define(BrowserWindow.tagName, BrowserWindow);
}
