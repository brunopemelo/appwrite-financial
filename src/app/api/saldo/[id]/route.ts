import client from "@/../lib/appwrite_client"
import { Databases } from "appwrite"
import { NextResponse } from "next/server"

const database = new Databases(client)

async function fetchSaldo(id: string) {
    try {
        const saldo = await database.getDocument(process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string, "Saldo", id)

        return saldo
    } catch (error) {
        console.error("Erro ao buscar saldo:", error)
        throw new Error("Falha ao buscar saldo")
    }
}

async function deleteSaldo(id: string) {
    try {
        const response = await database.deleteDocument(process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string, "Saldo", id)

        return response
    } catch (error) {
        console.error("Erro ao deletar saldo:", error)
        throw new Error("Falha ao deletar saldo")
    }
}

async function updateSaldo(id: string, data: { saldo: string, descricao: string }) {
    try {
        const response = await database.updateDocument(process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string, "Saldo", id, data)

        return response
    } catch (error) {
        console.error("Erro ao atualizar saldo:", error)
        throw new Error("Falha ao atualizar saldo")
    }
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const id = params.id;
        const saldo = await fetchSaldo(id)
        return NextResponse.json({ saldo })
    } catch (error) {
        return NextResponse.json(
            { error: "Falha ao buscar saldos" },
            { status: 500 }
        )
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        const id = params.id;
        await deleteSaldo(id)
        return NextResponse.json({ message: "Saldo deletado" })
    } catch (error) {
        return NextResponse.json(
            { error: "Falha ao deletar saldo" },
            { status: 500 }
        )
    }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const id = params.id;
        const saldo = await req.json()
        await updateSaldo(id, saldo)

        return NextResponse.json({ message: "Saldo atualizado" })
    } catch (error) {
        return NextResponse.json(
            { error: "Falha ao atualizar saldo" },
            { status: 500 }
        )
    }
}
