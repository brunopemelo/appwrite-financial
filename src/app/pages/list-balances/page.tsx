"use client"

import Link from 'next/link';

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getSession } from "next-auth/react"

import { CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeftIcon, ArrowRightIcon, Cross1Icon, Pencil1Icon } from "@radix-ui/react-icons"
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

interface ISaldos {
    $id: string;
    descricao: string;
    saldo: string;
}

function SkeletonLoader() {
    return (
        <div>
            <div style={{ width: "100%", height: "100px", backgroundColor: "#eee" }}></div>
            <div style={{ width: "100%", height: "100px", backgroundColor: "#eee", marginTop: "10px" }}></div>
            <div style={{ width: "100%", height: "100px", backgroundColor: "#eee", marginTop: "10px" }}></div>
        </div>
    );
}

export default function Contas() {
    const [sessionClient, setSessionClient] = useState(true);
    const router = useRouter()
    const [saldos, setSaldos] = useState<ISaldos[]>([])
    const [spinn, setSpinn] = useState(false);
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

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

        const fetchSaldo = async () => {
            setIsLoading(true)
            try {
                const response = await fetch("/api/saldo")

                if (!response.ok) {
                    throw new Error("Falha ao buscar saldos!")
                }
                const data = await response.json()
                setSaldos(data)
            } catch (error) {
                console.log("Error: ", error)
                setError("O servidor está com problemas no momento. Tente novamente mais tarde!")
            } finally {
                setIsLoading(false)
            }
        }

        fetchSaldo()
    }, [router]);

    if (sessionClient) {
        return <SkeletonLoader />;
    }

    const handleDelete = async (id: string) => {
        setSpinn(true);
        try {
            await fetch(`/api/saldo/${id}`, { method: "DELETE" })
            setSaldos((prevSaldo) => prevSaldo?.filter((i) => i.$id !== id))
        } catch (error) {
            setError("Falha ao deletar saldo. Por favor, tente novamente!")
        } finally {
            setSpinn(false);
        }
    }

    const calcularSaldoTotal = () => {
        const saldoTotal = saldos.reduce((total, conta) => {
            // Remover "R$" e vírgula da string e converter para número
            const valorNumerico = parseFloat(conta.saldo.replace('R$', '').replace('.', '').replace(',', '.'));

            if (!isNaN(valorNumerico)) {
                return total + valorNumerico;
            } else {
                console.warn(`Valor numérico inválido encontrado: ${conta.saldo}`);
                return total;
            }
        }, 0);

        // Formatando o saldo total como moeda brasileira
        const saldoTotalFormatado = saldoTotal.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

        return saldoTotalFormatado;
    };


    return (
        <div className="h-screen flex justify-center items-center bg-zinc-100">
            {error && <p className="py-4 text-black font-bold">{error}</p>}

            {spinn && (
                <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-75 z-50">
                    <div className="spinner"></div>
                </div>
            )}

            {isLoading ? (
                <p className="font-bold text-black text-lg">Carregando saldo...</p>
            ) : saldos?.length > 0 ? (

                <div className="p-6 w-full max-w-xl shadow-2xl rounded-xl bg-white">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-start text-black font-bold w-2/6">Descrição</TableHead>
                                <TableHead className="text-start text-black font-bold w-1/6">Saldo</TableHead>
                                <TableHead className="text-center text-black font-bold w-1/12">Editar</TableHead>
                                <TableHead className="text-center text-black font-bold w-1/12">Excluir</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {saldos?.map((saldo) => (
                                <TableRow key={saldo.$id}>
                                    <TableCell className="text-start w-2/6">{saldo.descricao}</TableCell>
                                    <TableCell className="text-start w-1/6">
                                        {parseFloat(saldo.saldo.replace('R$', '').replace('.', '').replace(',', '.')).toLocaleString('pt-BR', {
                                            style: 'currency',
                                            currency: 'BRL',
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}
                                    </TableCell>
                                    <TableCell className="text-center w-1/12">
                                        <div className="flex justify-center items-center">
                                            <Link href={`/pages/list-balances/${saldo.$id}`}>
                                                <Pencil1Icon className="mr-2 h-4 w-4 cursor-pointer" />
                                            </Link>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center w-1/12">
                                        <div className="flex justify-center items-center">
                                            <Cross1Icon onClick={() => handleDelete(saldo.$id)} className="mr-2 h-4 w-4 cursor-pointer" />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TableCell className="font-bold border-b">Saldo Total</TableCell>
                                <TableCell colSpan={5} className="text-right text-green-600 font-bold border-b">{calcularSaldoTotal()}</TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>

                    <CardFooter className="flex justify-between p-0 mt-5">
                        <Link href="/pages/add-balance" passHref>
                            <Button className="button bg-green-600 text-white p-3">
                                <ArrowLeftIcon className="mr-2 h-4 w-4" />Saldo
                            </Button>
                        </Link>

                        <Link href="/pages/list-expenses" passHref className="ml-1">
                            <Button className="button bg-red-400 text-white">
                                Despesas<ArrowRightIcon className="mr-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </CardFooter>
                </div>
            ) : (
                <p className="font-bold">Não há saldos cadastrados!<Link href="/pages/add-balance" className="button bg-green-600 text-white p-2 rounded-md ml-2">Voltar</Link></p>
            )}
        </div>
    )
}
