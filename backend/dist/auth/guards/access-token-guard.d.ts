declare const AccesTokenGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class AccesTokenGuard extends AccesTokenGuard_base {
    handleRequest(err: any, user: any, info: any): any;
}
export {};
