import { IEvents } from '../base/Events';
import { Card, CardState } from './Card';

interface BasketItemActions {
    onRemove?: () => void;
}

export class BasketItem extends Card<CardState> {
    constructor(events: IEvents, container: HTMLElement, actions?: BasketItemActions) {
        super(events, container);
        this.buttonElement?.addEventListener('click', () => {
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

