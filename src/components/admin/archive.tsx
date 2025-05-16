'use client'
import React, { useEffect, useState } from 'react'
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import SortByAlphaIcon from '@mui/icons-material/SortByAlpha';
import { useRouter } from 'next/navigation';
import { UserType } from '@/redux/reducer/UserReduce';
import store from '@/redux/store';
import { ApiDeleteItem, ApiItemUser, ApiUploadFile } from '@/api/user';
import { UploadButton } from '../button/button';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import moment from 'moment';
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
    active: boolean,
    type: string,
    createdAt: Date
}
export const ArchiveBlog = ({ archive }: props) => {

    const [_currentUser, set_currentUser] = useState<UserType>(store.getState().user)

    const update = () => {
        store.subscribe(() => set_currentUser(store.getState().user))
    }

    useEffect(() => {
        update()
    }, [])

    const searchParams = useSearchParams()
    const part = searchParams.get("part") || ""
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
                <AddIcon className='!w-12 !h-12 p-2 my-1 bg-white cursor-pointer border rounded border-slate-300' onClick={() => toPage.push("/admin/" + archive + "/_news?part=" + part)} />
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


export const ArchiveFile = ({ archive }: props) => {

    const [_currentUser, set_currentUser] = useState<UserType>(store.getState().user)

    const update = () => {
        store.subscribe(() => set_currentUser(store.getState().user))
    }

    useEffect(() => {
        update()
    }, [])

    const [_refresh, set_refresh] = useState<number>(0)

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
    }, [_currentUser.position, archive, _refresh])

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getFile = async (e: any) => {
        const files = e.target.files;
        const file: File | undefined = files ? files[0] : undefined
        const reader: FileReader = new FileReader();
        if (file) {
            reader.readAsDataURL(file);
            reader.onloadend = async function () {
                const result = await ApiUploadFile({ position: _currentUser.position, archive, file })
                if (result.success) {
                    setTimeout(() => {
                        set_refresh(n => n + 1)
                    }, 2000);
                }
            }
        }

    }

    const [_select, set_select] = useState<number>(-1)
    const deleteImage = async (position: string, archive: string, id: number) => {
        const result = await ApiDeleteItem({ position, archive, id })
        if (result.success) {
            set_refresh(n => n + 1)
        }
    }
    return (
        <div className='w-full max-w-(--xxl)'>
            <div className='h-12 flex flex-col justify-center uppercase font-bold border-b text-sky-600 border-slate-300 '>{archive}</div>
            <div className="h-4"></div>
            <div className="grid grid-cols-12 gap-2 ">
                <div className='col-span-6 sm:col-span-4 md:col-span-3 xl:col-span-2 xxl:col-span-1 aspect-square flex flex-col justify-center shadow border border-slate-200 rounded bg-white'>
                    <UploadButton sx='!w-12 !h-12 m-auto' name={<AddIcon className='!h-full !w-full text-sky-600 cursor-pointer' />} onClick={(e) => getFile(e)} />
                </div>
                {_items.map((item, index) =>
                    <div key={index} className={`relative col-span-6 sm:col-span-4 md:col-span-3 xl:col-span-2 xxl:col-span-1 aspect-square flex flex-col justify-end  border-slate-200  `}>
                        <div className={`bg-white cursor-pointer transition-all duration-200 ${index === _select ? "shadow-md -translate-y-8" : "shadow"} absolute top-0 w-full h-full rounded border border-slate-300`} onClick={() => set_select(n => n !== index ? index : -1)}>

                            {item.type !== "png" && item.type !== "jpg" && item.type !== "png" && item.type !== "webp" ?
                                <div>
                                    <InsertDriveFileIcon className='!block mx-auto !h-12 !w-12 text-sky-600' />
                                    <p className='line-clamp-2 text-center text-xs w-2/3 mx-auto my-1'>{item.name}</p>
                                </div>
                                :
                                <Image src={process.env.ftp_url + item.name} fill className="object-cover" alt={item.type} />

                            }
                        </div>
                        <DeleteIcon className='!w-6 !h-6 !block ml-auto mr-0 hover:text-sky-600' onClick={() => deleteImage(_currentUser.position, archive, item.id)} />
                    </div>
                )}
            </div>
        </div>
    )
}
type ExerciseType = {
    id: number,
    part: string,
    mondai: string,
    question: string,
}
export const changePart = (partType: string) => {
    const partTypeArray = [
        { name: "言語知識", type: "chisiki" },
        { name: "読解", type: "dokkai" },
        { name: "聴解", type: "chokai" },
    ]

    const resultArray = partTypeArray.filter(pt => pt.type === partType)
    return resultArray[0].name
}

