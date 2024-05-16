import AppIcon from "/js/components/AppIcon.js";
import AppWindow from "/js/components/AppWindow.js";

customElements.define("app-icon", AppIcon);
customElements.define("app-window", AppWindow);

document.querySelector("#login-form")?.addEventListener("submit", (event) => {
	console.log("[EVENTS] login form submitted");
	event.preventDefault();
	const $login = document.querySelector(".login");
	$login?.addEventListener(
		"animationend",
		(event) => {
			$login?.classList.add("deleted");
			$login?.classList.remove("deleting");
		},
		{ once: true }
	);
	$login?.classList.add("deleting");
	document.querySelector(".desktop")?.classList.remove("deleted");
});

document.addEventListener("click", (event) => {
	if (
		!event.target.closest(".start-menu") &&
		!event.target.closest("app-icon:not([app])")
	) {
		document.querySelector(".start-menu").classList.remove("visible");
	}
});

/**
 * The following is done not to bother the user with unwanted password manager
 * prompts.
 * It's a mock website so it's unnecessary to have a proper password field.
 */

let passwordTimeout = 0;
document
	.querySelector("#login-password")
	?.addEventListener("keypress", (event) => {
		const $field = event.currentTarget;
		$field.value = $field?.value.replace(/./g, "•");
		if (passwordTimeout) clearTimeout(passwordTimeout);
		passwordTimeout = setTimeout(() => {
			$field.value = $field?.value.replace(/./g, "•");
		}, 500);
	});

/**
 * Development code. to toggle off certain parts.
 */

const SKIP_LOGIN = true;
if (SKIP_LOGIN)
	document.querySelector("#login-form")?.dispatchEvent(new Event("submit"));
