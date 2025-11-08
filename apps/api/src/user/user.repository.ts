import { Injectable } from "@nestjs/common";
import { PrismaService } from "../common/database/prisma/prisma.service";
import { Test } from "../../generated/prisma/client";

@Injectable()
export class UserRepository {
    constructor(private readonly prisma: PrismaService) {}
    
    async findAll(): Promise<Test[]> {
        return this.prisma.test.findMany();
    }
}