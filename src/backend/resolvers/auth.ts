import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { Context, FieldErrors } from "../types";
import { IsEmail, MinLength, MaxLength } from "class-validator";
import { PasswordReset } from "../db/entities/PasswordReset";
import { User } from "../db/entities/User";
import { em } from "../db/entityManager";
import {
  AUTH_COOKIE_NAME,
  AUTH_COOKIE_VALUE,
  SESSION_NAME,
} from "../../config";

const timeOut = (timeout: number = 400) =>
  new Promise((resolve) => setTimeout(resolve, timeout));

@InputType()
export class UserInput {
  @Field()
  @IsEmail()
  email!: string;

  @Field()
  @MinLength(5)
  @MaxLength(120)
  password!: string;
}

@ObjectType()
export class AuthResponse {
  @Field()
  success!: boolean;

  @Field(() => User, { nullable: true })
  user?: User;

  @Field(() => [FieldErrors], { nullable: true })
  errors?: FieldErrors[];
}

@Resolver()
export class AuthResolver {
  @Query(() => User, { nullable: true })
  async me(@Ctx() { user }: Context) {
    if (!user) {
      return null;
    }

    return user;
  }

  @Mutation(() => AuthResponse)
  async login(
    @Ctx() { ctx: { req, res }, user: uuid }: Context,
    @Arg("input") { email, password }: UserInput
  ): Promise<AuthResponse> {
    if (uuid) {
      return {
        success: false,
        errors: [{ field: "auth", message: "Already logged in" }],
      };
    }
    const userRepo = em.getRepository(User);
    const user = await userRepo.findOne({
      email,
    });
    if (!user) {
      return {
        success: false,
        errors: [
          {
            field: "email",
            message: "No user with given email found.",
          },
        ],
      };
    }
    if (!user.confirmed) {
      return {
        success: false,
        errors: [
          {
            field: "user",
            message:
              "You need to confirm your email address before logging in.",
          },
        ],
      };
    }
    const result = await user.checkPassword(password);
    if (!result) {
      return {
        success: false,
        errors: [
          {
            field: "password",
            message: "Passwords doesn't match our records",
          },
        ],
      };
    }

    //@ts-ignore
    req.session.userId = user.id;

    res.cookie(AUTH_COOKIE_NAME, AUTH_COOKIE_VALUE(user.role), {
      httpOnly: false,
      signed: false,
      sameSite: "strict",
    });

    await timeOut(500);

    return {
      success: true,
      user,
    };
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() { ctx: { res, req } }: Context) {
    //@ts-ignore
    req.session = null;
    res.cookie(SESSION_NAME, null, { maxAge: -1 });
    res.cookie(AUTH_COOKIE_NAME, "0", {
      httpOnly: false,
      signed: false,
      sameSite: "strict",
    });
    return true;
  }

  @Mutation(() => AuthResponse)
  async register(
    @Ctx() { user: uid }: Context,
    @Arg("input") { email, password }: UserInput
  ): Promise<AuthResponse> {
    if (uid) {
      return {
        success: false,
        errors: [{ field: "user", message: "You are already logged in" }],
      };
    }

    const exitsUserWithEmail = await em.findOne(User, { email });

    if (exitsUserWithEmail) {
      return {
        success: false,
        errors: [{ field: "email", message: "Email already in use" }],
      };
    }

    const user = new User(email);

    await user.setPasswordHash(password);
    await em.persistAndFlush(user);

    // TODO: Send an email with the confirmation link
    return {
      success: true,
      user,
    };
  }

  @Mutation(() => AuthResponse)
  async forgotPassword(@Arg("email") email: string): Promise<AuthResponse> {
    const user = await em.findOne(User, { email });
    if (!user) {
      return {
        success: false,
        errors: [{ field: "email", message: "Email doesn't exist" }],
      };
    }
    // TODO: Send an email with the password reset id
    await user.createPasswordReset(em);

    return {
      success: true,
    };
  }

  @Mutation(() => AuthResponse)
  async resetPassword(
    @Arg("id") id: string,
    @Arg("newPassword") newPassword: string
  ): Promise<AuthResponse> {
    const pwresetRepo = em.getRepository(PasswordReset);
    const passwordReset = await pwresetRepo.findOne(
      {
        expiresAt: { $gte: new Date(Date.now()) },
        id,
      },
      ["user"]
    );
    if (!passwordReset) {
      return {
        success: false,
        errors: [
          {
            field: "passwordReset",
            message: "Cannot find a password reset for your account",
          },
        ],
      };
    }
    pwresetRepo.remove(passwordReset);
    await passwordReset.user?.setPasswordHash(newPassword);
    await em.flush();
    return {
      success: true,
      user: passwordReset.user!
    };
  }

  @Mutation(() => AuthResponse)
  async confirmUser(
    @Arg("confirmToken") confirmToken: string
  ): Promise<AuthResponse> {
    const userRepo = em.getRepository(User);
    const user = await userRepo.findOne({ confirmToken });
    if (!user) {
      return {
        success: false,
        errors: [
          {
            field: "confirmToken",
            message:
              "Cannot find a account associated with your confirmation token.",
          },
        ],
      };
    }
    if (user.confirmed) {
      return {
        success: false,
        errors: [
          {
            field: "confirmed",
            message: "You cannot confirm your account twice.",
          },
        ],
      };
    }
    user.confirmed = true;
    await userRepo.persistAndFlush(user);
    return {
      success: true,
    };
  }
}
