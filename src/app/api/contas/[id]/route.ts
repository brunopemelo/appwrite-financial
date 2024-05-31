import client from "@/../lib/appwrite_client"
import { Databases } from "appwrite"
import { NextResponse } from "next/server"

const database = new Databases(client)

async function fetchContas(id: string) {
    try {
        const contas = await database.getDocument(process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string, "Contas", id)

        return contas
    } catch (error) {
        console.error("Erro ao buscar contas:", error)
        throw new Error("Falha ao buscar contas")
    }
}

async function deleteContas(id: string) {
    try {
        const response = await database.deleteDocument(process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string, "Contas", id)

        return response
    } catch (error) {
        console.error("Erro ao deletar conta:", error)
        throw new Error("Falha ao deletar conta")
    }
}

async function updateContas(id: string, data: { contas: string, valor: string, parcelas: string }) {
    try {
        const response = await database.updateDocument(process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string, "Contas", id, data)

        return response
    } catch (error) {
        console.error("Erro ao atualizar conta:", error)
        throw new Error("Falha ao atualizar conta")
    }
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const id = params.id;
        const contas = await fetchContas(id)
        return NextResponse.json({ contas })
    } catch (error) {
        return NextResponse.json(
            { error: "Falha ao buscar contas" },
            { status: 500 }
        )
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        const id = params.id;
        await deleteContas(id)
        return NextResponse.json({ message: "Conta deletada" })
    } catch (error) {
        return NextResponse.json(
            { error: "Falha ao deletar conta" },
            { status: 500 }
        )
    }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const id = params.id;
        const contas = await req.json()
        await updateContas(id, contas)

        return NextResponse.json({ message: "Conta atualizada" })
    } catch (error) {
        return NextResponse.json(
            { error: "Falha ao atualizar conta" },
            { status: 500 }
        )
    }
}
