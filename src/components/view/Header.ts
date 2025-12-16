import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

interface HeaderState {
    counter: number;
}

export class Header extends Component<HeaderState> {
    protected counterElement: HTMLElement;

    constructor(container: HTMLElement, private readonly events: IEvents) {
        super(container);
        this.counterElement = ensureElement<HTMLElement>('.header__basket-counter', this.container);
        const basketButton = ensureElement<HTMLButtonElement>('.header__basket', this.container);
        basketButton.addEventListener('click', () => {
            this.events.emit('basket:open');
        });
    }

    set counter(value: number) {
        this.counterElement.textContent = String(value);
    }
}

