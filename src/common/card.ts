import { Component } from "../components/base/component";
import { ensureElement } from "../utils/utils";
import { IAppItem, IBasketCard } from "../types";
import { IEvents } from "../components/base/events";

interface ICardAction {
    onClick: (event: MouseEvent) => void;
}

export class Card extends Component<IAppItem>{
    protected _title: HTMLElement;
    protected _image: HTMLImageElement;
    protected _category: HTMLElement;
    protected _price: HTMLElement;

    constructor(template: HTMLTemplateElement, actions?: ICardAction) {
        super(template);
        this._title = ensureElement<HTMLElement>('.card__title', template);
        this._image = ensureElement<HTMLImageElement>('.card__image', template);
        this._category = ensureElement<HTMLElement>('.card__category', template);
        this._price = ensureElement<HTMLElement>('.card__price', template);

        if (actions?.onClick) {
            template.addEventListener('click', actions.onClick);
        }
    }

    set title(value: string) {
        this.setText(this._title, value)
    }

    get title() {
        return this._title.textContent || ''
    }

    set image(src: string) {
        this.setImage(this._image, src);
        this._image.alt = this.title;
    }
    
    set category(value: string) {
        this._category.textContent = value;
    }

    set price(value: number) {
        this._price.textContent = String(value);
        if (value === null) {
            this._price.textContent = "Бесценно";
        }
    }
}

export class CardPreview extends Card {
    protected _cardButton: HTMLButtonElement;
    protected _description: HTMLElement;

    constructor(template: HTMLTemplateElement, actions?: ICardAction) {
        super(template);

        this._cardButton = ensureElement<HTMLButtonElement>('.card__button', template);
        this._description = ensureElement<HTMLElement>('.card__text', template);

        if(actions?.onClick) {
            this._cardButton.addEventListener('click', actions.onClick);
        }
    }
    
    blockButton() {
        this.setDisabled(this._cardButton, true);
    }

    set description(value: string) {
        this.setText(this._description, value);
    }

    set button(value: string) {
        this.setText(this._cardButton, value);
    }
}

export class BasketCardItem extends Component<IBasketCard> {
    protected _title: HTMLElement;
    protected _price: HTMLElement;
    protected _deleteButton: HTMLElement;
    protected _number: HTMLElement;
    
    constructor(template: HTMLTemplateElement, actions?: ICardAction) {
        super(template);

        this._title = ensureElement<HTMLElement>('.card__title', template);
        this._price = ensureElement<HTMLElement>('.card__price', template);
        this._number = ensureElement<HTMLElement>('.basket__item-index', template)
        this._deleteButton= ensureElement<HTMLElement>('.basket__item-delete', template);

        if(actions?.onClick) {
            this._deleteButton.addEventListener('click', actions.onClick);
        }
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    set price(value: number) {
        this.setText(this._price, String(value));
    }

    set number(value: number) {
        this.setText(this._number, String(value));
    }
}