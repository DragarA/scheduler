import { ApiProperty } from "@nestjs/swagger";
import { Test } from "../../../generated/prisma/client";

export class TestResDto {
    @ApiProperty({ description: 'The ID of the test' })
    id: string;

    @ApiProperty({ description: 'The name of the test' })
    name: string;

    @ApiProperty({ description: 'The created at date of the test' })
    createdAt: Date;

    @ApiProperty({ description: 'The updated at date of the test' })
    updatedAt: Date;

    constructor(data: Test) {
        this.id = data.id;
        this.name = data.name;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
    }
}