import { Form, FormState } from './Form';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

interface ContactsFormState extends FormState {
    email?: string;
    phone?: string;
}

export class ContactsForm extends Form<ContactsFormState> {
    protected emailInput: HTMLInputElement;
    protected phoneInput: HTMLInputElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);
        this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
        this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);

        this.emailInput.addEventListener('input', () => {
            this.events.emit('order:contacts', { email: this.emailInput.value, phone: this.phoneInput.value });
        });
        this.phoneInput.addEventListener('input', () => {
            this.events.emit('order:contacts', { email: this.emailInput.value, phone: this.phoneInput.value });
        });

        this.container.addEventListener('submit', () => {
            this.events.emit('order:submit');
        });
    }

    set email(value: string | undefined) {
        if (value !== undefined) {
            this.emailInput.value = value;
        }
    }

    set phone(value: string | undefined) {
        if (value !== undefined) {
            this.phoneInput.value = value;
        }
    }
}

