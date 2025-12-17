import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty } from "class-validator";

export class UpdateMemberRoleDto {
  @ApiProperty({
    description: "The role of the member",
    enum: ["admin", "developer", "viewer"],
    example: "admin",
  })
  @IsEnum(["admin", "developer", "viewer"])
  @IsNotEmpty()
  role: "admin" | "developer" | "viewer";
}
