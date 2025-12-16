import { Component } from '../base/Component';

interface GalleryState {
    items: HTMLElement[];
}

export class Gallery extends Component<GalleryState> {
    constructor(container: HTMLElement) {
        super(container);
    }

    set items(value: HTMLElement[]) {
        this.container.replaceChildren(...value);
    }

    render(data?: Partial<GalleryState>): HTMLElement {
        if (data?.items) this.items = data.items;
        return this.container;
    }
}

