'use client'
import React, { useEffect, useState } from 'react'
import { UserType } from '@/redux/reducer/UserReduce'
import store from '@/redux/store'
import { ApiItemUser, ApiUpdateItem } from '@/api/user'
import { ItemType } from '@/components/admin/detail'
import moment from 'moment'
import { ModalType, setModal } from '@/redux/reducer/ModalReduce'
import { useRouter } from 'next/navigation'


const Page = () => {


    const [_currentUser, set_currentUser] = useState<UserType>(store.getState().user)
    const [_currentModal, set_currentModal] = useState<ModalType>(store.getState().modal)

    const update = () => {
        store.subscribe(() => set_currentUser(store.getState().user))
        store.subscribe(() => set_currentModal(store.getState().modal))
    }

    useEffect(() => {
        update()
    }, [])
    const [_items, set_items] = useState<ItemType[]>([])
    const getItem = async (position: string, archive: string, examinee: number) => {
        const result = await ApiItemUser({ position, archive, examinee })
        console.log(result)
        if (result.success) {
            set_items(result.data)
        } else {
            set_items([])
        }
    }

    useEffect(() => {
        getItem(_currentUser.position, "exam", _currentUser.id)
    }, [_currentUser.id, _currentUser.position])

    const toPage = useRouter()
    const [_id, set_id] = useState<number>(0)


    useEffect(() => {
        const dotest = async (position: string, archive: string, id: number) => {
            try {
                await ApiUpdateItem({ position, archive, id }, {})
                toPage.push("/test/" + _id)

                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error) {
                store.dispatch(setModal({ open: true, msg: "もうやりました。", value: "", type: "notification" }))
                setTimeout(() => {
                    store.dispatch(setModal({ open: false, msg: "", value: "", type: "" }))
                }, 3000)
            }
        }

        if (_currentModal.value === "yes") {
            dotest(_currentUser.position, "exam", _id)
            store.dispatch(setModal({ open: false, msg: "", type: "", value: "" }))
        }
    }, [_currentModal.value, _currentUser.position, _id, toPage])

    return (
        <div className='w-full max-w-(--lg) m-auto'>
            <div className='h-24 flex flex-col justify-end font-bold text-2xl'>宿題</div>
            <div className="h-6"></div>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4'>
                {_items.map((_item, index) =>
                    <div key={index} className='shadow-md aspect-square bg-white flex flex-col justify-center text-center cursor-pointer' onClick={() => { store.dispatch(setModal({ open: true, type: "confirm", msg: "この宿題をチャレンジしたい？", "value": "" })); set_id(_item.id) }}>
                        <div className='font-bold text-xl'>宿題</div>
                        <div>{moment(_item.createdAt).format("YYYY年MM月DD日")}</div>
                    </div>)}
            </div>
        </div>
    )
}

export default Page