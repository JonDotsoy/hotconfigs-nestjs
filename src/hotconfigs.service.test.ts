import "reflect-metadata";
import { describe, expect, test } from "bun:test";
import { Module } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { create, string } from "hotconfigs";
import { CatsController } from "./cats/cats.controller.js";
import { HotconfigsService } from "./hotconfigs.service.js";

describe("HotconfigsService.load(create(...))", () => {
  test("provides a resolved HotconfigsService to the module", async () => {
    const shape = {
      greeting: string({ summary: "greeting sent to /cats", default: "hello" }),
    };

    @Module({
      controllers: [CatsController],
      providers: [HotconfigsService.load(create(shape))],
    })
    class AppModule {}

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const hotconfigs = moduleRef.get<HotconfigsService<typeof shape>>(HotconfigsService);

    expect(hotconfigs).toBeInstanceOf(HotconfigsService);
    expect(hotconfigs.configs.greeting.get()).toBe("hello");

    const catsController = moduleRef.get(CatsController);
    expect(catsController.findAll()).toEqual({ greeting: "hello" });

    await moduleRef.close();
  });
});
