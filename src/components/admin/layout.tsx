'use client'
import React, { useState, useEffect } from 'react'
// import Header from "@/components/header";
import Sidebar from './sidebar';
import store from '@/redux/store';
import { UserType } from '@/redux/reducer/UserReduce';
import LoginCard from '../card/loginCard';

type Props = {
    children: React.ReactNode
}
const Layout = ({ children }: Props) => {
    const [_currentMenu, set_currentMenu] = useState<boolean>(store.getState().menu)
    const [_currentUser, set_currentUser] = useState<UserType>(store.getState().user)

    const update = () => {
        store.subscribe(() => set_currentMenu(store.getState().menu))
        store.subscribe(() => set_currentUser(store.getState().user))

    }
    useEffect(() => {
        update()
    }, [])

    return (
        _currentUser.position === "admin" ?
            <div className='w-full flex flex-col'>
                <div className='flex w-max xl:w-full justify-between'>
                    <div className={`transition-all duration-200 sticky h-screen top-0 bg-white shadow-md ${_currentMenu ? "w-40" : "w-12"} lg:w-40`}>
                        <Sidebar />
                    </div>

                    <div className='w-(--vw-12) lg:w-(--vw-40) px-4'>
                        {children}
                    </div>
                </div>
            </div> :
            <div className="h-screen flex flex-col justify-center">
                <LoginCard />
            </div>
    )
}


export default Layout