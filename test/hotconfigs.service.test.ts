import "reflect-metadata";
import { describe, expect, test } from "bun:test";
import { Module } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { create, string } from "hotconfigs";
import { HotconfigsService } from "../src/hotconfigs.service.js";

describe("HotconfigsService.load(create(...))", () => {
  test("provides a resolved HotconfigsService to the module", async () => {
    const shape = {
      greeting: string({ summary: "greeting sent to consumers", default: "hello" }),
    };

    @Module({
      providers: [HotconfigsService.load(create(shape))],
    })
    class AppModule {}

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const hotconfigs = moduleRef.get<HotconfigsService<typeof shape>>(HotconfigsService);

    expect(hotconfigs).toBeInstanceOf(HotconfigsService);
    expect(hotconfigs.configs.greeting.get()).toBe("hello");

    await moduleRef.close();
  });
});
