import type { FactoryProvider } from "@nestjs/common";
import type { ConfigsNodePending, ConfigsNodeReady, ConfigsShape } from "hotconfigs";

/**
 * Wraps an already-resolved `hotconfigs` node so it can be injected through
 * Nest's DI container. Built via `HotconfigsService.load(create(...))`, never
 * `new HotconfigsService(...)` directly, since it must await the node opening
 * before it can be provided.
 */
export class HotconfigsService<T extends ConfigsShape = ConfigsShape> {
  constructor(readonly configs: ConfigsNodeReady<T>) {}

  /**
   * Turns a pending `create(...)` node into a Nest `FactoryProvider` for
   * `HotconfigsService`, awaiting the node so every field is settled before
   * the provider resolves — e.g. `providers: [HotconfigsService.load(create(...))]`.
   */
  static load<T extends ConfigsShape>(
    node: ConfigsNodePending<T>,
  ): FactoryProvider<HotconfigsService<T>> {
    return {
      provide: HotconfigsService,
      useFactory: async () =>
        new HotconfigsService((await node) as unknown as ConfigsNodeReady<T>),
    };
  }
}
