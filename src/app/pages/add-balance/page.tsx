"use client"

import { NumericFormat } from 'react-number-format';
import LogoutButton from "@/app/components/logout/page"
import Link from 'next/link';

import { useState, useEffect, ChangeEvent } from "react"
import { useRouter } from "next/navigation"
import { getSession } from "next-auth/react"

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { CardTitle, CardDescription, CardHeader, CardContent, CardFooter, Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ArrowRightIcon, UpdateIcon, ArrowLeftIcon } from "@radix-ui/react-icons"

function SkeletonLoader() {
    return (
        <div>
            <div style={{ width: "100%", height: "100px", backgroundColor: "#eee" }}></div>
            <div style={{ width: "100%", height: "100px", backgroundColor: "#eee", marginTop: "10px" }}></div>
            <div style={{ width: "100%", height: "100px", backgroundColor: "#eee", marginTop: "10px" }}></div>
        </div>
    );
}

export default function Saldo() {
    const [sessionClient, setSessionClient] = useState(true);
    const [formData, setFormData] = useState({ saldo: "", descricao: "" })
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter();

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
    }, [router]);

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
            const response = await fetch("/api/saldo", {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify(formData),
            })

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Falha ao criar saldo!");
            }

            toast.success("Saldo cadastrado com sucesso!", {
                theme: "dark"
            })

            setFormData({ saldo: "", descricao: "" });
        } catch (error) {
            console.log(error)
            setError("Algo deu errado! Tente novamente mais tarde.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="h-screen flex justify-center items-center bg-zinc-100">
            <form onSubmit={handleSubmit} className="w-full max-w-xl shadow-2xl rounded-xl bg-white">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">Cadastro de Saldo</CardTitle>
                        <CardDescription>Insira as formas de recebimento que você possui</CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
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

                        <div className="grid">
                            <Label style={{ marginTop: 5 }}>Saldo</Label>
                            <NumericFormat
                                name="saldo"
                                placeholder="R$"
                                value={formData.saldo}
                                thousandSeparator="."
                                decimalSeparator=","
                                prefix="R$ "
                                allowNegative={false}
                                className="py-1 px-4 border rounded-md text-sm mt-1"
                                onChange={handleInputChange}
                            />
                        </div>
                    </CardContent>

                    <CardFooter>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            <UpdateIcon className="mr-2 h-4 w-4" />{isLoading ? "Cadastrando..." : "Cadastrar"}
                        </Button>
                        <ToastContainer autoClose={2000} position="top-right" />
                    </CardFooter>
                    {error && <p className="text-red-500 font-bold text-sm mb-6 flex justify-center items-center">{error}</p>}

                    <CardFooter className="flex justify-between">
                        <LogoutButton />

                        <div className="flex">
                            <Link href="/pages/list-expenses" passHref>
                                <Button className="button bg-red-400 text-white p-3">
                                    <ArrowLeftIcon className="mr-2 h-4 w-4" />Despesas
                                </Button>
                            </Link>

                            <Link href="/pages/list-balances" passHref className="ml-1">
                                <Button className="button bg-green-600 text-white">
                                    Saldos<ArrowRightIcon className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </CardFooter>
                </Card>
            </form>
        </div>
    )
}
