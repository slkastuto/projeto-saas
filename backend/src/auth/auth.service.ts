async register(dto: RegisterDto) {
  try {
    const { name, email, password } = dto;

    const userExists = await this.prisma.user.findUnique({
      where: { email },
    });

    if (userExists) {
      throw new BadRequestException('E-mail já cadastrado');
    }

    const company = await this.prisma.company.create({
      data: {
        name: 'Minha Empresa',
        slug: `empresa-${Date.now()}`,
      },
    });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'ADMIN',
        companyId: company.id,
      },
    });

    return {
      message: 'Conta criada com sucesso',
      userId: user.id,
    };
  } catch (error) {
    console.error('REGISTER ERROR 👉', error);
    throw error;
  }
}
