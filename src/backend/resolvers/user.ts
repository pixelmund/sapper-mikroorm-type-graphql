
import { IsEmail } from "class-validator";
import { Arg, createMethodDecorator, Field, FieldResolver, ForbiddenError, ID, InputType, Mutation, Query, Resolver, Root, UnauthorizedError } from "type-graphql";
import { PasswordReset, User } from "../db/entities/UserAndRelatedEntities";
import { em } from "../db/entityManager";

/**
 * Used to decorate a field that is only available for the current user.
 */
function CurrentUserOnly() {
    return createMethodDecorator<{user: any}>(async ({ root, context }, next) => {
      if (!context.user) {
        throw new UnauthorizedError();
      }
      if ((root as User).id !== context.user.id) {
        throw new ForbiddenError();
      }
      return next();
    });
}

@InputType()
class UserInputType {
    @IsEmail()
    @Field(() => String)
    email!: string;

    @Field(() => String, { nullable: true })
    password!: string

    @Field(() => String, { nullable: true })
    id?: string;
}

@Resolver(() => User)
export class UserResolver {
	@Query(() => [User])
	async users(): Promise<User[]> {
        const userRepo = em.getRepository(User);
        return await userRepo.findAll();
    }
    
	@Query(() => User, {nullable: true})
	async user(@Arg('id') id: string): Promise<User | null | undefined> {
        const userRepo = em.getRepository(User);
        return await userRepo.findOne({id});
    }

    @Mutation(() => User)
    async createUser(@Arg("input") input : UserInputType){
        const userRepo = em.getRepository(User);
        const user = new User(input.email);
        await user.setPasswordHash(input.password!);
        await userRepo.persistAndFlush(user)
        return user;
    }

    @Mutation(() => User, { nullable: true })
    async updateUser(@Arg("input") input : UserInputType){
        const userRepo = em.getRepository(User);
        const user = await userRepo.findOne({ id: input.id })
        if(!user){
           return null
        }
        if(input.email){
          user.email = input.email;
        }
        if(input.password){
          await user.setPasswordHash(input.password);
        }
        await userRepo.persistAndFlush(user)
        return user;
    }
    
    @CurrentUserOnly()
    @FieldResolver(() => [PasswordReset])
    async passwordResets(@Root() root: User) {
      await em.populate(root, ["passwordResets"]);
      return root.passwordResets;
    }
}
