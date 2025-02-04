import Link from "next/link"
import { Button } from "./ui/button";

const ErrorPage = () => {
    return (
        <div className="flex items-center min-h-screen px-4 py-12 sm:px-6 md:px-8 lg:px-12 xl:px-16 bg-background text-foreground">
            <div className="w-full space-y-6 text-center">
                <div className="space-y-3">
                    <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl text-primary">
                        Oops! Lost in Cyberspace
                    </h1>
                    <p className="text-muted-foreground">Looks like you've ventured into the unknown digital realm.</p>
                </div>
                <Link
                    href="/"
                    prefetch={false}
                >
                    <Button className="mt-4">
                        Return to website
                    </Button>
                </Link>
            </div>
        </div>
    )
}

export default ErrorPage;