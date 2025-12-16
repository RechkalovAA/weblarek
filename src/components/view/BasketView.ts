import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

interface BasketViewState {
    items: HTMLElement[];
    total: number;
}

export class BasketView extends Component<BasketViewState> {
    protected list: HTMLElement;
    protected totalElement: HTMLElement;
    protected button: HTMLButtonElement;
    protected emptyPlaceholder: HTMLElement;

    constructor(container: HTMLElement, private readonly events: IEvents) {
        super(container);
        this.list = ensureElement<HTMLElement>('.basket__list', this.container);
        this.totalElement = ensureElement<HTMLElement>('.basket__price', this.container);
        this.button = ensureElement<HTMLButtonElement>('.basket__button', this.container);
        this.emptyPlaceholder = document.createElement('p');
        this.emptyPlaceholder.textContent = 'Корзина пуста';
        this.emptyPlaceholder.classList.add('basket__empty');

        this.button.addEventListener('click', () => this.events.emit('basket:checkout'));
    }

    set items(value: HTMLElement[]) {
        if (value.length === 0) {
            this.list.replaceChildren(this.emptyPlaceholder);
        } else {
            this.list.replaceChildren(...value);
        }
        this.button.disabled = value.length === 0;
    }

    set total(value: number) {
        this.totalElement.textContent = `${value} синапсов`;
    }

    render(data: Partial<BasketViewState>): HTMLElement {
        if (data.items !== undefined) this.items = data.items;
        if (data.total !== undefined) this.total = data.total;
        return this.container;
    }
}

