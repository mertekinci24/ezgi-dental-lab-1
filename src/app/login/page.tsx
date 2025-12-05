import { signIn } from '@/auth';

export default function LoginPage() {
    return (
        <form
            action={async () => {
                "use server"
                await signIn("credentials")
            }}
        >
            <button type="submit">Sign in with Mock User</button>
        </form>
    )
}
