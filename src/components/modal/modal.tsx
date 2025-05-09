'use client'
import { ModalType } from '@/redux/reducer/ModalReduce'
import store from '@/redux/store'
import React, { useState, useEffect } from 'react'
import BlogModal from './blog.modal'

const Modal = () => {

    const [_currentModal, set_currentModal] = useState<ModalType>(store.getState().modal)
    const update = () => {
        store.subscribe(() => set_currentModal(store.getState().modal))
    }
    useEffect(() => {
        update()
    }, [])
    return (
        <div className={`w-screen h-screen backdrop-brightness-75 backdrop-blur-sm flex flex-col justify-center top-0 left-0 p-12 z-0  ${_currentModal.open ? "fixed" : "hidden"}`}>
            <BlogModal slug={_currentModal.value} />
        </div>
    )
}

export default Modal