import React from 'react';
import {mount} from 'enzyme';
import DOM from 'react-dom';
import Modal from './index';

jest.mock('./HOC', () => (...args) => {
    expect(args).toEqual([
        expect.any(Function),
        {
            appSelector: 'body [data-reactroot]',
            parentSelector: 'body',
            isOpen: expect.any(Boolean),
            className: 'test CN',
            style: {
                width: 200
            },
            children: <div>1</div>,
            onRequestClose: expect.any(Function),
            overlayProps: {
                className: 'overlay CN',
                style: {
                    opacity: 0.5
                }
            }
        }
    ]);
    return require.requireActual('./HOC').default(...args);
});

describe('Modal', () => {
    const props = {
        appSelector: 'body [data-reactroot]',
        parentSelector: 'body',
        isOpen: true,
        className: 'test CN',
        style: {
            width: 200
        },
        overlayProps: {
            className: 'overlay CN',
            style: {
                opacity: 0.5
            }
        }
    };

    it('initial rendering', () => {
        const spyQS = jest.spyOn(document, 'querySelector');
        const spyDOM = jest.spyOn(DOM, 'unmountComponentAtNode');
        const wrapper = mount(<Modal {...props} >
            <div>1</div>
        </Modal>);
        expect(spyQS).toHaveBeenCalledWith(props.parentSelector);

        wrapper.setProps({
            isOpen: false
        });
        expect(spyQS).toHaveBeenCalledWith(props.parentSelector);

        wrapper.unmount();
        expect(spyDOM).toHaveBeenCalled();
        // parent node was removed
        expect(document.body.innerHTML).toEqual('');
    });

    it('on update', () => {
        const POSITION_FIXED = 'fixed';
        props.isOpen = false;
        const root = document.createElement('div');
        root.id = 'root';
        root.setAttribute('data-reactroot', '');
        document.body.appendChild(root);
        const wrapper = mount(<Modal {...props} >
            <div>1</div>
        </Modal>);
        expect(document.querySelector('#root').style.position).toEqual('');
        expect(document.body.scrollTop).toEqual(0);

        const scrollTop = 123;
        document.body.scrollTop = scrollTop;
        wrapper.setProps({
            isOpen: true
        });
        const app = document.querySelector('#root');
        expect(app.style.position).toEqual(POSITION_FIXED);
        expect(app.style.top).toEqual(`-${scrollTop}px`);

        wrapper.setProps({
            isOpen: false
        });
        expect(document.querySelector('#root').style.position).toEqual('');
        expect(document.body.scrollTop).toEqual(scrollTop);

        const styleTop = 321;
        app.style.top = `${styleTop}px`;
        app.style.position = POSITION_FIXED;
        wrapper.setProps({
            isOpen: true
        });
        expect(app.style.top).toEqual(`-${styleTop}px`);

        wrapper.setProps({
            isOpen: false
        });
        expect(document.querySelector('#root').style.position).toEqual(POSITION_FIXED);
        expect(document.body.scrollTop).toEqual(styleTop);
    });
});
