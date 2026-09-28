import { Controller, Get } from "@nestjs/common";
import { HotconfigsService } from "../hotconfigs.service.js";

@Controller("cats")
export class CatsController {
  constructor(private readonly hotconfigs: HotconfigsService) {}

  @Get()
  findAll() {
    return { greeting: (this.hotconfigs.configs as any).greeting.get() };
  }
}
