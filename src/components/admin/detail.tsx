'use client'
import { ApiItem } from '@/api/client'
import React, { useEffect, useState } from 'react'
import AddIcon from '@mui/icons-material/Add';
import { useRouter } from 'next/navigation';
import { Input } from '../input/input';
import TextArea from '../input/textarea';
import { Button } from '../button/button';
import { ApiCreateItem, ApiItemUser, ApiUpdateItem } from '@/api/user';
import { UserType } from '@/redux/reducer/UserReduce';
import store from '@/redux/store';
type props = {
    archive: string,
    slug: string
}
type ItemType = {
    id: number,
    name: string,
    username: string,
    slug: string,
    content: string,
    active: boolean,
    position: string,
    email: string,
}
export const DetailBlog = ({ archive, slug }: props) => {

    const [_currentUser, set_currentUser] = useState<UserType>(store.getState().user)

    const update = () => {
        store.subscribe(() => set_currentUser(store.getState().user))
    }

    useEffect(() => {
        update()
    }, [])

    const [_item, set_item] = useState<ItemType>()
    const getBlog = async (archive: string, slug: string) => {
        const result = await ApiItem({ archive, slug })
        if (result.success) {
            set_item(result.data[0])
        } else {
            set_item(undefined)
        }
    }

    useEffect(() => {
        getBlog(archive, slug)
    }, [archive, slug])

    const toPage = useRouter()

    const [_id, set_id] = useState<number>(0)
    const [_slug, set_slug] = useState<string>("")
    const [_newSlug, set_newSlug] = useState<string>("")
    const [_content, set_content] = useState<string>("")
    const [_newContent, set_newContent] = useState<string>("")
    useEffect(() => {
        if (_item) {
            set_id(_item.id)
            set_content(_item.content)
            set_slug(_item.slug)
        }
    }, [_item])
    const body = {
        slug: _newSlug || _slug,
        content: _newContent || _content
    }

    const CreateBlog = async (position: string, archive: string, body: {
        slug: string;
        content: string;
    }) => {
        const result = await ApiCreateItem({ position, archive }, body)
        console.log(result)
    }
    const UpdateBlog = async (position: string, archive: string, id: number, body: {
        slug: string;
        content: string;
    }) => {
        const result = await ApiUpdateItem({ position, archive, id }, body)
        if (result.success) {
            toPage.push("/admin/blog")
        }
    }
    return (
        <div className='w-11/12 m-auto'>
            <div className='h-12 flex flex-col justify-center uppercase font-bold border-b text-sky-600 border-slate-300'>{archive}</div>
            <div className="h12"></div>
            <div className='h-12 flex'>
                <AddIcon className='!w-12 !h-12 p-2 m-1 cursor-pointer border rounded border-slate-300 bg-white' onClick={() => toPage.push("blog/_news")} />
            </div>
            <div className='h-4'>
            </div>
            <div>
                <div className='flex flex-col justify-end text-sm'>
                    slug
                </div>
                <Input value={_slug} onchange={(v) => set_newSlug(v)} />
            </div>
            <div>
                <div className='flex flex-col justify-end text-sm'>
                    content
                </div>

                <TextArea value={_content} onchange={(v) => set_newContent(v)} />
            </div>
            <Button name={slug !== "_news" ? "save" : "create"} onClick={() => slug !== "_news" ? UpdateBlog(_currentUser.position, archive, _id, body) : CreateBlog(_currentUser.position, archive, body)} sx='block !mx-auto !my-4' />
        </div>
    )
}
export const DetailUser = ({ archive, slug }: props) => {
    const [_currentUser, set_currentUser] = useState<UserType>(store.getState().user)

    const update = () => {
        store.subscribe(() => set_currentUser(store.getState().user))
    }

    useEffect(() => {
        update()
    }, [])

    const toPage = useRouter()
    const [_item, set_item] = useState<ItemType>()
    const getBlog = async (position: string, archive: string, id: number) => {
        const result = await ApiItemUser({ position, archive, id })
        if (result.success) {
            set_item(result.data[0])
        } else {
            set_item(undefined)
        }
    }

    useEffect(() => {
        getBlog(_currentUser.position, archive, Number(slug))
    }, [archive, slug, _currentUser.position])

    const [_username, set_username] = useState<string>("")
    const [_password, set_password] = useState<string>("")
    const [_email, set_email] = useState<string>("")
    // const [_active, set_active] = useState<boolean>(true)

    const body = {
        username: _username,
        password: _password,
        email: _email,
        active: true,
    }
    const CreateUser = async (position: string, archive: string, body: {
        username: string;
        password: string;
        email: string;
    }) => {
        const result = await ApiCreateItem({ position, archive }, body)
        if (result.success) {
            toPage.push("/admin/user")
        }
    }
    return (
        slug !== "_news" ?
            <div className='py-2 flex flex-col gap-2'>
                <div className='w-11/12 m-auto bg-white h-24 flex flex-col justify-center shadow px-2 rounded'>
                    <p>user: <b>{_item?.username}</b></p>
                </div>

                <div className='w-11/12 m-auto bg-white h-12 flex flex-col justify-center shadow px-2 rounded'>
                    email : {_item?.email}
                </div>
                <div className='w-11/12 m-auto bg-white h-12 flex flex-col justify-center shadow px-2 rounded'>
                    position : {_item?.position}
                </div>
                <div className='w-11/12 m-auto bg-white h-12 flex flex-col justify-center shadow px-2 rounded'>
                    active : {_item?.active ? "active" : "non-active"}
                </div>
            </div> :
            <div className='py-2 flex flex-col gap-2'>
                <div className="w-11/12 m-auto bg-slate-50 p-2 shadow">
                    <div className='font-bold text-center p-6'>create new user</div>
                    <div className="flex">
                        <div className='w-24 flex flex-col justify-center'>username</div>
                        <Input value={_username} onchange={(v) => set_username(v)} />
                    </div>
                    <div className="flex">
                        <div className='w-24 flex flex-col justify-center'>password</div>
                        <Input value={_password} onchange={(v) => set_password(v)} />
                    </div>
                    <div className="flex">
                        <div className='w-24 flex flex-col justify-center'>email</div>
                        <Input value={_email} onchange={(v) => set_email(v)} />
                    </div>

                    <Button name="create" onClick={() => CreateUser(_currentUser.position, "user", body)} sx='!my-4 !mx-auto block'></Button>
                </div>
            </div>
    )
}