'use client'

import { signIn } from "next-auth/react"
import { useSearchParams } from "next/navigation"

import { CardTitle, CardDescription, CardHeader, CardContent, Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Register() {

    return (
        <div className="h-screen flex justify-center items-center bg-zinc-100">
            <form>
                <Card className="mx-auto max-w-sm">
                    <CardHeader>
                        <CardTitle className="text-2xl">Registrar-se</CardTitle>
                        <CardDescription>Cadastre-se para obter acesso ao sistema</CardDescription>
                    </CardHeader>

                    <CardContent>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="first-name">Usuário</Label>
                                <Input
                                    name="user"
                                    placeholder="Digite seu nome"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">E-mail</Label>
                                <Input
                                    name="email"
                                    type="email"
                                    placeholder="email@example.com"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password">Senha</Label>
                                <Input
                                    name="password"
                                    type="password"
                                    placeholder="********"
                                />
                            </div>
                            <Button type="submit" className="w-full">
                                Cadastrar-se
                            </Button>
                        </div>
                        <div className="mt-4 text-center text-sm">
                            Já possui uma conta?{" "}
                            <Link href="/" className="underline">
                                Login
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </div>
    )
}
