import { Role } from "./Role";

export interface User{
	id: number;
	username: string;
	roles: Role[];
}