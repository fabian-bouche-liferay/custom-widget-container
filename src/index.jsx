import React from 'react';
import { createRoot } from 'react-dom/client';
import CustomWidgetContainer from './CustomWidgetContainer';

class CustomWidgetContainerWebComponent extends HTMLElement {
    constructor() {
        super();
        this._reactRoot = null;
        this._rootInstance = null;
    }

    connectedCallback() {
        // Créer le Shadow DOM attaché à cet élément
        const shadow = this.attachShadow({ mode: 'open' });

        // Ajouter un conteneur React dans le Shadow DOM
        if (!this.shadowRoot.querySelector('.react-root')) {
            const reactRoot = document.createElement('div');
            reactRoot.className = 'react-root';
            shadow.appendChild(reactRoot);
        }

        // Copier tous les <link> du parent dans le Shadow DOM
        const parentLinks = document.querySelectorAll('link[rel="stylesheet"]'); // Sélectionner tous les liens de style du parent
        parentLinks.forEach((link) => {
            const shadowLink = document.createElement('link');
            shadowLink.rel = 'stylesheet';
            shadowLink.href = link.href; // Copier l'URL du href du lien parent
            shadow.appendChild(shadowLink); // Ajouter le lien dans le Shadow DOM
        });

        // Copier les styles du parent dans le Shadow DOM (si des <style> sont présents)
        const parentStyles = document.querySelectorAll('style');
        parentStyles.forEach((style) => {
            const shadowStyle = document.createElement('style');
            shadowStyle.textContent = style.textContent; // Copier le contenu des styles
            shadow.appendChild(shadowStyle); // Ajouter les styles dans le Shadow DOM
        });

        // Rendre le composant React
        this._renderReact();
    }

    disconnectedCallback() {
        if (this._rootInstance) {
            this._rootInstance.unmount();
            this._rootInstance = null;
        }
    }

    _getWidgetsFromSlots() {
        const widgetElements = document.querySelectorAll('div[slot]');
        return Array.from(widgetElements).map((element) => {
            const widgetId = element.getAttribute('slot');
            const labelElement = element.querySelector(`[data-label-for="${widgetId}"]`);
            const label = labelElement ? labelElement.textContent : 'No label';

            return {
                widgetId: widgetId,
                label: label,
            };
        });
    }

    _renderReact() {
        const reactRoot = this.shadowRoot.querySelector('.react-root');
        if (reactRoot) {
            if (!this._rootInstance) {
                this._rootInstance = createRoot(reactRoot);
            }

            const widgets = this._getWidgetsFromSlots(); // Récupérer les widgets dynamiquement

            this._rootInstance.render(
                <CustomWidgetContainer availableWidgets={widgets} numberOfWidgets={this.getAttribute("data-number-of-widgets")} />
            );
        }
    }
}

const CUSTOM_WIDGET_CONTAINER_ELEMENT_ID = 'custom-widget-container';

if (!customElements.get(CUSTOM_WIDGET_CONTAINER_ELEMENT_ID)) {
    customElements.define(CUSTOM_WIDGET_CONTAINER_ELEMENT_ID, CustomWidgetContainerWebComponent);
}
