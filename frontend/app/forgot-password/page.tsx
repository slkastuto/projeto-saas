import { AuthLayout } from "@/components/auth/AuthLayout";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Mail } from "lucide-react";

export default function ForgotPasswordPage() {
  return (
    <AuthLayout>
      <Card className="w-full max-w-md">
        <h1 className="text-xl font-semibold text-gray-800 text-center mb-1">
          Esqueceu sua senha?
        </h1>

        <p className="text-sm text-gray-500 text-center mb-6">
          Informe seu e-mail e enviaremos um link para redefinir sua senha.
        </p>

        <form className="space-y-4">
          <Input
            label="E-mail"
            placeholder="seuemail@email.com"
            icon={<Mail size={18} />}
          />

          <Button>
            Enviar link de recuperação
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          Lembrou da senha?{" "}
          <a href="/login" className="text-green-600 hover:underline">
            Voltar para o login
          </a>
        </div>
      </Card>
    </AuthLayout>
  );
}
