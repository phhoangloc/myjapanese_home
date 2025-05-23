'use client'
import React from 'react'
import { useParams } from 'next/navigation'
import { Detail, DetailBlog, DetailExam, DetailUser } from '@/components/admin/detail'
const Page = () => {
    const params = useParams<{ archive: string, slug: string }>()
    const archive = params.archive
    const slug = params.slug

    switch (archive) {
        case "blog":
            return <DetailBlog archive='blog' slug={slug} />
        case "user":
            return <DetailUser archive='user' slug={slug} />
        case "exam":
            return <DetailExam archive='exam' slug={slug} />
        case "exercise":
            return <Detail archive='exercise' slug={slug} />
        default:
            return (
                <div>
                    NOT FOUND
                </div>
            )
    }

}

export default Page