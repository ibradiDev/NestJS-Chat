import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Vous devez fournir une adresse email valide.' })
  email: string;

  @IsNotEmpty()
  @MinLength(6, {
    message: 'Le mot de passe doit contenir au moins 8 caracteres.',
  })
  password: string;

  @IsString({ message: 'Vous devez fournir un prenom.' })
  firstName: string;
}
