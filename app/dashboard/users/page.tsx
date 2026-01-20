import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getUsers } from "@/lib/actions/user-actions"
import { UserClient } from "./user-client"

export default async function UsersPage() {
    const session = await getServerSession(authOptions)

    if (!session || (session.user as any).jabatan !== "admin") {
        redirect("/dashboard?error=unauthorized")
    }

    const users = await getUsers()

    return (
        <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <UserClient initialUsers={users} />
            </div>
        </div>
    )
}
