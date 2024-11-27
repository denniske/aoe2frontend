import { redirect } from 'next/navigation';
import {createClient} from "@/helper/supabase/server";
import { revalidatePath } from 'next/cache';

export default async function LogoutPage() {
    const supabase = await createClient()

    const { error } = await supabase.auth.signOut()

    if (error) {
        redirect('/error')
    }

    revalidatePath('/', 'layout')
    redirect('/')
}
