import { IEvents } from '../base/Events';
import { Card, CardState } from './Card';
import { ensureElement } from '../../utils/utils';

interface BasketItemActions {
    onRemove?: () => void;
}

export class BasketItem extends Card<CardState> {
    private button: HTMLButtonElement;

    constructor(events: IEvents, container: HTMLElement, actions?: BasketItemActions) {
        super(events, container);
        this.button = ensureElement<HTMLButtonElement>('.card__button', this.container);
        this.button.addEventListener('click', () => {
            actions?.onRemove?.();
        });
    }

    render(data: CardState): HTMLElement {
        this.container.dataset.id = data.id;
        this.index = data.index;
        this.title = data.title;
        this.price = data.price;
        return this.container;
    }
}

