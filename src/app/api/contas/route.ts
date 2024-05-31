import client from "@/../lib/appwrite_client"
import { Databases, ID, Query } from "appwrite"
import { NextResponse } from "next/server"

const database = new Databases(client)

async function createContas(data: { contas: string, valor: string, parcelas: string }) {
    try {
        const response = await database.createDocument(process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string, "Contas", ID.unique(), data)

        return response
    } catch (error) {
        console.error("Erro ao criar conta", error)
        throw new Error("Falha ao criar conta")
    }
}

async function fetchContas() {
    try {
        const response = await database.listDocuments(process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string, "Contas", [Query.orderDesc("$createdAt")])

        return response.documents
    } catch (error) {
        console.error("Erro ao buscar contas", error)
        throw new Error("Falha ao buscar contas")
    }
}

export async function POST(req: Request) {
    try {
        const { contas, valor, parcelas } = await req.json()
        const data = { contas, valor, parcelas }
        const response = await createContas(data)
        return NextResponse.json({ message: "Conta criada" })
    } catch (error) {
        return NextResponse.json({
            error: "Falha ao criar conta"
        },
            { status: 500 }
        )
    }
}

export async function GET() {
    try {
        const contas = await fetchContas()
        return NextResponse.json(contas)
    } catch (error) {
        return NextResponse.json({
            error: "Falha ao buscar contas"
        },
            { status: 500 }
        )
    }
}
