import { IEvents } from '../base/Events';
import { Card, CardState } from './Card';
import { ensureElement } from '../../utils/utils';

interface BasketItemActions {
    onRemove?: () => void;
}

export class BasketItem extends Card<CardState> {
    private button: HTMLButtonElement;
    protected indexElement: HTMLElement;

    constructor(events: IEvents, container: HTMLElement, actions?: BasketItemActions) {
        super(events, container);
        this.indexElement = ensureElement<HTMLElement>('.basket__item-index', this.container);
        this.button = ensureElement<HTMLButtonElement>('.card__button', this.container);
        this.button.addEventListener('click', () => {
            actions?.onRemove?.();
        });
    }

    set index(value: number) {
        this.indexElement.textContent = String(value);
    }
}

