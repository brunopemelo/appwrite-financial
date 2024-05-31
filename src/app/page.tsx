'use client'

import { signIn } from "next-auth/react"
import { useSearchParams } from "next/navigation"

import { CardTitle, CardDescription, CardHeader, CardContent, Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
    const searchParams = useSearchParams()

    const error = searchParams.get("error")

    async function login(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)

        const data = {
            usuario: formData.get("usuario"),
            password: formData.get("password")
        };

        signIn("credentials", {
            ...data,
            callbackUrl: "/pages/create-expense",
        })
    }

    return (
        <div className="h-screen flex justify-center items-center bg-zinc-100">
            <form onSubmit={login}>
                <Card className="mx-auto max-w-sm">
                    <CardHeader>
                        <CardTitle className="text-2xl">Login</CardTitle>
                        <CardDescription>Entre com seu usuário e senha para ter acesso</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="username">Usuário</Label>
                                <Input id="usuario" name="usuario" placeholder="Digite o nome" required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password">Senha</Label>
                                <Input id="password" name="password" placeholder="********" required type="password" />
                            </div>
                            <Button type="submit" className="w-full">
                                Login
                            </Button>
                        </div>
                        <div className="mt-4 text-center text-sm underline">
                            <Link href="/pages/register" className="text-sm flex justify-center mt-4 mb-0">Registrar-se</Link>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </div >
    );
}
