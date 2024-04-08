# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/styles/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```
<<<<<<< HEAD

#**Ключевые типы данных**
```javascript
//Описывает продукт
interface IAppItem {
    id: string,
    title: string,
    category: string,
    image: string,
    description: string,
    price: number | string;
}

//Информация о заказе
interface IOrder {
    payment: paymentMethod,
    address: string,
    email: string,
    phone: string,
    items: [],
    total: number
}

//описывает внутреннее состояние приложения
interface IAppModel {
    catalog: IAppItem[];
    preview: string | null;
    basket: AppItem[];
    order: IOrder
}

//карточка товара с подробным описанием
interface ICardPreview {
    number: number,
    title: string,
    price: number
}

//описывает карточку, наъодящуюся в корзине
interface IBasketCard {
    number: number,
    title: string,
    price: number
}

//описывает форму контактной информации пользоваптеля
interface IContactInfo {
    email: string;
    phone: string;
}
//метод оплаты
type paymentMethod = 'card' | 'cash'\

//описывает форму заказа
interface IOrderForm {
    paymentMethod: paymentMethod,
    address: string
}

//резултьтат заказа
interface IOrderResult {
    id: string;
}
```
**При разработке архитектуры приложения использовался паттерн MWP**

**Базовый код**

Класс `EventEmitter`
Реализует паттерн **Observer** и позволяет создавать кастомные события и обрабатывать их.
Позволяет создавать, прослушивать, отключать события.
Имеет методы:
`on - Устанавливает обработчик на событие
off - Снимает обработчик на событие
emit - Ининциализирует событие с данными
onAll - Устанавливает слушатель на все события
offAll - Сбрасываетвсе слушатели
2.Класс Model
Базовая модель для отличия от простых обьектов с данными.
Класс имеет метод:
emitChanges - вызывает event и при наличии payload вызывает с ним.`

Класс `AppModel`

Описиывает состояние данных приложени

Класс имеет такие методы:

`addToBasket` - Метод для добавления товара в корзину

`deleteFromBasket` - Метод для удаления товара из корзины

`clearBasket`- Метод для полной очистки корзины

`getBasketAmount` - Метод для получения количества товаров в корзине

`getTotalBasketPrice` - Метод для получения суммы цены всех товаров в корзине

`setItems` - Метод для добавления ID товаров в корзине в поле items для order

`setOrderField` - Метод для заполнения полей email, phone, address, payment в order

`validateContacts` - Валидация форм для окошка "контакты"

`validateOrder` - Валидация форм для окошка "заказ"

`refreshOrder` - Очистить order после покупки товаров

`setStore` - Метод для превращения данных, полученных с сервера в тип данных приложения

`resetSelected` - Метод для обновления поля selected во всех товарах после совершения покупки

`clearBasket` - Метод для полной очистки корзины

`setCatalog(items: IAppItem[])` - заполняет каталог товарамим

`setPreview(item: AppItem)` - устанавливает айди нужной в поле preview карточки для дальнейшего открытия в модальном окне

`addToBasket(item: AppItem)` - добавляет товар в корзину

`checkItem(item: AppItem)` - проверяет есть ли товар в корзине

`deleteFromBasket(item: AppItem)` - удаляет товар из корзины

`getFullPrice()`  - рассчитывает общую стоимость товаров в корзине

`addPaymentMethod(method: paymentMethod)`  - устанваливает метод оплаты в поле order

`addAddress(address: string)` - устанваливает адрес в поле order

`setContactInfoField(field: keyof IContactInfo, value: string)` - устанваливает контактную информацию в поле order

`setPrice()` - устанваливает общую стоисоть товаров в поле order

`setItems()` - заполняет выбранными товарами поле order

`validateOrder()` - валидация формы заказа

`validateContactInfo()` - валидация формы контактной информации

Класс `Api`

Класс предоставляет возможность для работы с API. 

Содержит методы:
`get(uri: string)` - метод для получения данных с сервера
 
`post(uri: string, data: object, method: ApiPostMethods = 'POST')` - метод для отправки данных на сервер 

Все методы класса вовзращают Promise.

##**Классы представления**

Класс `Component`
Является абстрактным классом представленяи компонента приложения. Содержит методы для управления состоянми компонента.

Класс имеет следующие методы:

`setText(element: HTMLElement, value: string)` - устанавливает текстовое содержимое

`setImage(element: HTMLImageElement, src: string)` - устанавливает изображение

`setDisabled(element: HTMLElement, access: boolean)` - блокирует взаимодействие с элементом

`render(data?: Partial<T>):HTMLElement` - Возвращает DOM-элемент

Класс `Form`

Базовый класс для компонентов с формами, является наследником абстрактного класс Component, а так же включает себя инструменты для контроля и валидации формы

Класс имеет такие методы:

`onInputChange` -инициализирует событие взаимодействия с формой

`isValid`- Сеттер для установки состояния кнопки отправки формы

`errors` - Сеттер для установки текста ошибок формы

`render` - Возвращает DOM-элемент формы

`onInputChange` - Метод для обработки изменений ввода формы

Класс `Page`

Класс является наследником абстрактного класс Component и нужен для отображения главной стрпанцы приложения

Класс имеет такие методы:

`counter` - Сеттер для счётчика товаров в корзине

`store` - Сеттер для карточек товаров на странице

`locked` - Сеттер для блокировки прокрутки страницы, при открытом модальном окне

Класс `Modal`

Класс является наследником абстрактного класс Component. Изменяет состояния модальных окон на странице.

Класс имеет такие методы:

`open()` - метод для открытия модального окна

`close()` - метод для закрытия модального окна

`set content` - Сеттер содержимого модального окна

`render` - возвращает DOM-элемент модального окна

Класс `Card`

Класс, описывающий карточку товара наследуется от абстрактного класса Component

Класс имеет такие методы:

`set title(value: string)` - Сеттер для установки заголовка товара

`get title()` - Геттер для получения заголовка товара

`set image(src: string)` - Сеттер для изображения товара

`set category(value: string)` - Сеттер категории товара

`set price(value: number)` - Сеттер стоимости товара

Класс `Basket`

Описывает корзину товаров, наследник асбтрактного класса Component

Класс имеет такие методы:

`price` - Сеттер общей цены товаров  в корзине

`list` - Сеттер списка товаров в корзине

Класс `Order`

Описывает форму заказа товара, является наследником класса Form

Класс имеет такие методы:

`toggleClass(name: string)` - метод для изменения состояния нажатой кнопки

`set address(value: string)` - сеттер для поля ввода адреса

Класс `ContactInfoForm`

Класс, реализующий форму ввода контактных данных.

Имеет следующие методы:
`set email(value: string)` - Сеттер для email

`set phone(value: string)` - Сеттер для номера телефона

Класс `Success`

Экземпляр этого класса описывает окно успешной покупи.

