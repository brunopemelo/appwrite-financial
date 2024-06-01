"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "next-auth/react";
import Link from 'next/link';

import { CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, StarFilledIcon, Cross1Icon, Pencil1Icon } from "@radix-ui/react-icons";
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface IContas {
    $id: string;
    contas: string;
    valor: string;
    parcelas: string;
}

interface ISaldos {
    $id: string;
    saldo: string;
    descricao: string;
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
    const [contas, setContas] = useState<IContas[]>([]);
    const [saldos, setSaldos] = useState<ISaldos[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [spinn, setSpinn] = useState(false);
    const [error, setError] = useState<string | null>(null);
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

        const fetchContas = async () => {
            setIsLoading(true);
            try {
                const response = await fetch("/api/contas");

                if (!response.ok) {
                    throw new Error("Falha ao buscar contas!");
                }
                const data = await response.json();
                setContas(data);
            } catch (error) {
                console.log("Error: ", error);
                setError("O servidor está com problemas no momento. Tente novamente mais tarde!");
            } finally {
                setIsLoading(false);
            }
        };

        fetchContas();

        const fetchSaldo = async () => {
            setIsLoading(true);
            try {
                const response = await fetch("/api/saldo");

                if (!response.ok) {
                    throw new Error("Falha ao buscar saldos!");
                }
                const data = await response.json();
                setSaldos(data);
            } catch (error) {
                console.log("Error: ", error);
                setError("O servidor está com problemas no momento. Tente novamente mais tarde!");
            } finally {
                setIsLoading(false);
            }
        };

        fetchSaldo();
    }, [router]);

    if (sessionClient) {
        return <SkeletonLoader />;
    }

    const handleDelete = async (id: string) => {
        setSpinn(true);
        try {
            await fetch(`/api/contas/${id}`, { method: "DELETE" });
            setContas((prevContas) => prevContas?.filter((i) => i.$id !== id));
        } catch (error) {
            setError("Falha ao deletar conta. Por favor, tente novamente!");
        } finally {
            setSpinn(false);
        }
    };

    const calcularValorTotal = () => {
        const valorTotal = contas.reduce((total, conta) => {
            const valorNumerico = parseFloat(conta.valor.replace(',', '.'));

            if (!isNaN(valorNumerico)) {
                return total + valorNumerico;
            } else {
                console.warn(`Valor numérico inválido encontrado: ${conta.valor}`);
                return total;
            }
        }, 0);

        return valorTotal.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };

    const calcularSaldoTotal = () => {
        const saldoTotal = saldos.reduce((total, conta) => {
            const valorNumerico = parseFloat(conta.saldo.replace('R$', '').replace('.', '').replace(',', '.'));

            if (!isNaN(valorNumerico)) {
                return total + valorNumerico;
            } else {
                console.warn(`Valor numérico inválido encontrado: ${conta.saldo}`);
                return total;
            }
        }, 0);

        const saldoTotalFormatado = saldoTotal.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

        return saldoTotalFormatado;
    };

    const calcularTotalGeral = () => {
        const saldoTotal = parseFloat(calcularSaldoTotal().replace('R$', '').replace(/\./g, '').replace(',', '.'));
        const valorTotal = parseFloat(calcularValorTotal().replace('R$', '').replace(/\./g, '').replace(',', '.'));

        if (isNaN(valorTotal) || isNaN(saldoTotal)) {
            console.warn('Valores numéricos inválidos encontrados ao calcular total geral');
            return 'R$ 0,00';
        }

        const totalGeral = saldoTotal - valorTotal;

        return totalGeral.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
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
                <p className="font-bold text-black text-lg">Carregando contas...</p>
            ) : contas?.length > 0 ? (
                <div className="p-6 w-full max-w-xl shadow-2xl rounded-xl bg-white">
                    <div style={{maxHeight: 600}} className="overflow-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-start text-black font-bold w-2/6">Descrição</TableHead>
                                    <TableHead className="text-center text-black font-bold w-1/6">Valor</TableHead>
                                    <TableHead className="text-center text-black font-bold w-1/6">Parcelas</TableHead>
                                    <TableHead className="text-center text-black font-bold w-1/12">Editar</TableHead>
                                    <TableHead className="text-center text-black font-bold w-1/12">Excluir</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {contas?.map((conta) => (
                                    <TableRow key={conta.$id}>
                                        <TableCell className="text-start w-2/6">{conta.contas}</TableCell>
                                        <TableCell className="text-center w-1/6">R$ {parseFloat(conta.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                                        <TableCell className="text-center w-1/6">{conta.parcelas}</TableCell>
                                        <TableCell className="text-center w-1/12">
                                            <div className="flex justify-center items-center">
                                                <Link href={`/pages/list-expenses/${conta.$id}`}>
                                                    <Pencil1Icon className="mr-2 h-4 w-4 cursor-pointer" />
                                                </Link>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center w-1/12">
                                            <div className="flex justify-center items-center">
                                                <Cross1Icon onClick={() => handleDelete(conta.$id)} className="mr-2 h-4 w-4 cursor-pointer" />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TableCell className="font-bold border-b">Despesas</TableCell>
                                    <TableCell colSpan={5} className="text-right text-red-500 font-bold border-b">{calcularValorTotal()}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-bold border-b">Saldo (<Link href="/pages/list-balances" className="text-blue-600 underline">Alterar Saldo</Link>)</TableCell>
                                    <TableCell colSpan={5} className="text-right text-green-600 font-bold border-b">{calcularSaldoTotal()}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="text-black font-bold">Resumo</TableCell>
                                    <TableCell colSpan={5} className="text-right text-black font-bold">{calcularTotalGeral()}</TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </div>

                    <CardFooter className="flex justify-between p-0 mt-5">
                        <Link href="/pages/create-expense" passHref>
                            <Button className="button bg-red-400 text-white p-3">
                                <ArrowLeftIcon className="mr-2 h-4 w-4" />Despesa
                            </Button>
                        </Link>

                        <Link href="/pages/add-balance" passHref className="ml-3">
                            <Button className="button bg-green-600 text-white">
                                <StarFilledIcon className="mr-2 h-4 w-4" />Saldo
                            </Button>
                        </Link>
                    </CardFooter>
                </div>
            ) : (
                <p className="font-bold">Não há despesas cadastradas!<Link href="/pages/create-expense" className="button bg-green-600 text-white p-2 rounded-md ml-2">Voltar</Link></p>
            )}
        </div>
    );
}
