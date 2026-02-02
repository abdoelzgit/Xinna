"use client"

import * as React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Field,
    FieldGroup,
    FieldLabel,
    FieldDescription,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { registerCustomer } from "@/lib/actions/customer-actions"
import { IconLoader2 } from "@tabler/icons-react"

export function RegisterForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const [formData, setFormData] = useState({
        nama_pelanggan: "",
        email: "",
        katakunci: "",
        no_telp: "",
        alamat1: "",
    })
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.nama_pelanggan || !formData.email || !formData.katakunci) {
            toast.error("Please fill in all required fields", {
                description: "Name, Email, and Password are required.",
            })
            return
        }

        setIsLoading(true)

        try {
            const result = await registerCustomer(formData)

            if (result.error) {
                toast.error("Registration Failed", {
                    description: result.error,
                })
            } else {
                toast.success("Registration Successful", {
                    description: "Your account has been created. Please log in.",
                })
                router.push("/login")
            }
        } catch (err) {
            toast.error("System Error", {
                description: "An error occurred while trying to register.",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className={cn("flex flex-col gap-3", className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
                    <CardDescription>
                        Enter your details to register as a customer
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="nama_pelanggan">Full Name</FieldLabel>
                                <Input
                                    id="nama_pelanggan"
                                    placeholder="John Doe"
                                    value={formData.nama_pelanggan}
                                    onChange={(e) => setFormData({ ...formData, nama_pelanggan: e.target.value })}
                                    required
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="katakunci">Password</FieldLabel>
                                <Input
                                    id="katakunci"
                                    type="password"
                                    value={formData.katakunci}
                                    onChange={(e) => setFormData({ ...formData, katakunci: e.target.value })}
                                    required
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="no_telp">Phone Number (Optional)</FieldLabel>
                                <Input
                                    id="no_telp"
                                    placeholder="08123456789"
                                    value={formData.no_telp}
                                    onChange={(e) => setFormData({ ...formData, no_telp: e.target.value })}
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="alamat1">Address (Optional)</FieldLabel>
                                <Input
                                    id="alamat1"
                                    placeholder="Jl. Raya No. 123"
                                    value={formData.alamat1}
                                    onChange={(e) => setFormData({ ...formData, alamat1: e.target.value })}
                                />
                            </Field>
                            <Field>
                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Registering...
                                        </>
                                    ) : "Create Account"}
                                </Button>
                                <FieldDescription className="text-center">
                                    Already have an account? <a href="/login" className="underline underline-offset-4">Login</a>
                                </FieldDescription>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
            <FieldDescription className="px-6 text-center text-xs text-muted-foreground">
                By clicking continue, you agree to our <a href="#" className="underline underline-offset-4">Terms of Service</a>{" "}
                and <a href="#" className="underline underline-offset-4">Privacy Policy</a>.
            </FieldDescription>
        </div>
    )
}
