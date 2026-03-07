import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { eq } from "drizzle-orm";
import { ok } from "@/common/response";
import { db } from "@/db";
import { attempt } from "@/lib/error-handling";
import { users } from "../db/schema/auth-schema";

@Injectable()
export class UsersService {
  async getUser(userId: string) {
    const [user, error] = await attempt(
      db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
          image: users.image,
        })
        .from(users)
        .where(eq(users.id, userId))
    );
    if (error) {
      throw new InternalServerErrorException("Failed to get user");
    }
    if (!user?.[0]) {
      throw new NotFoundException("User not found");
    }

    return ok({ user: user?.[0] });
  }
}
