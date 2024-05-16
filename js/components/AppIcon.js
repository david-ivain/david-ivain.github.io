export default class AppIcon extends HTMLElement {
	constructor() {
		super();
	}

	connectedCallback() {
		this.innerHTML = `
		<div class="app">
			<button type="button" class="app__button">
				<img
					src="${this.getAttribute("icon")}"
					alt="${this.innerText}"
					class="app__icon"
					width="72px" height="72px">
					<label class="app__label fs-sm">${this.innerHTML}</label>
			</button>
		</div>
		`;

		this.querySelector(".app__button")?.addEventListener("click", () => {
			if (!this.getAttribute("app")) {
				document
					.querySelector(".start-menu")
					.classList.toggle("visible");
				return;
			}
			const $alreadyOpenedWindow = document.querySelector(
				`app-window[app="${this.getAttribute("app")}"]`
			);
			if ($alreadyOpenedWindow) {
				$alreadyOpenedWindow.classList.remove("minimized");
				return;
			}
			fetch(this.getAttribute("app"))
				.then((response) => response.text())
				.then((app) => {
					const tmp = document.createElement("template");
					tmp.innerHTML = `<app-window window-title="${
						this.innerText
					}" app=${this.getAttribute("app")}>${app}</app-window>`;
					document
						.querySelector(".desktop__windows")
						?.appendChild(tmp.content.cloneNode(true));
				});
		});
	}
}
