export interface IAppItem {
	id: string;
	title: string;
	category: string;
	image: string;
	description: string;
	price: number | string;
}

export interface IOrder {
	payment: paymentMethod;
	address: string;
	email: string;
	phone: string;
	items: [];
	total: number;
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export interface IAppModel {
	catalog: IAppItem[];
	preview: string | null;
	basket: IAppItem[];
	order: IOrder;
}

export interface ICardPreview {
	number: number;
	title: string;
	price: number;
}

export interface IBasketCard {
	number: number;
	title: string;
	price: number | string;
}

export interface IContactInfo {
	email: string;
	phone: string;
}

export type paymentMethod = 'card' | 'cash';

export interface IOrderForm {
	payment: paymentMethod;
	address: string;
}

export interface IOrderResult {
	id: string;
}
