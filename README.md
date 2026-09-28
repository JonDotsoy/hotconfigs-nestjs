# hotconfigs-nestjs

NestJS integration for [`hotconfigs`](https://github.com/JonDotsoy/configs) — provide a
`create(...)` config node through Nest's DI container via `HotconfigsService`.

```ts
import { Module } from "@nestjs/common";
import { create, string } from "hotconfigs";
import { HotconfigsService } from "hotconfigs-nestjs";

@Module({
  providers: [
    HotconfigsService.load(
      create({
        greeting: string({ summary: "greeting sent to consumers", default: "hello" }),
      }),
    ),
  ],
})
export class AppModule {}
```

Inject `HotconfigsService` anywhere in the module to read the resolved config:

```ts
constructor(private readonly hotconfigs: HotconfigsService) {}
```

## Development

This project was scaffolded with `bun init`.

```bash
bun install
bun test
```
