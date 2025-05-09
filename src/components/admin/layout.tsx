'use client'
import React, { useState, useEffect } from 'react'
// import Header from "@/components/header";
import Sidebar from './sidebar';
import store from '@/redux/store';

type Props = {
    children: React.ReactNode
}
const Layout = ({ children }: Props) => {
    const [_currentMenu, set_currentMenu] = useState<boolean>(store.getState().menu)

    const update = () => {
        store.subscribe(() => set_currentMenu(store.getState().menu))

    }
    useEffect(() => {
        update()
    }, [])

    return (
        <div className='w-full bg-bgr  flex flex-col'>
            <div className='flex w-max xl:w-full justify-between'>
                <div className={`transition-all duration-200 sticky h-screen top-0 bg-white shadow-md ${_currentMenu ? "w-40" : "w-12"} lg:w-40`}>
                    <Sidebar />
                </div>

                <div className='w-(--vw-12) lg:w-(--vw-40)'>
                    {children}
                </div>
            </div>
        </div>
    )
}


export default Layout