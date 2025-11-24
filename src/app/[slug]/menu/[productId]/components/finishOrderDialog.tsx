"use client"
import { zodResolver } from "@hookform/resolvers/zod";
import { ConsumptionMethod } from "@prisma/client";
import { Loader2Icon } from "lucide-react";
import { useParams, useSearchParams } from "next/navigation";
import { useContext, useTransition } from "react";
import { useForm } from "react-hook-form";
import { PatternFormat } from 'react-number-format'
import { toast } from "sonner";
import { z } from "zod"

import { Button } from "@/components/ui/button";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input";

import { createOrder } from "../../actions/create-order";
import { CartContext } from "../../context/cart";
import { isValidCpf } from "../../helpers/nif";

const formSchema = z.object({
    name: z.string().trim().min(1, {
        message: 'Required'
    }),
    nif: z.string().trim().min(1, {
        message: 'Required'
    }).refine((value) => isValidCpf(value), {
        message: 'Invalid NIF'
    })
})

type FormSchema = z.infer<typeof formSchema>

interface FinishOrderButtonProps {
    open: boolean;
    onOpenChange: (open: boolean) => void
}

const FinishOrderDialog = ({ open, onOpenChange }: FinishOrderButtonProps) => {
    const { slug } = useParams<{ slug: string }>();
    const { products } = useContext(CartContext)
    const searchParams = useSearchParams()
    const [isPending, startTransition] = useTransition()
    const form = useForm<FormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            nif: "",
        },
        shouldUnregister: true,
    })
    const onSubmit = async (data: FormSchema) => {
        try {
            const consumptionMethod = searchParams.get("consumptionMethod") as ConsumptionMethod
            startTransition(async () => {
                await createOrder({
                    consumptionMethod,
                    customerCpf: data.nif,
                    customerName: data.name,
                    products,
                    slug,
                })
                onOpenChange(false)
                toast.success("Order completed successfully!")
            })
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            <DrawerTrigger asChild>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Complete Purchase</DrawerTitle>
                    <DrawerDescription>Enter your information below to complete.</DrawerDescription>
                </DrawerHeader>
                <div className="p-5">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter your name..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="nif"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>NIF</FormLabel>
                                        <FormControl>
                                            <PatternFormat placeholder="Enter your NIF..." format="###.###.###-##" customInput={Input} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <DrawerFooter>
                                <Button type="submit" variant="destructive" className="rounded-full" disabled={isPending}>{isPending && <Loader2Icon className="animate-spin" />}Submit</Button>
                                <DrawerClose asChild>
                                    <Button className="w-full rounded-full" variant="outline">Cancel</Button>
                                </DrawerClose>
                            </DrawerFooter>
                        </form>
                    </Form>
                </div>
            </DrawerContent>
        </Drawer>
    );
}

export default FinishOrderDialog;
