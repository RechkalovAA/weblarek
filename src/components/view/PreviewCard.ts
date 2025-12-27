import { IEvents } from '../base/Events';
import { Card, CardState } from './Card';
import { categoryMap, CDN_URL } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';

interface PreviewCardState extends CardState {
    inBasket?: boolean;
    buttonText?: string;
    disabled?: boolean;
}

export class PreviewCard extends Card<PreviewCardState> {
    protected categoryElement: HTMLElement;
    protected imageElement: HTMLImageElement;
    protected descriptionElement: HTMLElement;
    protected buttonElement: HTMLButtonElement;

    constructor(events: IEvents, container: HTMLElement) {
        super(events, container);
        this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
        this.descriptionElement = ensureElement<HTMLElement>('.card__text', this.container);
        this.buttonElement = ensureElement<HTMLButtonElement>('.card__button', this.container);
            this.buttonElement.addEventListener('click', () => {
            this.events.emit('preview:click');
            });
        }

    set category(value: string) {
        this.categoryElement.textContent = value;
        Object.values(categoryMap).forEach(className => this.categoryElement.classList.remove(className));
        if (categoryMap[value]) {
            this.categoryElement.classList.add(categoryMap[value]);
        }
    }

    set image(src: string) {
        this.setImage(this.imageElement, `${CDN_URL}${src}`, this.titleElement.textContent || '');
    }

    set description(value: string) {
        this.descriptionElement.textContent = value;
    }

    set buttonText(value: string) {
        this.buttonElement.textContent = value;
    }

    set disabled(value: boolean) {
        this.buttonElement.disabled = value;
    }

    set inBasket(value: boolean) {
        this.buttonElement.classList.toggle('card__button_remove', Boolean(value));
    }
}

