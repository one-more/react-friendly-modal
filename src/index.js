// @flow

import React, {Component} from 'react';
import {render, unmountComponentAtNode} from 'react-dom';
import invariant from 'invariant';
import noop from 'lodash/noop';
import modalComponentHOC from './HOC';
import {activeModals} from './utils';
import type {ModalProps} from './types/ModalProps';

const ESC_CODE = 27;

export default class Modal extends Component {
    static defaultProps = {
        parentSelector: 'body',
        isOpen: false,
        className: '',
        animation: '',
        appSelector: 'body [data-reactroot]',
        style: {},
        onRequestClose: noop,
        styleName: '',
        isAnimated: false
    };

    componentWillMount() {
        document.addEventListener('keydown', this.onKeyDown);
    }

    componentDidMount() {
        const {props} = this;
        const initialProps = {
            ...props,
            styleName: props.className,
            className: ''
        };
        this.component = modalComponentHOC(onChange => (this.updateComponent = onChange), initialProps);
        this.root = this.getRoot();
        this.renderContainer();
        activeModals.pushIfActive(this);
    }

    componentWillUpdate(nextProps: Object) {
        const {isOpen} = this.props;
        const {isOpen: nextIsOPen} = nextProps;
        if (isOpen !== nextIsOPen) {
            this.toggleAppFixed(nextIsOPen);
            activeModals.toggle(this);
        }
    }

    componentDidUpdate() {
        this.updateComponent(this.props);
    }

    componentWillUnmount() {
        const {root} = this;
        const parent = root.parentNode;
        const {isOpen} = this.props;
        unmountComponentAtNode(root);
        parent.removeChild(root);

        document.removeEventListener('keydown', this.onKeyDown);
        activeModals.pop(this);
        if (isOpen) {
            this.toggleAppFixed(false);
        }
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
        invariant(parent, 'invalid parent selector');
        const container = document.createElement('div');
        parent.appendChild(container);
        return container;
    }

    props: ModalProps;

    toggleAppFixed(isOpen: boolean) {
        const {appSelector} = this.props;
        const app = document.querySelector(appSelector);
        invariant(app, 'invalid app selector');
        const {body} = document;
        invariant(body, 'body should be initialized');
        if (isOpen) {
            const appStyles = getComputedStyle(app);
            this.oldPosition = appStyles.position;
            this.oldScrollTop = Math.abs(parseInt(appStyles.top, 10)) || body.scrollTop;
            app.style.position = 'fixed';
            app.style.left = '0';
            app.style.right = '0';
            app.style.top = `-${this.oldScrollTop}px`;
        } else {
            const {oldPosition, oldScrollTop} = this;
            if (oldPosition !== undefined && oldScrollTop !== undefined) {
                app.style.position = oldPosition;
                app.style.left = 'auto';
                app.style.right = 'auto';
                body.scrollTop = oldScrollTop;
            }
        }
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

export {default as ContextTypes} from './types/contextTypes';
