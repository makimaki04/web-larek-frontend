import { IEvents } from "./base/events";
import { Component } from "./base/component";
import { ensureElement } from "../utils/utils";

interface Ipage {

}

export class Page extends Component<Ipage>{
    protected _gallery: HTMLElement;
    protected _basket: HTMLButtonElement;
    protected _wrapper: HTMLElement;
    protected _counter: HTMLSpanElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this._gallery = ensureElement<HTMLElement>('.gallery');
        this._basket = ensureElement<HTMLButtonElement>('.header__basket');
        this._wrapper = ensureElement<HTMLElement>('.page__wrapper');
        this._counter = ensureElement<HTMLSpanElement>('.header__basket-counter');
        this._basket.addEventListener('click', () => {
            this.events.emit('basket:open');
        })
    }

    set counter(value: number) {
        this.setText(this._counter, String(value));
    }

    set catalog(items: HTMLElement[]) {
        this._gallery.replaceChildren(...items);
    }

    set locked(value: boolean) {
        if (value) {
            this._wrapper.classList.add('page__wrapper_locked');
        } else {
            this._wrapper.classList.remove('page__wrapper_locked');
        }
    }
}