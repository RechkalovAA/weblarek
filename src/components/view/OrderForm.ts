import { Form, FormState } from './Form';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import { TPayment } from '../../types/index';

interface OrderFormState extends FormState {
    payment?: TPayment | null;
    address?: string;
}

export class OrderForm extends Form<OrderFormState> {
    protected buttons: Record<TPayment, HTMLButtonElement>;
    protected addressInput: HTMLInputElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);
        this.buttons = {
            card: ensureElement<HTMLButtonElement>('button[name="card"]', this.container),
            cash: ensureElement<HTMLButtonElement>('button[name="cash"]', this.container),
        };
        this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', this.container);

        Object.entries(this.buttons).forEach(([method, button]) => {
            button.addEventListener('click', () => {
                this.setPayment(method as TPayment);
            });
        });

        this.addressInput.addEventListener('input', () => {
            this.events.emit('order:address', { address: this.addressInput.value });
        });

        this.container.addEventListener('submit', () => {
            this.events.emit('order:next');
        });
    }

    set payment(value: TPayment | null) {
        Object.entries(this.buttons).forEach(([key, button]) => {
            button.classList.toggle('button_alt-active', value === key);
        });
    }

    set address(value: string) {
            this.addressInput.value = value;
    }

    private setPayment(payment: TPayment) {
        this.events.emit('order:payment', { payment });
    }
}

