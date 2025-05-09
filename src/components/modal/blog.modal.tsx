'use cline'
import React, { useEffect, useState } from 'react'
import { BlogType } from '@/app/page'
import { ApiItem } from '@/api/client'
import RefreshIcon from '@mui/icons-material/Refresh';
type Props = {
    slug: string
}
const BlogModal = ({ slug }: Props) => {

    const [_blog, set_blog] = useState<BlogType[]>()
    const [_loading, set_loading] = useState<boolean>(true)
    const getBlog = async (archive: string, slug: string) => {
        const result = await ApiItem({ archive, slug })
        if (result.success) {
            set_blog(result.data[0])
            set_loading(false)
        } else {
            set_blog(undefined)
            set_loading(false)
        }
    }

    useEffect(() => {
        if (slug) {
            getBlog("blog", slug)
        }
    }, [slug])

    console.log(_blog)
    return (
        _loading ?
            <RefreshIcon className='!w-12 !h-12 bg-white block m-auto rounded p-2' /> :
            <div className={`w-full h-full bg-white m-auto transition-all duration-500 relative z-[1]`}>

            </div>)
}

export default BlogModal