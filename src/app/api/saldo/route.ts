import client from "@/../lib/appwrite_client"
import { Databases, ID, Query } from "appwrite"
import { NextResponse } from "next/server"

const database = new Databases(client)

async function createSaldo(data: { saldo: string, descricao: string }) {
    try {
        const response = await database.createDocument(process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string, "Saldo", ID.unique(), data)

        return response
    } catch (error) {
        console.error("Erro ao criar saldo", error)
        throw new Error("Falha ao criar saldo")
    }
}

async function fetchSaldo() {
    try {
        const response = await database.listDocuments(process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string, "Saldo", [Query.orderDesc("$createdAt")])

        return response.documents
    } catch (error) {
        console.error("Erro ao buscar saldo", error)
        throw new Error("Falha ao buscar saldo")
    }
}

export async function POST(req: Request) {
    try {
        const { saldo, descricao } = await req.json()
        const data = { saldo, descricao }
        const response = await createSaldo(data)
        return NextResponse.json({ message: "Saldo criado" })
    } catch (error) {
        return NextResponse.json({
            error: "Falha ao criar saldo"
        },
            { status: 500 }
        )
    }
}

export async function GET() {
    try {
        const saldo = await fetchSaldo()
        return NextResponse.json(saldo)
    } catch (error) {
        return NextResponse.json({
            error: "Falha ao buscar saldo"
        },
            { status: 500 }
        )
    }
}
