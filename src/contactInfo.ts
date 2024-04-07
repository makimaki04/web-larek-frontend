import { Form } from "./common/form";
import { IEvents } from "./components/base/events";
import { IContactInfo } from "./types";

export class ContactInfoForm extends Form<IContactInfo> {
    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
    }

    set email(value: string) {
        (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
    }

    set phone(value: string) {
        (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
    }
}