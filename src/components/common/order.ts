import { Form } from "./form";
import { IEvents } from "../base/events";
import { IOrderForm } from "../../types";
import { ensureAllElements } from "../../utils/utils";

export class Order extends Form<IOrderForm> {
    protected _paymentBtns: HTMLButtonElement[];

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        this._paymentBtns = ensureAllElements<HTMLButtonElement>('.button_alt', container);
        
        this._paymentBtns.forEach(btn => {
            btn.addEventListener('click', evt => {
                const button = evt.target as HTMLButtonElement;
                this.toggleClass(button.name);
                this.events.emit('paymentMethod:change', {paymentMethod: button.name});
            })
        })
    }

    toggleClass(name: string) {
        this._paymentBtns.forEach(btn => {
            if (btn.name == name) {
                btn.classList.add('button_alt-active')
            } else {
                btn.classList.remove('button_alt-active');
            }
        })
    }

    set address(value: string) {
        (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
    }
}