// @flow

import React, {Component} from 'react';
import {render, unmountComponentAtNode} from 'react-dom';
import invariant from 'invariant';
import noop from 'lodash/noop';
import type {ModalProps} from './types/ModalProps';
import {activeModals} from './utils';
import modalComponentHOC from './HOC';

import './modal.styl';

const POSITION_FIXED = 'fixed';
const ESC_CODE = 27;

export default class Modal extends Component {
    static defaultProps = {
        parentSelector: 'body',
        isOpen: false,
        onRequestClose: noop,
        className: '',
        appSelector: 'body [data-reactroot]',
        style: {},
        overlayProps: {}
    };

    props: ModalProps;

    componentWillMount() {
        document.addEventListener('keydown', this.onKeyDown);
    }

    componentDidMount() {
        this.component = modalComponentHOC(onChange => (this.updateComponent = onChange), this.props);
        this.root = this.getRoot();
        this.renderContainer();

        activeModals.pushIfActive(this);
    }

    componentWillUpdate({isOpen: nextIsOpen}: ModalProps) {
        const {isOpen} = this.props;
        if(isOpen !== nextIsOpen) {
            this.toggleAppFixed(nextIsOpen);

            activeModals.toggle(this)
        }
    }

    toggleAppFixed(isOpen: boolean) {
        const {appSelector} = this.props;
        const app = document.querySelector(appSelector);
        const {body} = document;
        invariant(body, 'body should be initialized');
        invariant(app, 'incorrect app selector');
        if (isOpen) {
            const appStyles = getComputedStyle(app);
            this.oldPosition = appStyles.position;
            this.oldScrollTop = Math.abs(parseInt(appStyles.top, 10)) || body.scrollTop;
            app.style.position = POSITION_FIXED;
            app.style.top = `-${this.oldScrollTop}px`;
        } else {
            const {oldPosition, oldScrollTop} = this;
            if (oldPosition !== undefined && oldScrollTop !== undefined) {
                app.style.position = oldPosition;
                body.scrollTop = oldScrollTop;
                if (oldPosition !== POSITION_FIXED) {
                    app.style.top = 'auto';
                }
            }
        }
    }

    componentDidUpdate() {
        this.updateComponent(this.props);
    }

    componentWillUnmount() {
        const {root} = this;
        unmountComponentAtNode(root);
        const parent = root.parentNode;
        parent.removeChild(root);

        document.removeEventListener('keydown', this.onKeyDown);
        activeModals.pop(this)
    }

    onKeyDown = (e: KeyboardEvent) => {
        const {isOpen} = this.props;
        if (e.keyCode === ESC_CODE && isOpen) {
            const {onRequestClose} = this.props;
            if (activeModals.isOnTop(this)) {
                onRequestClose(e);
            }
        }
    };

    getRoot() {
        const {parentSelector} = this.props;
        const parent = document.querySelector(parentSelector);
        invariant(parent, 'incorrect parent selector');
        const container = document.createElement('div');
        parent.appendChild(container);
        return container;
    }

    component: any;

    root: any;

    oldPosition: string;

    oldScrollTop: number;

    updateComponent: Function;

    renderContainer() {
        const Container = this.component;
        render(
            <Container />,
            this.root
        );
    }

    render() {
        return null;
    }
}
