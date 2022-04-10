export interface JwtToken{
	sub: string;
	exp: string;
	iat: string;
	roles: {authority: string}[];
}