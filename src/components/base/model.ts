import {
	FormErrors,
	IAppItem,
	IAppModel,
	IContactInfo,
	IOrder,
	paymentMethod,
} from '../../types';
import { IEvents } from './events';

export type CatalogChangeEvent = {
	catalog: IAppItem[];
};

export abstract class Model<T> {
	constructor(data: Partial<T>, protected events: IEvents) {
		Object.assign(this, data);
	}

	emitChanges(event: string, payload?: object) {
		this.events.emit(event, payload ?? {});
	}
}

export class AppItem extends Model<IAppItem> {
	id: string;
	title: string;
	category: string;
	image: string;
	description: string;
	price: number;
}

export class AppModel extends Model<IAppModel> {
	catalog: IAppItem[];
	preview: string | null;
	basket: AppItem[] = [];
	order: IOrder = {
		payment: null,
		address: '',
		email: '',
		phone: '',
		items: [],
		total: 0,
	};
	formErrors: FormErrors = {};

	clearBasket() {
		this.basket = [];
		this.emitChanges('basket:update');
		this.order = {
			payment: null,
			address: '',
			email: '',
			phone: '',
			items: [],
			total: 0,
		};
	}

	setCatalog(items: IAppItem[]) {
		this.catalog = items.map((item) => new AppItem(item, this.events));
		this.emitChanges('items:changed', { catalog: this.catalog });
	}

	setPreview(item: AppItem) {
		this.preview = item.id;
		this.emitChanges('preview:changed', item);
	}

	addToBasket(item: AppItem) {
		this.basket.push(item);
		this.events.emit('basket:update');
	}

	checkItem(item: AppItem) {
		return this.basket.includes(item);
	}

	deleteFromBasket(item: AppItem) {
		const itemId = item.id;
		this.basket = this.basket.filter((item) => item.id !== itemId);
		this.events.emit('basket:update');
	}

	getFullPrice() {
		return this.basket.reduce((index, item) => {
			return index + Number(item.price);
		}, 0);
	}

	addPaymentMethod(method: paymentMethod) {
		this.order.payment = method;
		this.validateOrder();
	}

	addAddress(address: string) {
		this.order.address = address;
		this.validateOrder();
	}

	setContactInfoField(field: keyof IContactInfo, value: string) {
		this.order[field] = value;
		this.validateContactInfo();
	}

	setPrice() {
		this.order.total = this.getFullPrice();
	}

	setItems() {
		this.order.items = this.basket.map((item) => item.id) as [];
	}

	validateOrder() {
		const errors: typeof this.formErrors = {};
		if (!this.order.payment) {
			errors.payment = 'Необходимо указать способ оплаты';
		}
		if (!this.order.address) {
			errors.address = 'Необходимо указать адрес';
		}
		this.formErrors = errors;
		this.events.emit('orderFormErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	validateContactInfo() {
		const errors: typeof this.formErrors = {};
		if (!this.order.email) {
			errors.email = 'Необходимо указать email';
		}
		if (!this.order.phone) {
			errors.phone = 'Необходимо указать телефон';
		}
		this.formErrors = errors;
		this.events.emit('contactInfoFormErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}
}
