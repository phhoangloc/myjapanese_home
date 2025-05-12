'use client'
import React, { useEffect, useState } from 'react'
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import SortByAlphaIcon from '@mui/icons-material/SortByAlpha';
import { useRouter } from 'next/navigation';
import { UserType } from '@/redux/reducer/UserReduce';
import store from '@/redux/store';
import { ApiItemUser } from '@/api/user';
type props = {
    archive: string
}
type ItemType = {
    id: number,
    name: string,
    username: string,
    content: string,
    slug: string,
    position: string,
    active: boolean
}
export const Archive = ({ archive }: props) => {

    const [_currentUser, set_currentUser] = useState<UserType>(store.getState().user)

    const update = () => {
        store.subscribe(() => set_currentUser(store.getState().user))
    }

    useEffect(() => {
        update()
    }, [])

    const [_items, set_items] = useState<ItemType[]>([])
    const getItem = async (position: string, archive: string) => {
        const result = await ApiItemUser({ position, archive })
        if (result.success) {
            set_items(result.data)
        } else {
            set_items([])
        }
    }

    useEffect(() => {
        getItem(_currentUser.position, archive)
    }, [_currentUser.position, archive])

    const toPage = useRouter()

    const sx = `h-12 flex flex-col justify-center cursor-pointer px-2 transition-all duration-200 `

    return (
        <div className='w-full max-w-(--md)'>
            <div className='h-12 flex flex-col justify-center uppercase font-bold border-b text-sky-600 border-slate-300 '>{archive}</div>
            <div className="h12"></div>
            <div className='h-12 flex gap-1'>
                <AddIcon className='!w-12 !h-12 p-2 my-1 bg-white cursor-pointer border rounded border-slate-300' onClick={() => toPage.push("/admin/" + archive + "/_news")} />
                <SearchIcon className='!w-12 !h-12 p-2 my-1 bg-white cursor-pointer border rounded border-slate-300' />
                <SortByAlphaIcon className='!w-12 !h-12 p-2 my-1 bg-white cursor-pointer border rounded border-slate-300' />
            </div>
            <div className="border border-slate-300 rounded mt-4 shadow-md">
                <div className='text-sm p-2 opacity-50 bg-white border-b border-slate-300 p'>
                    title / name
                </div>
                {_items.map((item, index) =>
                    <div key={index} className='even:bg-slate-50 odd:bg-white '>
                        {item.name ? <div onClick={() => toPage.push(archive + "/" + item.slug)} className={`${sx}`}>{item.name}</div> :
                            item.username ? <div onClick={() => toPage.push(archive + "/" + item.id)} className={`${sx} flex-row gap-4 justify-start`}>
                                <div className='flex flex-col justify-center'>{item.username}</div>
                                <div className='flex flex-col justify-center opacity-50 '>{item.position}</div>
                                <div className='flex flex-col justify-center opacity-50 '>{item.active ? "active" : "non-active"}</div>
                            </div> :
                                item.content ? <div onClick={() => toPage.push(archive + "/" + item.slug)} className={`${sx} line-clamp-1`} dangerouslySetInnerHTML={{ __html: item.content.split("</h1>")[0] }}></div> :
                                    null}
                    </div>)}
            </div>
        </div>
    )
}


