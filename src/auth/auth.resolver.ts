import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SignInResponse } from './dto/signInResponse';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './guards/gql-auth-guard';
import { SignInInput } from './dto/signIn.input';
import { GoogleSignInInput } from './dto/googleSignIn.input';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => SignInResponse)
  @UseGuards(GqlAuthGuard)
  async signIn(
    @Args('signInInput') signInInput: SignInInput,
    @Context() context: any,
  ) {
    return await this.authService.signIn(context.user);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => SignInResponse)
  async signInWithGoogle(
    @Args('googleUser', { type: () => GoogleSignInInput })
    googleUser: GoogleSignInInput,
  ) {
    return await this.authService.signInWithGoogle(googleUser);
  }
}
