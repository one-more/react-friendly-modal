// @flow

import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {render, unmountComponentAtNode} from 'react-dom';
import invariant from 'invariant';
import noop from 'lodash/noop';
import modalComponentHOC from './HOC';

import './modal.styl';

const POSITION_FIXED = 'fixed';

export default class Modal extends PureComponent {
    static propTypes = {
        parentSelector: PropTypes.string,
        isOpen: PropTypes.bool,
        onRequestClose: PropTypes.func,
        className: PropTypes.string,
        appSelector: PropTypes.string,
        style: PropTypes.object,
        overlayProps: PropTypes.object
    };

    static defaultProps = {
        parentSelector: 'body',
        isOpen: false,
        onRequestClose: noop,
        className: '',
        appSelector: 'body [data-reactroot]',
        style: {},
        overlayProps: {}
    };

    componentDidMount() {
        this.component = modalComponentHOC(onChange => (this.updateComponent = onChange), this.props);
        this.root = this.getRoot();
        this.renderContainer();
    }

    shouldComponentUpdate(nextProps: Object) {
        return this.props.isOpen !== nextProps.isOpen;
    }

    componentWillUpdate(nextProps: Object) {
        const {appSelector} = this.props;
        const app = document.querySelector(appSelector);
        const {isOpen} = nextProps;
        const {body} = document;
        invariant(body, 'body should be initialized');
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
    }

    getRoot() {
        const {parentSelector} = this.props;
        const parent = document.querySelector(parentSelector);
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
