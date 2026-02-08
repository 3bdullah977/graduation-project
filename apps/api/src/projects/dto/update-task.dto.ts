import { ApiProperty } from "@nestjs/swagger";
import {
  IsDate,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from "class-validator";

export const TaskStatus = ["todo", "in_progress", "done"] as const;

export type TaskStatus = (typeof TaskStatus)[number];

export class UpdateTaskDto {
  @ApiProperty({
    description: "The name of the task (max 255 characters)",
    example: "Task Name",
  })
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(255)
  name?: string;

  @ApiProperty({
    description: "The status of the task (todo, in_progress, done)",
    example: "todo",
  })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @ApiProperty({
    description: "The priority of the task",
    example: 0,
  })
  @IsInt()
  @Min(0)
  @Max(2)
  @IsOptional()
  priority?: number;

  @ApiProperty({
    description: "The description of the task (max 255 characters)",
    example: "Task Description",
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  description?: string;

  @ApiProperty({
    description: "The assignee of the task",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @IsString()
  @IsOptional()
  assigneeId?: string;

  @ApiProperty({
    description: "The due date of the task",
    example: "2021-01-01",
  })
  @IsDate()
  @IsOptional()
  dueDate?: Date;
}
