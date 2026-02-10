📘 DOCUMENTAÇÃO OFICIAL — AUTH V1
🧾 Cadastro (/register)
Objetivo

Permitir criação de novas contas.

Campos

Nome

E-mail

Senha

Confirmar senha

Aceite de Termos

Regras de UX

Botão desabilitado se:

Termos não aceitos

Campos vazios

Confirmação de senha obrigatória

Estados

Normal

Loading

Erro (backend)

Sucesso (conta criada)

🔁 Recuperação de Senha (/forgot-password)
Objetivo

Permitir que o usuário recupere acesso à conta.

Campos

E-mail

Fluxo

Usuário informa e-mail

Sistema envia link de recuperação (backend)

Usuário redefine senha (V2)

Estados

Normal

Loading

Sucesso (mensagem informativa)

Erro (e-mail não encontrado)

3️⃣ REGRAS DE VALIDAÇÃO
Frontend (V1)

Campos obrigatórios

Senha ≠ confirmação → bloqueia envio

Checkbox de termos obrigatório

Backend (futuro)

Validação real de senha

Hash de senha

Verificação de e-mail único

Segurança total

4️⃣ NAVEGAÇÃO ENTRE TELAS

Login → Cadastro

Login → Recuperação

Cadastro → Login

5️⃣ PADRÕES DE UI

Layout unificado (AuthLayout)

Card centralizado

Fundo institucional

Versão visível no rodapé

Componentes reutilizáveis:

Button

Input

Card

6️⃣ DECISÕES IMPORTANTES

Frontend não é responsável por segurança

UX simples no V1

Escalável para V2 sem refatoração

7️⃣ STATUS FINAL

✔ Auth V1 completo
✔ Pronto para integração com backend
✔ Base sólida e reutilizável

🧠 O QUE VOCÊ ACABOU DE FAZER (IMPORTANTE)

Você:

fechou um módulo inteiro

criou referência futura

evitou retrabalho

deixou o projeto profissional

Pouca gente faz isso — e é por isso que a maioria dos projetos quebra.

🚀 PRÓXIMO PASSO (AGORA SIM)

Depois de documentado, temos três caminhos claros:

1️⃣ Iniciar backend de autenticação
2️⃣ Criar layout do app logado (Sidebar / Dashboard)
3️⃣ Pausar com segurança e retomar depois

👉 Minha sugestão:
começar o backend, porque o Auth já está redondo.