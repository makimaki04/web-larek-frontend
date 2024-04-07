import { EventEmitter, IEvents } from "../components/base/events";
import { AppItem } from "../components/base/model";
import { Component } from "../components/base/component";
import { createElement, ensureElement } from "../utils/utils";

interface IBasket {
    itemList: HTMLElement[],
}

export class Basket extends Component<IBasket> {
    protected _list: HTMLElement;
    protected _basketButton: HTMLButtonElement;
    protected _price: HTMLElement;
    constructor(template: HTMLTemplateElement, events: EventEmitter) {
        super(template);
        
        this._list = this.container.querySelector('.basket__list');
        this._basketButton = this.container.querySelector('.button');
        this._price = this.container.querySelector('.basket__price');

        if(this._basketButton) {
            this._basketButton.addEventListener('click', () => {
                events.emit('order:open');
            })

        }

        this.items = [];
    }

    set items(items: HTMLElement[]) {
        if (items.length) {
            this._list.replaceChildren(...items);
            this.setDisabled(this._basketButton, false);
         }else {
            this._list.replaceChildren(createElement<HTMLParagraphElement>('p', {
                textContent: 'Корзина пуста'
            }));
            this.setDisabled(this._basketButton, true);
        }
    }

    set price(price: number) {
        this.setText(this._price, String(price) + ' синапсов');
    }
}
