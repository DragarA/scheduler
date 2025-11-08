import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Test, User, UserStatus } from "../../../generated/prisma/client";

export class UserResDto {
    @ApiProperty({ description: 'The ID of the user' })
    id: number;

    @ApiPropertyOptional({ description: 'The first name of the user' })
    firstName?: string | null;

    @ApiPropertyOptional({ description: 'The last name of the user' })
    lastName?: string | null;

    @ApiProperty({ description: 'The email of the user' })
    email: string;

    @ApiProperty({ description: 'The status of the user' })
    status: UserStatus;

    @ApiProperty({ description: 'The clerk ID of the user' })
    clerkId: string;

    constructor(data: User) {
        this.id = data.id;
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.email = data.email;
        this.status = data.status;
        this.clerkId = data.clerkId;
    }
}