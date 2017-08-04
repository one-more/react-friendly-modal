import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {storiesOf} from '@kadira/storybook';
import Modal from './index';

class ModalOwner extends Component {
    static propTypes = {
        title: PropTypes.string,
        style: PropTypes.object,
        className: PropTypes.string
    };

    static defaultProps = {
        title: '',
        style: {},
        className: ''
    };

    state = {
        isOpen: false
    };

    toggleModal = () => {
        this.setState(({isOpen}) => ({
            isOpen: !isOpen
        }));
    };

    render() {
        const {isOpen} = this.state;
        const {title, children, style, className} = this.props;
        return (
            <div>
                <button onClick={this.toggleModal} >{title}</button>
                <Modal
                    onRequestClose={this.toggleModal}
                    isOpen={isOpen}
                    style={style}
                    className={className}
                >
                    {children}
                </Modal>
            </div>
        );
    }
}

storiesOf('Modal')
    .add('default', () => (<div style={{height: 600, paddingTop: 200}} >
        <ModalOwner title="first modal" >
            <div>first modal content</div>
            <ModalOwner title="third modal" className="test" >
                <div style={{width: 500, height: 800}}>
                    third modal content
                </div>
            </ModalOwner>
        </ModalOwner>
        <ModalOwner title="second modal" >
            <div>second modal content</div>
        </ModalOwner>
    </div>));
