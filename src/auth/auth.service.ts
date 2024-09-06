import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { userPayload } from './jwt.strategy';
import { CreateUserDto } from './dto/create-user.dto';
import { LogUserDto } from './dto/log-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login({ authBody }: { authBody: LogUserDto }) {
    const { email, password } = authBody;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!existingUser) throw new Error('Email ou mot de passe invalide');

    const isPasswordValid = await this.isPasswordValid({
      password: password,
      hashedPassword: existingUser.password,
    });
    if (!isPasswordValid) throw new Error('Email ou mot de passe invalide');

    return this.authenticateUser({ userId: existingUser.id });
    //  const hashedPassword = await this.hashPassword({ password });
  }

  async register({ registerBody }: { registerBody: CreateUserDto }) {
    const { email, firstName, password } = registerBody;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser)
      throw new Error('Un compte existe déjà à cet adresse email.');

    const hashedPassword = await this.hashPassword({ password });
    const createdUser = await this.prisma.user.create({
      data: { email, password: hashedPassword, firstName },
    });

    return this.authenticateUser({ userId: createdUser.id });
  }

  private async hashPassword({ password }: { password: string }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
  }

  private async isPasswordValid({
    password,
    hashedPassword,
  }: {
    password: string;
    hashedPassword: string;
  }): Promise<boolean> {
    const isPasswordValid = await bcrypt.compare(password, hashedPassword);
    return isPasswordValid;
  }

  private authenticateUser({ userId }: userPayload) {
    const payload: userPayload = { userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
