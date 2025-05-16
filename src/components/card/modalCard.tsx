import { ApiItemUser, ApiUploadFile } from '@/api/user'
import { UserType } from '@/redux/reducer/UserReduce'
import store from '@/redux/store'
import React, { useEffect, useState } from 'react'
import { UploadButton } from '../button/button'
import Image from 'next/image'
import AddIcon from '@mui/icons-material/Add';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import moment from 'moment'

type Props = {
    archive: string,
    array?: { id: number }[]
    sendout: (url: string) => void,
}
type ItemType = {
    id: number,
    name: string,
    type: string,
    createdAt: Date
}
export const ModalCard = ({ archive, sendout, array }: Props) => {

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
        const result = await ApiItemUser({ position, archive, skip: 0, limit: 24 })
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

    switch (archive) {
        case "file":
            return (
                <div className="grid grid-cols-12 gap-2 p-4 ">
                    <div className='col-span-4  md:col-span-3 xl:col-span-1 xxl:col-span-1 aspect-square flex flex-col justify-center shadow border border-slate-200 rounded bg-white'>
                        <UploadButton sx='!w-12 !h-12 m-auto' name={<AddIcon className='!h-full !w-full text-sky-600 cursor-pointer' />} onClick={(e) => getFile(e)} />
                    </div>
                    {_items.map((item, index) =>
                        <div key={index}
                            className={`col-span-4  md:col-span-3 xl:col-span-1 xxl:col-span-1 realtive aspect-square flex flex-col justify-center shadow border border-slate-200 rounded relative overflow-hidden`}
                            onClick={() => { sendout(process.env.ftp_url + item.name) }}>
                            {item.type !== "mp3" ?
                                <Image src={process.env.ftp_url + item.name} fill className="object-contain" alt={item.type} />
                                :
                                <div>
                                    <InsertDriveFileIcon className='!w-8 !h-8 !block mx-auto text-sky-600' />
                                    <p className='line-clamp-1 text-xs w-2/3 mx-auto'>{item.name}</p>
                                </div>

                            }
                        </div>
                    )}
                </div>
            )
        case "exam":
            return (
                _items.map((exam, index) =>
                    <div key={index} className='h-12 flex px-2 border-b border-slate-200'>
                        <input type='checkbox' className='w-4 h-4 my-auto mr-2' checked={array?.includes(exam)} />
                        <div className='flex flex-col justify-center'>{moment(exam.createdAt).format("YYYY年MM月DD日")}</div>
                    </div>)

            )
        default:
            return (<div>modal</div>)
    }

}

export default ModalCard