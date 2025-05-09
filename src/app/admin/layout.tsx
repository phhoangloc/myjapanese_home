import React from 'react'
import Layout from '@/components/admin/layout'
type Props = {
    children: React.ReactNode
}

const AdminLayout = ({ children }: Props) => {
    return (
        <Layout>
            {children}
        </Layout>
    )
}

export default AdminLayout