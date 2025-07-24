import { db } from './db';
import { MenuConfig } from './types';

export const menuService = {
  async getAll(): Promise<MenuConfig[]> {
    return db.menuConfigs.orderBy('createdAt').reverse().toArray();
  },

  async getById(id: string): Promise<MenuConfig | undefined> {
    return db.menuConfigs.get(Number(id));
  },

  async searchByVersion(version: string): Promise<MenuConfig[]> {
    return db.menuConfigs
      .where('version')
      .startsWithIgnoreCase(version)
      .reverse()
      .sortBy('createdAt');
  },

  async add(config: Omit<MenuConfig, 'id' | 'createdAt' | 'updatedAt'>): Promise<number> {
    const now = new Date();
    return db.menuConfigs.add({
      ...config,
      createdAt: now,
      updatedAt: now
    });
  },

  async update(id: string, config: Partial<MenuConfig>): Promise<void> {
    await db.menuConfigs.update(Number(id), {
      ...config,
      updatedAt: new Date()
    });
  },

  async delete(id: string): Promise<void> {
    await db.menuConfigs.delete(Number(id));
  },

  async deleteByVersion(version: string): Promise<void> {
    const configs = await this.searchByVersion(version);
    const ids = configs.map(c => c.id!);
    await db.menuConfigs.bulkDelete(ids);
  },

  async exportAll(): Promise<MenuConfig[]> {
    return this.getAll();
  },

  async importConfigs(configs: MenuConfig[]): Promise<void> {
    await db.menuConfigs.bulkAdd(configs.map(config => ({
      ...config,
      id: undefined
    })));
  }
};