import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

const handler = NextAuth({
    pages: {
        signIn: "/"
    },
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                usuario: { label: "Usuário", type: "usuario" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials) {
                    return null
                }

                if (credentials.usuario === "bruno" && credentials.password === "123123") {
                    return {
                        id: "1",
                        name: "Bruno",
                        usuario: "bruno"
                    }
                }

                return null
            }
        })
    ]
})

export { handler as GET, handler as POST }
