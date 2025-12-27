import { IEvents } from '../base/Events';
import { Card, CardState } from './Card';
import { categoryMap, CDN_URL } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';

interface CatalogCardActions {
    onClick?: () => void;
}

export class CatalogCard extends Card<CardState> {
    protected categoryElement: HTMLElement;
    protected imageElement: HTMLImageElement;

    constructor(events: IEvents, container: HTMLElement, actions?: CatalogCardActions) {
        super(events, container);
        this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
        this.container.addEventListener('click', () => {
            actions?.onClick?.();
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
}

