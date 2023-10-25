class BrowserWindow extends HTMLElement {
	static tagName = "browser-window";

	static attrs = {
		url: "url",
		iframe: "iframe",
		flush: "flush",
		shadow: "shadow",
		grayscale: "grayscale",
	};

	static style = `
.window {
	display: flex;
	flex-direction: column;
	min-width: 100px;
	border-radius: .5em;
	border: 1px solid rgba(0,0,0,.1);
}
:host([${BrowserWindow.attrs.shadow}]) .window {
	box-shadow: 0 10px 60px rgba(0,0,0,.2);
}
.hed {
	display: flex;
	gap: 6px;
	padding: 9px;
}
.circle {
	display: inline-block;
	height: 12px;
	min-width: 12px;
	max-width: 12px;
	border-radius: 12px;
	background-color: #e5e5e5;
}
:host(:not([${BrowserWindow.attrs.grayscale}])) .circle-red {
	background-color: #FF5F56;
}
:host(:not([${BrowserWindow.attrs.grayscale}])) .circle-yellow {
	background-color: #FFBD2E;
}
:host(:not([${BrowserWindow.attrs.grayscale}])) .circle-green {
	background-color: #27C93F;
}
.main {
	padding: .5em;
}
:host([${BrowserWindow.attrs.flush}]) .main,
:host([${BrowserWindow.attrs.iframe}]) .main {
	padding: 0;
}
.title {
	display: flex;
	align-items: center;
	justify-content: center;
	flex-grow: 999;
	text-align: center;
	font-family: system-ui;
	font-size: 0.8125em; /* 13px /16 */
	background: #d7d7d7;
	border-radius: 0.3333333333333em; /* 3px /9 */
	margin: -4px 1em -4px 1em;
	text-decoration: none;
	line-height: 1.5;
	padding: 0 .5em;
	max-width: calc(100% - 54px - 3em);
}
.title,
.title:visited {
	color: #000;
}
.title-icon {
	width: 1.2em;
	height: 1.2em;
	background-size: contain;
	margin-right: .5em;
}
.title-text {
	display: inline-block;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}
:host([${BrowserWindow.attrs.iframe}]) .main {
	display: flex;
}
.window-iframe {
	width: 100%;
	height: var(--browser-window-height, 200px);
	border: 0;
	border-radius: 0 0 .5em .5em;
	overflow: hidden;
}
`;

	connectedCallback() {
		if(!("replaceSync" in CSSStyleSheet.prototype)) {
			return;
		}

		let shadowroot = this.attachShadow({ mode: "open" });

		let sheet = new CSSStyleSheet();
		sheet.replaceSync(BrowserWindow.style);
		shadowroot.adoptedStyleSheets = [sheet];

		let url = this.getAttribute(BrowserWindow.attrs.url) || "";
		let displayUrl = url ? (new URL(url)).hostname : "";

		let contentHtml = "<slot></slot>";
		if(this.hasAttribute(BrowserWindow.attrs.iframe)) {
			contentHtml = `<iframe class="window-iframe" src="${url || "data:text/html;charset=utf-8,"}"></iframe>`;
		}

		let template = document.createElement("template");
		let iconUrl = `https://v1.indieweb-avatar.11ty.dev/${encodeURIComponent(url)}/`;
		template.innerHTML = `<div class="window">
		<div class="hed">
			<div class="circle circle-red"></div>
			<div class="circle circle-yellow"></div>
			<div class="circle circle-green"></div>
			${url ? `<a href="${url}" class="title"><img src="${iconUrl}" class="title-icon"><span class="title-text">${displayUrl}</span></a>` : ""}
		</div>
		<div class="main">
			${contentHtml}
		</div>
	</div>`;

		shadowroot.appendChild(template.content.cloneNode(true));
	}
}

if("customElements" in window) {
	customElements.define(BrowserWindow.tagName, BrowserWindow);
}
