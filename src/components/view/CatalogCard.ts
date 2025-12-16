import { IEvents } from '../base/Events';
import { Card, CardState } from './Card';

interface CatalogCardActions {
    onClick?: () => void;
}

export class CatalogCard extends Card<CardState> {
    constructor(events: IEvents, container: HTMLElement, actions?: CatalogCardActions) {
        super(events, container);
        this.container.addEventListener('click', () => {
            actions?.onClick?.();
        });
    }

    render(data: CardState): HTMLElement {
        this.container.dataset.id = data.id;
        this.title = data.title;
        this.price = data.price;
        this.category = data.category;
        this.image = data.image;
        return this.container;
    }
}

