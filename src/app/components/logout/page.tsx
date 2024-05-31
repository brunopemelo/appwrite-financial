"use client"

import { ExitIcon } from "@radix-ui/react-icons"
import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"

export default function LogoutButton() {
    return (
        <>
            <Button onClick={() => signOut()} variant="outline">
                <ExitIcon className="mr-2 h-4 w-4" />Deslogar
            </Button>
        </>
    )
}
