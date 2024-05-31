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
import { UpdateIcon, ArrowLeftIcon } from "@radix-ui/react-icons"

function SkeletonLoader() {
    return (
        <div>
            <div style={{ width: "100%", height: "100px", backgroundColor: "#eee" }}></div>
            <div style={{ width: "100%", height: "100px", backgroundColor: "#eee", marginTop: "10px" }}></div>
            <div style={{ width: "100%", height: "100px", backgroundColor: "#eee", marginTop: "10px" }}></div>
        </div>
    );
}

export default function EditExpense({ params }: { params: { id: string } }) {
    const [sessionClient, setSessionClient] = useState(true);
    const [formData, setFormData] = useState({ contas: "", valor: "", parcelas: "" })
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
                const response = await fetch(`/api/contas/${params.id}`)
                if (!response.ok) {
                    throw new Error("Falha ao buscar contas!")
                }

                const data = await response.json()
                setFormData({ contas: data.contas.contas, valor: data.contas.valor, parcelas: data.contas.parcelas })
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

        if (!formData.contas || !formData.valor || !formData.parcelas) {
            setError("Preencha todos os campos!")
            return
        }

        setError(null)
        setIsLoading(true)

        try {
            const response = await fetch(`/api/contas/${params.id}`, {
                method: "PUT",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify(formData),
            })

            if (!response.ok) {
                throw new Error("Falha ao atualizar conta!")
            }

            toast.success("Conta alterada com sucesso!", {
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
                        <CardTitle className="text-2xl">Alterar Despesa</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Descrição
                                <Input
                                    type="text"
                                    name="contas"
                                    placeholder="Descreva aqui"
                                    value={formData.contas}
                                    className="py-4 px-4 border rounded-md"
                                    onChange={handleInputChange}
                                />
                            </Label>
                        </div>
                        <div className="flex justify-between">
                            <div className="space-y-2">
                                <Label>Valor
                                    <Input
                                        type="text"
                                        name="valor"
                                        placeholder="R$"
                                        value={formData.valor}
                                        className="py-4 px-4 border rounded-md"
                                        onChange={handleInputChange}
                                    />
                                </Label>
                            </div>
                            <div className="space-y-2">
                                <Label>Número de Parcelas
                                    <Input
                                        type="text"
                                        name="parcelas"
                                        placeholder="1"
                                        maxLength={2}
                                        value={formData.parcelas}
                                        className="py-4 px-4 border rounded-md"
                                        onChange={handleInputChange}
                                    />
                                </Label>
                            </div>
                        </div>
                    </CardContent>

                    <CardFooter>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            <UpdateIcon className="mr-2 h-4 w-4" />{isLoading ? "Alterando..." : "Alterar "}
                        </Button>
                        <ToastContainer autoClose={2000} position="top-right" />
                    </CardFooter>
                    {error && <p className="text-red-500 font-bold text-sm mb-6 flex justify-center items-center">{error}</p>}

                    <CardFooter>
                        <Link href="/pages/list-expenses" passHref>
                            <Button className="button bg-red-400 text-white">
                                <ArrowLeftIcon className="mr-2 h-4 w-4" />Voltar
                            </Button>
                        </Link>
                    </CardFooter>
                </Card>
            </form>
        </div>
    )
}
