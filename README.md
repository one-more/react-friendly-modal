# react-friendly-modal

modal component for react

## install

````
npm i -S react-friendly-modal 
````

## demo
[link](https://one-more.github.io/react-friendly-modal/)

## usage
````jsx harmony
import Modal from 'react-friendly-modal';

<Modal 
    isOpen="true"
    onRequestClose={onClose}
>
    <div>
        modal content
    </div>
</Modal>     
````

## props
| name | default value | allowed values |
|------|---------------|----------------|
| isOpen | false| boolean |
| onRequestClose | empty function | function |
| className | empty string | string |
| appSelector | body [data-reactroot] | string |
| style | {} | object |
| parentSelector | body | string |
| overlayProps | {} | object |
| closeOnOverlayClick | false | boolean |
| animation | '' | 'right-to-left' |
