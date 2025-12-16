import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

interface OrderSuccessState {
    total: number;
}

export class OrderSuccess extends Component<OrderSuccessState> {
    protected description: HTMLElement;
    protected closeButton: HTMLButtonElement;

    constructor(container: HTMLElement, private readonly events: IEvents) {
        super(container);
        this.description = ensureElement<HTMLElement>('.order-success__description', this.container);
        this.closeButton = ensureElement<HTMLButtonElement>('.order-success__close', this.container);
        this.closeButton.addEventListener('click', () => {
            this.events.emit('order:success-close');
        });
    }

    set total(value: number) {
        this.description.textContent = `Списано ${value} синапсов`;
    }
}

