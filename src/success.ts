import { Component } from "./components/base/component";
import { ensureElement } from "./utils/utils";

interface ISuccess {
    total: number;
}

interface ISuccessActions {
    onClick: () => void;
}

export class Success extends Component<ISuccess> {
    protected _close: HTMLElement;
    protected _price: HTMLElement;

    constructor(protected template: HTMLElement, price: number, actions: ISuccessActions) {
        super(template);

        this._close = ensureElement<HTMLElement>('.order-success__close', this.template);
        this._price = ensureElement<HTMLElement>('.order-success__description', this.template);
        this.setText(this._price, `Списано ${price} синапсов`) ;

        if (actions?.onClick) {
            this._close.addEventListener('click', actions.onClick);
        }
    }
}