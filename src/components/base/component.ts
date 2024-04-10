export abstract class Component<T> {
	constructor(protected readonly container: HTMLElement) {}

	setText(element: HTMLElement, value: string) {
		if (element) {
			element.textContent = value;
		} else {
			console.log(`${element} not found`);
		}
	}

	setImage(element: HTMLImageElement, src: string) {
		if (element) {
			element.src = src;
		} else {
			console.log(`${element} not found`);
		}
	}

	setDisabled(element: HTMLElement, access: boolean) {
		if (access) element.setAttribute('disabled', 'disabled');
		else {
			element.removeAttribute('disabled');
		}
	}

	render(data?: Partial<T>): HTMLElement {
		Object.assign(this as object, data ?? {});
		return this.container;
	}
}
