'use client'
import React, { useEffect, useState } from 'react'
import PersonIcon from '@mui/icons-material/Person';
import { UserType } from '@/redux/reducer/UserReduce';
import store from '@/redux/store';

const Header = () => {
    const [_currentUser, set_currentUser] = useState<UserType>(store.getState().user)

    const update = () => {
        store.subscribe(() => set_currentUser(store.getState().user))
    }

    useEffect(() => {
        update()
    }, [])
    return (
        <div className='fixed w-full h-12 flex flex-col justify-center bg-white shadow-md'>
            <div className="w-11/12 max-w-(--xl) m-auto flex justify-between">
                <div className='text-xl font-bold'>日本語を食べたくない</div>
                <div className='flex gap-4'>
                    <p>{_currentUser.username}</p>
                    <PersonIcon /></div>
            </div>
        </div>
    )
}

export default Header