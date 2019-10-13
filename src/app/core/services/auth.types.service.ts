export enum AuthProvider {
	Email,
	Facebook
}

export interface User {

	name?: string;
	email: string;
	matricula: string;
	password: string;
	date?: Date;
	professor?: boolean;


}

export interface AuthOptions {

	isSignIn: boolean;
	provider: AuthProvider;
	user: User;
}