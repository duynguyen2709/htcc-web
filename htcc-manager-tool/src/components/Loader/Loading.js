import React from 'react'
import ReactDOM from 'react-dom'
import ReactLoading from "react-loading";

function Loading() {
    return ReactDOM.createPortal(
        <div id="modal-wrapper">
            <ReactLoading
                type={'spinningBubbles'}
                color={'#4caf50'}
                className={'center-div'}
                height={'10%'}
                width={'10%'}
            />
        </div>,
        document.querySelector('body'),
    )
}

export default Loading;
