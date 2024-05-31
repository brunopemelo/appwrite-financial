"use client"

import Link from 'next/link';

import { useRouter } from "next/navigation"
import { getSession } from "next-auth/react"
import { ChangeEvent, useEffect, useState } from "react"

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { CardTitle, CardHeader, CardContent, CardFooter, Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ArrowLeftIcon, UpdateIcon } from "@radix-ui/react-icons"

function SkeletonLoader() {
    return (
        <div>
            <div style={{ width: "100%", height: "100px", backgroundColor: "#eee" }}></div>
            <div style={{ width: "100%", height: "100px", backgroundColor: "#eee", marginTop: "10px" }}></div>
            <div style={{ width: "100%", height: "100px", backgroundColor: "#eee", marginTop: "10px" }}></div>
        </div>
    );
}

export default function EditBalance({ params }: { params: { id: string } }) {
    const [sessionClient, setSessionClient] = useState(true);
    const [formData, setFormData] = useState({ saldo: "", descricao: "" })
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    useEffect(() => {
        const checkSession = async () => {
            const session = await getSession();
            if (!session) {
                router.push("/");
            } else {
                setSessionClient(false);
            }
        };

        checkSession();

        const fetchData = async () => {
            try {
                const response = await fetch(`/api/saldo/${params.id}`)
                if (!response.ok) {
                    throw new Error("Falha ao buscar saldos!")
                }

                const data = await response.json()
                setFormData({ saldo: data.saldo.saldo, descricao: data.saldo.descricao })
            } catch (error) {
                setError("O servidor está com problemas no momento. Tente novamente mais tarde!")
            }
        }

        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router])

    if (sessionClient) {
        return <SkeletonLoader />;
    }

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData((prevData) => ({
            ...prevData,
            [e.target.name]: e.target.value,
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.saldo || !formData.descricao) {
            setError("Preencha todos os campos!")
            return
        }

        setError(null)
        setIsLoading(true)

        try {
            const response = await fetch(`/api/saldo/${params.id}`, {
                method: "PUT",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify(formData),
            })

            if (!response.ok) {
                throw new Error("Falha ao atualizar saldo!")
            }

            toast.success("Saldo alterado com sucesso!", {
                theme: "dark"
            })
        } catch (error) {
            console.log(error)
            setError("O servidor está com problemas no momento. Tente novamente mais tarde!")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="h-screen flex justify-center items-center bg-zinc-100">
            <form onSubmit={handleSubmit} className="w-full max-w-xl shadow-2xl rounded-xl bg-white">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">Alterar Saldo</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between">
                            <div className="space-y-2">
                                <Label>Descrição
                                    <Input
                                        type="text"
                                        name="descricao"
                                        placeholder="Salário"
                                        value={formData.descricao}
                                        className="py-4 px-4 border rounded-md"
                                        onChange={handleInputChange}
                                    />
                                </Label>
                            </div>

                            <div className="space-y-2 ml-2">
                                <Label>Saldo
                                    <Input
                                        type="text"
                                        name="saldo"
                                        placeholder="R$"
                                        value={formData.saldo}
                                        className="py-4 px-4 border rounded-md"
                                        onChange={handleInputChange}
                                    />
                                </Label>
                            </div>
                        </div>
                    </CardContent>

                    <CardFooter>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            <UpdateIcon className="mr-2 h-4 w-4" />{isLoading ? "Editando..." : "Editar"}
                        </Button>
                        <ToastContainer autoClose={2000} position="top-right" />
                    </CardFooter>
                    {error && <p className="text-red-500 font-bold text-sm mb-6 flex justify-center items-center">{error}</p>}

                    <CardFooter>
                        <Link href="/pages/list-balances" passHref>
                            <Button className="button bg-green-600 text-white">
                                <ArrowLeftIcon className="mr-2 h-4 w-4" />Voltar
                            </Button>
                        </Link>
                    </CardFooter>
                </Card>
            </form>
        </div>
    )
}
