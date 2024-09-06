import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LogUserDto {
  @IsEmail({}, { message: 'Vous devez fournir une adresse email valide.' })
  email: string;

  @IsNotEmpty()
  @MinLength(6, {
    message: 'Le mot de passe doit contenir au moins 8 caracteres.',
  })
  password: string;
}
