import { v4 as uuid } from "uuid";
import { Entity, EntityManager, Enum, Property, BlobType, OneToMany, Cascade, Collection, ManyToOne } from "@mikro-orm/core";
import SecurePassword from "secure-password";
import { registerEnumType, ObjectType, Field } from "type-graphql";
import { Base } from "./Base";
import { PasswordReset } from "./PasswordReset";
import type { Post } from "./Post";
import type { PostLike } from "./PostLike";
import type { Follow } from "./Follow";

const securePassword = new SecurePassword({
	memlimit: SecurePassword.MEMLIMIT_DEFAULT,
	opslimit: SecurePassword.OPSLIMIT_DEFAULT,
});

export enum Role {
    USER,
    MODERATOR,
    ADMIN,
  }

registerEnumType(Role, { name: "Role" });

@ObjectType()
@Entity()
export class User extends Base<User> {
	constructor(email: string) {
		super();
		this.email = email;
	}

	async setPasswordHash(newPassword: string) : Promise<void> {
		this.passwordHash = await securePassword.hash(Buffer.from(newPassword));
	}

	async checkPassword(password: string) : Promise<boolean> {
		const result = await securePassword.verify(
			Buffer.from(password),
        this.passwordHash!,
		);

		// The hash params used for the stored hash have since changed, so we should re-hash the password
		// to ensure that it is as secure as possible:
		if (result === SecurePassword.VALID_NEEDS_REHASH) {
			await this.setPasswordHash(password);
		}

		return (
			result === SecurePassword.VALID
        || result === SecurePassword.VALID_NEEDS_REHASH
		);
	}

	async createPasswordReset(em: EntityManager) {
		const pwReset = new PasswordReset(
			this,
			new Date(Date.now() + 3600 * 1000 * 72),
		);
		await em.persistAndFlush(pwReset);
		return pwReset;
	}

    @Field(() => Role)
    @Enum({ default: Role.USER })
    role!: Role;

    @Property({ type: BlobType, nullable: false })
    passwordHash!: Buffer;

    @Field({ nullable: true })
    @Property({ unique: true, nullable: false })
    email!: string;

    @Property({ unique: true, nullable: true })
    confirmToken?: string = uuid();

    @Field(() => Boolean, { defaultValue: false })
    @Property({ default: false })
    confirmed : boolean = false;

    @OneToMany(
    	() => PasswordReset,
    	(reset) => reset.user,
    	{ cascade: [Cascade.ALL] },
    )
	passwordResets = new Collection<PasswordReset>(this);
	
	@OneToMany('Post', 'user')
	posts = new Collection<Post>(this);

	@OneToMany('PostLike', 'fromUser')
	likedPosts = new Collection<PostLike>(this);

	@OneToMany('Follow', 'toUser')
	follows = new Collection<Follow>(this)

	@OneToMany('Follow', 'fromUser')
	followed = new Collection<Follow>(this)
}
