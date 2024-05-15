export default class AppWindow extends HTMLElement {
	position = {
		x: 0,
		y: 0,
	};
	offsetMouse = {
		x: 0,
		y: 0,
	};
	isMoving = false;

	constructor() {
		super();
	}

	connectedCallback() {
		this.innerHTML = `
			<div class="window__handle">
				<div class="window__title">${this.getAttribute("window-title")}</div>
				<div class="window__controls">
					<button
					type="button"
					class="window__control"
					data-variant="minimize">
						<span>Minimize</span>
					</button>
					<button
					type="button"
					class="window__control"
					data-variant="maximize">
						<span>Maximize</span>
					</button>
					<button
						type="button"
						class="window__control"
						data-variant="close">
						<span>close</span>
					</button>
				</div>
			</div>
			<div class="window__content">
				${this.innerHTML}
			</div>
		`;

		const $maybeCloseButton = this.querySelector(
			'.window__control[data-variant="close"]'
		);
		const $maybeMinimizeButton = this.querySelector(
			'.window__control[data-variant="minimize"]'
		);
		const $maybeMaximizeButton = this.querySelector(
			'.window__control[data-variant="maximize"]'
		);
		const $maybeHandle = this.querySelector(".window__title");

		$maybeCloseButton?.addEventListener("click", () => this.remove());
		$maybeMaximizeButton?.addEventListener("click", () => {
			this.classList.toggle("maximized");
		});
		$maybeMinimizeButton?.addEventListener("click", () => {
			this.classList.toggle("minimized");
		});
		$maybeHandle?.addEventListener("mousedown", this._handleStartMoving);
		$maybeHandle?.addEventListener("dblclick", () => {
			this.classList.toggle("maximized");
		});
	}

	/** @type {(event: MouseEvent) => void} */
	_handleStartMoving = (event) => {
		if (this.classList.contains("maximized")) return;
		this.position = {
			x: this.getBoundingClientRect().left,
			y: this.getBoundingClientRect().top,
		};
		this.offsetMouse = {
			x: event.clientX - this.position.x,
			y: event.clientY - this.position.y,
		};
		this.isMoving = true;
		this.classList.add("moving");
		document.addEventListener("mousemove", this._handleDuringMoving);
		document.addEventListener("mouseup", this._handleEndMoving, {
			once: true,
		});
		this._moveWindow();
	};

	_handleEndMoving = () => {
		this.classList.remove("moving");
		this.isMoving = false;
		document.removeEventListener("mousemove", this._handleDuringMoving);
	};

	/** @type {(event: MouseEvent) => void} */
	_handleDuringMoving = (event) => {
		this.position = {
			x: event.clientX - this.offsetMouse.x,
			y: event.clientY - this.offsetMouse.y,
		};
	};

	_moveWindow = () => {
		this.style.left = this.position.x + "px";
		this.style.top = this.position.y + "px";
		if (this.isMoving) requestAnimationFrame(this._moveWindow);
	};
}
