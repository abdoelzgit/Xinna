import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getProfileData } from "@/lib/actions/customer-actions"
import { ProfileClient } from "@/components/profile-client"
import { redirect } from "next/navigation"

export default async function ProfilePage() {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect("/login")
    }

    const result = await getProfileData(session.user?.email!)

    if (result.error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-muted-foreground">{result.error}</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <ProfileClient
                user={session.user}
                initialData={result.data}
                type={result.type as any}
            />
        </div>
    )
}
