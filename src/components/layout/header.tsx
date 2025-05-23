'use client'
import React, { useEffect, useState } from 'react'
import PersonIcon from '@mui/icons-material/Person';
import { UserType } from '@/redux/reducer/UserReduce';
import store from '@/redux/store';
import { ApiLogout } from '@/api/user';
import { ModalType, setModal } from '@/redux/reducer/ModalReduce';
import { useRouter } from 'next/navigation';
import { setRefresh } from '@/redux/reducer/RefreshReduce';

const Header = () => {
    const [_currentUser, set_currentUser] = useState<UserType>(store.getState().user)
    const [_currentModal, set_currentModal] = useState<ModalType>(store.getState().modal)

    const update = () => {
        store.subscribe(() => set_currentUser(store.getState().user))
        store.subscribe(() => set_currentModal(store.getState().modal))
    }

    useEffect(() => {
        update()
    }, [])


    const toPage = useRouter()

    const [_isCLickAvata, set_isCLickAvata] = useState<boolean>(false)
    const [_isLogout, set_isLogout] = useState<boolean>(false)
    useEffect(() => {
        const logOut = async () => {
            const result = await ApiLogout({ position: _currentUser.position, })
            if (result.success) {
                store.dispatch(setModal({ open: true, type: "notification", msg: "ログアウト成功", value: "" }))
                setTimeout(() => {
                    store.dispatch(setModal({ open: false, type: "", msg: "", value: "" }))
                    store.dispatch(setRefresh())
                    toPage.refresh()
                }, 3000);
            }
        }
        if (_currentModal.value === "yes" && _isLogout) {
            logOut()
        }
    }, [_currentModal.value, _currentUser.position, _isLogout, toPage])

    return (
        <div className='fixed w-full h-12 flex flex-col justify-center bg-white shadow-md'>
            <div className="w-11/12 max-w-(--xl) m-auto flex justify-between">
                <div className='text-xl font-bold'>日本語を食べない</div>
                <div className='flex justify-between w-40 relative cursor-pointer' onClick={() => set_isCLickAvata(!_isCLickAvata)} >
                    <p>{_currentUser.username}</p>
                    <PersonIcon />
                    <div className={`absolute w-full top-12 bg-slate-100 p-1 shadow grid ${_isCLickAvata ? "block" : "hidden"}`}>
                        <div className='h-12  flex flex-col justify-center text-center bg-white border-b border-slate-200 cursor-pointer' onClick={() => { store.dispatch(setModal({ open: true, type: "confirm", msg: "本当にログアウトしたいですか？", value: "" })); set_isLogout(true) }}>
                            ログアウト
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header