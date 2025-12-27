import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export interface CardState {
    title: string;
    price: number | null;
    category?: string;
    description?: string;
    image?: string;
    index?: number;
    buttonText?: string;
    disabled?: boolean;
}

export abstract class Card<T extends CardState> extends Component<T> {
    protected titleElement: HTMLElement;
    protected priceElement: HTMLElement;

    constructor(
        protected readonly events: IEvents,
        container: HTMLElement,
    ) {
        super(container);
        this.titleElement = ensureElement<HTMLElement>('.card__title', this.container);
        this.priceElement = ensureElement<HTMLElement>('.card__price', this.container);
    }

    set title(value: string) {
        this.titleElement.textContent = value;
    }

    set price(value: number | null) {
        this.priceElement.textContent = value !== null ? `${value} синапсов` : 'Бесценно';
    }
}

