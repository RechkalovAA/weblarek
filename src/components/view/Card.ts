import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import { categoryMap, CDN_URL } from '../../utils/constants';

export interface CardState {
    id: string;
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
    protected categoryElement?: HTMLElement;
    protected imageElement?: HTMLImageElement;
    protected buttonElement?: HTMLButtonElement;
    protected descriptionElement?: HTMLElement;
    protected indexElement?: HTMLElement;

    constructor(
        protected readonly events: IEvents,
        container: HTMLElement,
    ) {
        super(container);
        this.titleElement = ensureElement<HTMLElement>('.card__title', this.container);
        this.priceElement = ensureElement<HTMLElement>('.card__price', this.container);
        this.categoryElement = this.container.querySelector<HTMLElement>('.card__category') ?? undefined;
        this.imageElement = this.container.querySelector<HTMLImageElement>('.card__image') ?? undefined;
        this.buttonElement = this.container.querySelector<HTMLButtonElement>('.card__button') ?? undefined;
        this.descriptionElement = this.container.querySelector<HTMLElement>('.card__text') ?? undefined;
        this.indexElement = this.container.querySelector<HTMLElement>('.basket__item-index') ?? undefined;
    }

    set title(value: string) {
        this.titleElement.textContent = value;
    }

    set price(value: number | null) {
        this.priceElement.textContent = value !== null ? `${value} синапсов` : 'Бесценно';
    }

    set category(value: string | undefined) {
        if (this.categoryElement && value) {
            this.categoryElement.textContent = value;
            Object.values(categoryMap).forEach(className => this.categoryElement!.classList.remove(className));
            // Добавляем класс только если категория существует в categoryMap
            // Если категории нет в мапе, элемент останется без стилевого класса
            if (categoryMap[value]) {
                this.categoryElement.classList.add(categoryMap[value]);
            }
        }
    }

    set image(src: string | undefined) {
        if (this.imageElement && src) {
            this.setImage(this.imageElement, `${CDN_URL}${src}`, this.titleElement.textContent || '');
        }
    }

    set description(value: string | undefined) {
        if (this.descriptionElement && value !== undefined) {
            this.descriptionElement.textContent = value;
        }
    }

    set index(value: number | undefined) {
        if (this.indexElement && value !== undefined) {
            this.indexElement.textContent = String(value);
        }
    }

    set buttonText(value: string | undefined) {
        if (this.buttonElement && value !== undefined) {
            this.buttonElement.textContent = value;
        }
    }

    set disabled(value: boolean | undefined) {
        if (this.buttonElement && value !== undefined) {
            this.buttonElement.disabled = value;
        }
    }
}

