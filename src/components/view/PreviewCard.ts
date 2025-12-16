import { IEvents } from '../base/Events';
import { Card, CardState } from './Card';

interface PreviewCardState extends CardState {
    inBasket?: boolean;
    buttonText?: string;
    disabled?: boolean;
}

interface PreviewCardActions {
    onClick?: () => void;
}

export class PreviewCard extends Card<PreviewCardState> {
    constructor(events: IEvents, container: HTMLElement, actions?: PreviewCardActions) {
        super(events, container);
        if (this.buttonElement) {
            this.buttonElement.addEventListener('click', () => {
                actions?.onClick?.();
            });
        }
    }

    render(data: PreviewCardState): HTMLElement {
        this.container.dataset.id = data.id;
        this.title = data.title;
        this.price = data.price;
        this.category = data.category;
        this.image = data.image;
        this.description = data.description;
        this.buttonText = data.buttonText;
        this.disabled = data.disabled;
        if (this.buttonElement && data.inBasket !== undefined) {
            this.buttonElement.classList.toggle('card__button_remove', Boolean(data.inBasket));
        }
        return this.container;
    }
}

