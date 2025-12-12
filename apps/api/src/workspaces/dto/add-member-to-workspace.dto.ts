import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class AddMemberToWorkspaceDto {
  @ApiProperty({
    description: "The ID of the user to add to the workspace",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: "The role of the user in the workspace",
    example: "admin",
    enum: ["admin", "developer", "viewer"],
  })
  @IsString()
  @IsNotEmpty()
  role: "admin" | "developer" | "viewer";
}
