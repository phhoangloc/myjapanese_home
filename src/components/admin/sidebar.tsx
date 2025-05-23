'use client'
import React, { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import { UserType } from '@/redux/reducer/UserReduce';
import store from '@/redux/store';
import { ApiLogout } from '@/api/user';
import { setRefresh } from '@/redux/reducer/RefreshReduce';
const Sidebar = () => {


    const listMenu = [
        {
            icon: <HomeIcon className='!w-12 !h-12 p-2' />,
            name: "ホーム",
            link: "/",
        },
        {
            icon: <div className='!w-12 !h-12 p-2 flex flex-col justify-center text-center font-bold text-xl'>B</div>,
            name: "ブログ",
            link: "/admin/blog",
        },
        {
            icon: <div className='!w-12 !h-12 p-2 flex flex-col justify-center text-center font-bold text-xl'>知</div>,
            name: "言語知識",
            link: "/admin/exercise?part=chisiki",
        },
        {
            icon: <div className='!w-12 !h-12 p-2 flex flex-col justify-center text-center font-bold text-xl'>読</div>,
            name: "読解",
            link: "/admin/exercise?part=dokkai",
        },
        {
            icon: <div className='!w-12 !h-12 p-2 flex flex-col justify-center text-center font-bold text-xl'>聴</div>,
            name: "聴解",
            link: "/admin/exercise?part=chokai",
        },
        {
            icon: <div className='!w-12 !h-12 p-2 flex flex-col justify-center text-center font-bold text-xl'>試</div>,
            name: "試験問題",
            link: "/admin/exam",
        },
        {
            icon: <div className='!w-12 !h-12 p-2 flex flex-col justify-center text-center font-bold text-xl'>U</div>,
            name: "ユーザー",
            link: "/admin/user",
        },
        {
            icon: <div className='!w-12 !h-12 p-2 flex flex-col justify-center text-center font-bold text-xl'>F</div>,
            name: "ファイル",
            link: "/admin/file",
        },
    ]

    const toPage = useRouter()

    const [_currentUser, set_currentUser] = useState<UserType>(store.getState().user)

    const update = () => {
        store.subscribe(() => set_currentUser(store.getState().user))
    }
    useEffect(() => {
        update()
    }, [])

    const [_dOpen, set_dOpen] = useState<boolean>(false)

    const Logout = async (position: string) => {
        const result = await ApiLogout({ position })
        if (result.success) {
            store.dispatch(setRefresh())
            toPage.push("/admin")
        }
    }
    return (
        <div className='h-full relative overflow-hidden'>
            {listMenu.map((menu, index) =>
                <div key={index} className='h-12 flex flex-col justify-center overflow-hidden cursor-pointer first:text-sky-600 first:font-bold' onClick={() => { toPage.push(menu.link) }} >
                    <div className="flex w-max">
                        <div className=''>
                            {menu.icon}
                        </div>
                        <div className="flex flex-col justify-center uppercase">
                            {menu.name}
                        </div>
                    </div>
                </div>)}
            <div className='absolute bottom-0 flex flex-col justify-center overflow-hidden cursor-pointer first:text-sky-600 first:font-bold'>
                <div className="flex" onClick={() => set_dOpen(!_dOpen)}>
                    <div className=''>
                        <PersonIcon className='!w-12 !h-12 p-2' />
                    </div>
                    <div className="flex flex-col justify-center uppercase">
                        {_currentUser.username}
                    </div>
                </div>
                <div className={`flex overflow-hidden transition-all duration-100 opacity-50 ${_dOpen ? "h-12" : "h-0"}`} onClick={() => Logout(_currentUser.position)}>
                    <div className=''>
                        <LogoutIcon className='!w-12 !h-12 p-2' />
                    </div>
                    <div className="flex flex-col justify-center uppercase ">
                        ログアウト
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Sidebar