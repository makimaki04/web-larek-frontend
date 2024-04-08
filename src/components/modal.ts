import { IEvents } from "./base/events";
import { Component } from "./base/component";
import { ensureElement } from "../utils/utils";

interface IModal {
    content: HTMLElement;
}

export class Modal extends Component<IModal> {
    protected _content: HTMLElement;
    protected _closeButton: HTMLButtonElement;

    constructor(readonly container: HTMLElement, protected events: IEvents) {
        super(container);
        this._content = ensureElement<HTMLElement>('.modal__content', container);
        this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);

        this._closeButton.addEventListener('click', this.close.bind(this));
        this.container.addEventListener('click', this.close.bind(this));
        this._content.addEventListener('click', evt => evt.stopPropagation());
    }

    open() {
        this.container.classList.add('modal_active');
        this.events.emit('modal:open');
    }

    close() {
        this.container.classList.remove('modal_active');
        this.events.emit('modal:close');
    }

    set content(element: HTMLElement) {
        this._content.replaceChildren(element);
    }

    render(data?: IModal): HTMLElement {
        super.render(data);
        this.open();
        return this.container;
    }
}