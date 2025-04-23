import { useMutation } from '@tanstack/react-query';
import { API_ROUTES } from '@constants/routes';
import { useToast } from "@/components/ui/use-toast";

/**
 * Response structure from the registration API.
 */
interface RegisterResponse {
    success: boolean;
    message: string;
}

/**
 * Parameters required for user registration.
 */
interface RegisterParams {
    username: string;
    email: string;
    password: string;
}

/**
 * Custom hook for user registration.
 * 
 * @returns An object containing the registerMutation function for user registration.
 */
const useRegister = () => {
    const { toast } = useToast();

    const registerMutation = useMutation<RegisterResponse, Error, RegisterParams>(
        async ({ username, email, password }) => {
            const response = await fetch(API_ROUTES.POST_REGISTER_USER, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });

            const text = await response.text(); // Read response text

            if (!response.ok) {
                let errorMessage = "Something went wrong!";
                
                try {
                    const errorData = JSON.parse(text);
                    errorMessage = errorData.message || errorMessage;
                } catch (error) {
                    console.error("❌ Error parsing response:", text);
                }

                throw new Error(errorMessage);
            }

            return JSON.parse(text) as RegisterResponse;
        },
        {
            onSuccess: (data) => {
                toast({
                    title: "✅ Success!",
                    description: data.message || "Your account has been registered successfully.",
                });
            },
            onError: (error) => {
                console.error("❌ Mutation Error:", error);
                toast({
                    title: "❌ Error",
                    description: error.message,
                    variant: "destructive",
                });
            }
        }
    );

    return registerMutation;
};

export default useRegister;
