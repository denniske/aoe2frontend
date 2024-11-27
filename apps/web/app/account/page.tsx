import { redirect } from 'next/navigation'

import { createClient } from '@/helper/supabase/server'

export default async function AccountPage() {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.getUser()
    if (error || !data?.user) {
        redirect('/login')
    }

    return <p>Hello account {data.user.email}</p>
}
