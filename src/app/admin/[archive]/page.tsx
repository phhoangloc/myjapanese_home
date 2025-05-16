'use client'
import React from 'react'
import { useParams } from 'next/navigation'
import { Archive, ArchiveBlog, ArchiveExam, ArchiveFile } from '@/components/admin/archive'
const Page = () => {
    const params = useParams<{ archive: string }>()
    const archive = params.archive

    switch (archive) {
        case "file":

            return (
                <ArchiveFile archive={archive} />
            )
        case "blog":

            return (
                <ArchiveBlog archive={archive} />
            )
        case "exam":
            return (
                <ArchiveExam archive={archive} />
            )
        default:
            return (
                <Archive archive={archive} />
            )
    }

}

export default Page