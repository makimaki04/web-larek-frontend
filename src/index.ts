import { ExternalModule } from 'webpack';
import { Basket } from './common/basket';
import { BasketCardItem, Card, CardPreview } from './common/card';
import { Modal } from './common/modal';
import { Page } from './common/page';
import { WebLarekAPI } from './webLarekAPI';
import { EventEmitter } from './components/base/events';
import { AppModel, CatalogChangeEvent, AppItem } from './components/base/model';
import './scss/styles.scss';
import {
	IAppItem,
	IContactInfo as IContactInfo,
	IOrderForm,
	paymentMethod,
} from './types';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureAllElements, ensureElement } from './utils/utils';
import { Order } from './order';
import { ContactInfoForm as ContactInfoForm } from './contactInfo';
import { Success } from './success';

const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const basketItem = ensureElement<HTMLTemplateElement>('#card-basket');
const cardPreview = ensureElement<HTMLTemplateElement>('#card-preview');
const cardTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactInfoTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const succsessTemplate = ensureElement<HTMLTemplateElement>('#success');

const events = new EventEmitter();
const api = new WebLarekAPI(CDN_URL, API_URL);
const page = new Page(document.body, events);
const appModel = new AppModel({}, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new Order(cloneTemplate(orderTemplate), events);
const contactInfo = new ContactInfoForm(
	cloneTemplate(contactInfoTemplate),
	events
);

events.on<CatalogChangeEvent>('items:changed', () => {
	page.catalog = appModel.catalog.map((item) => {
		const card = new Card(cloneTemplate(cardTemplate), {
			onClick: () => {
				events.emit('card:select', item);
			},
		});
		return card.render({
			title: item.title,
			image: item.image,
			category: item.category,
			price: item.price,
		});
	});
});

events.on('card:select', (item: AppItem) => {
	appModel.setPreview(item);
});

events.on('preview:changed', (item: AppItem) => {
	const showItem = (item: AppItem) => {
		const card = new CardPreview(cloneTemplate(cardPreview), {
			onClick: () => {
				events.emit('basket:add', item);
				modal.close();
			},
		});

		modal.render({
			content: card.render({
				title: item.title,
				image: item.image,
				category: item.category,
				price: item.price,
				description: item.description,
			}),
		});

		if (item.price === null || appModel.checkItem(item)) {
			card.blockButton();
		}
	};

	if (item) {
		api
			.getItem(item.id)
			.then((result) => {
				item.description = result.description;
				showItem(item);
			})
			.catch((err) => {
				console.log(err);
			});
	} else {
		modal.close();
	}
});

events.on('modal:open', () => {
	page.locked = true;
});

events.on('modal:close', () => {
	page.locked = false;
	appModel.addPaymentMethod(null);
});

events.on('basket:add', (item: AppItem) => {
	appModel.addToBasket(item);
	console.log(appModel.basket);
});

events.on('basket:update', () => {
	const basketItems = appModel.basket;

	basket.items = basketItems.map((item, index) => {
		const basketCard = new BasketCardItem(cloneTemplate(basketItem), {
			onClick: () => {
				events.emit('item:delete', item);
			},
		});

		basketCard.number = index + 1;

		return basketCard.render({
			title: item.title,
			price: item.price,
		});
	});

	basket.price = appModel.getFullPrice();
	page.counter = basketItems.length;
});

events.on('basket:open', () => {
	modal.render({
		content: basket.render(),
	});
});

events.on('item:delete', (item: AppItem) => {
	appModel.deleteFromBasket(item);
});

events.on('order:open', () => {
	modal.render({
		content: order.render({
			paymentMethod: null,
			address: '',
			valid: false,
			errors: [],
		}),
	});

	order.toggleClass('null');
});

events.on(
	'paymentMethod:change',
	(method: { paymentMethod: paymentMethod }) => {
		appModel.addPaymentMethod(method.paymentMethod);
	}
);

events.on('order.address:change', (email: { value: string }) => {
	appModel.addAddress(email.value);
});

events.on('orderFormErrors:change', (errors: Partial<IOrderForm>) => {
	const { paymentMethod, address } = errors;
	order.valid = !paymentMethod && !address;
	order.errors = Object.values({ paymentMethod, address })
		.filter((i) => !!i)
		.join('; ');
});

events.on('order:submit', () => {
	modal.render({
		content: contactInfo.render({
			email: '',
			phone: '',
			valid: false,
			errors: [],
		}),
	});
});

events.on(
	/^contacts\..*:change/,
	(data: { field: keyof IContactInfo; value: string }) => {
		appModel.setContactInfoField(data.field, data.value);
	}
);

events.on('contactInfoFormErrors:change', (errors: Partial<IContactInfo>) => {
	const { email, phone } = errors;
	contactInfo.valid = !email && !phone;
	contactInfo.errors = Object.values({ email, phone })
		.filter((i) => !!i)
		.join('; ');
});

events.on('contacts:submit', () => {
	appModel.setPrice();
	appModel.setItems();

	api
		.orderItems(appModel.order)
		.then((data) => {
			const succsess = new Success(
				cloneTemplate(succsessTemplate),
				appModel.order.total,
				{
					onClick: () => {
						appModel.clearBasket();
						modal.close();
					},
				}
			);
			modal.render({
				content: succsess.render({}),
			});
		})
		.catch((err) => {
			console.log(err);
		});
});

api.getItemList().then(appModel.setCatalog.bind(appModel));
