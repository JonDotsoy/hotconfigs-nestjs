import { Module } from "@nestjs/common";
import { create, string } from "hotconfigs";
import { CatsController } from "./cats/cats.controller.js";
import { HotconfigsService } from "./hotconfigs.service.js";

@Module({
  controllers: [CatsController],
  providers: [
    HotconfigsService.load(
      create({
        greeting: string({ summary: "greeting sent to /cats", default: "hello" }),
      }),
    ),
  ],
})
export class AppModule {}
