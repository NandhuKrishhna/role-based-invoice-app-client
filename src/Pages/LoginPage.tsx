import { Button } from '@/Components/ui/button'
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/Components/ui/card'
import { Input } from '@/Components/ui/input'
import { Label } from '@/Components/ui/label'
import useLoginHook from '@/hooks/useLoginHook'
import { loginSchema, type LoginData } from '@/utils/types/error.types'
import React from 'react'
import toast, { LoaderIcon } from 'react-hot-toast';
import { z } from 'zod'
import { Eye, EyeOff } from "lucide-react"


const LoginPage: React.FC = () => {
    const [loginData, setLoginData] = React.useState({
        email: '',
        password: ''
    });
    const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);
    const [formErrors, setFormErrors] = React.useState<Partial<LoginData>>({});

    const { handleLogin, isLoginLoading } = useLoginHook();
    const handleOnChangeInput = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setLoginData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };
    const handleLoginSubmit = async () => {
        try {
            setFormErrors({});
            const parsedData = loginSchema.parse(loginData);
            await handleLogin(parsedData);
        } catch (err) {
            if (err instanceof z.ZodError) {
                const fieldErrors: Partial<LoginData> = {};
                err.errors.forEach((error) => {
                    const fieldName = error.path[0] as keyof LoginData;
                    fieldErrors[fieldName] = error.message;
                });
                setFormErrors(fieldErrors);
            } else {
                toast.error("Something went wrong");
            }
        }
    }
    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle className='text-2xl'>Login to your account</CardTitle>
                <CardDescription>
                    Enter your email below to login to your account
                </CardDescription>
                <CardAction>
                    <Button variant="link">Sign Up</Button>
                </CardAction>
            </CardHeader>
            <CardContent>
                <form>
                    <div className="flex flex-col gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                onChange={handleOnChangeInput}
                                name="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                                className='placeholder:text-gray-600 placeholder:text-sm'

                            />
                            {formErrors.email && (
                                <p className="text-sm text-red-500 font-medium">{formErrors.email}</p>
                            )}
                        </div>
                        <div className="grid gap-2 relative">

                            <Input
                                onChange={handleOnChangeInput}
                                name='password'
                                type={isPasswordVisible ? "password" : "text"}
                                required
                                placeholder='Enter your password' className='placeholder:text-gray-600 placeholder:text-sm' />
                            <span className='cursor-pointer text-gray-500  w-0 absolute right-7 top-2.5 hover:text-gray-600'>{isPasswordVisible ? <EyeOff size={17} onClick={() => setIsPasswordVisible(!isPasswordVisible)} /> : <Eye size={17} onClick={() => setIsPasswordVisible(!isPasswordVisible)} />}</span>


                        </div>
                        {formErrors.password && (
                            <p className="text-sm text-red-500 font-medium">{formErrors.password}</p>
                        )}
                    </div>
                </form>
            </CardContent>
            <CardFooter className="flex-col gap-2">
                <Button
                    onClick={handleLoginSubmit}
                    type="submit"
                    className="w-full cursor-pointer">
                    {isLoginLoading ? <LoaderIcon className='animate-spin' /> : "Login"}
                </Button>

            </CardFooter>
        </Card>
    )
}

export default LoginPage