export const ArchiveExam = ({ archive }: props) => {

    const [_currentUser, set_currentUser] = useState<UserType>(store.getState().user)

    const update = () => {
        store.subscribe(() => set_currentUser(store.getState().user))
    }

    useEffect(() => {
        update()
    }, [])

    const searchParams = useSearchParams()
    const part = searchParams.get("part") || ""
    const [_items, set_items] = useState<ItemType[]>([])
    const getItem = async (position: string, archive: string, part: string) => {
        const result = await ApiItemUser({ position, archive, part })
        if (result.success) {
            set_items(result.data)
        } else {
            set_items([])
        }
    }

    useEffect(() => {
        getItem(_currentUser.position, archive, part)
    }, [_currentUser.position, archive, part])

    const toPage = useRouter()

    const sx = `h-18 flex flex-col justify-center cursor-pointer px-2 transition-all duration-200 `

    console.log(_items)
    return (
        <div className='w-full max-w-(--md)'>
            <div className='h-12 flex flex-col justify-center uppercase font-bold border-b text-sky-600 border-slate-300 '>{archive}</div>
            <div className="h12"></div>
            <div className='h-12 flex gap-1'>
                <AddIcon className='!w-12 !h-12 p-2 my-1 bg-white cursor-pointer border rounded border-slate-300' onClick={() => toPage.push("/admin/" + archive + "/_news" + part)} />
                <SearchIcon className='!w-12 !h-12 p-2 my-1 bg-white cursor-pointer border rounded border-slate-300' />
                <SortByAlphaIcon className='!w-12 !h-12 p-2 my-1 bg-white cursor-pointer border rounded border-slate-300' />
            </div>
            <div className="border border-slate-300 rounded mt-4 shadow-md">

                {_items.map((item, index) =>
                    <div key={index} className={`even:bg-slate-100 odd:bg-white ${sx} `} onClick={() => toPage.push(archive + "/" + item.id)}>
                        <div>試験問題{moment(item.createdAt).format("（YYYY年MM月DD日）")}</div>
                    </div>)}
            </div>
        </div>
    )
}
export const Archive = ({ archive }: props) => {

    const [_currentUser, set_currentUser] = useState<UserType>(store.getState().user)

    const update = () => {
        store.subscribe(() => set_currentUser(store.getState().user))
    }

    useEffect(() => {
        update()
    }, [])

    const searchParams = useSearchParams()
    const part = searchParams.get("part") || ""
    const [_items, set_items] = useState<ExerciseType[]>([])
    const getItem = async (position: string, archive: string, part: string) => {
        const result = await ApiItemUser({ position, archive, part })
        if (result.success) {
            set_items(result.data)
        } else {
            set_items([])
        }
    }

    useEffect(() => {
        getItem(_currentUser.position, archive, part)
    }, [_currentUser.position, archive, part])

    const toPage = useRouter()

    const sx = `h-18 flex flex-col justify-center cursor-pointer px-2 transition-all duration-200 `

    console.log(_items)
    return (
        <div className='w-full max-w-(--md)'>
            <div className='h-12 flex flex-col justify-center uppercase font-bold border-b text-sky-600 border-slate-300 '>{archive}</div>
            <div className="h12"></div>
            <div className='h-12 flex gap-1'>
                <AddIcon className='!w-12 !h-12 p-2 my-1 bg-white cursor-pointer border rounded border-slate-300' onClick={() => toPage.push("/admin/" + archive + "/_news?part=" + part)} />
                <SearchIcon className='!w-12 !h-12 p-2 my-1 bg-white cursor-pointer border rounded border-slate-300' />
                <SortByAlphaIcon className='!w-12 !h-12 p-2 my-1 bg-white cursor-pointer border rounded border-slate-300' />
            </div>
            <div className="border border-slate-300 rounded mt-4 shadow-md">
                <div className='h-12 flex flex-col justify-center p-2 opacity-50 bg-white border-b border-slate-300 p'>
                    {changePart(part)}
                </div>
                {_items.map((item, index) =>
                    <div key={index} className={`even:bg-slate-100 odd:bg-white ${sx} `} onClick={() => toPage.push(archive + "/" + item.id + "?part=" + item.part)}>
                        <div className={` line-clamp-1`} dangerouslySetInnerHTML={{ __html: item.question }}></div>
                        <div className='opacity-50 text-sm'>問題 {item.mondai}</div>
                    </div>)}
            </div>
        </div>
    )
}