import Dexie, { Table } from 'dexie';
import { MenuConfig } from './types';

export class MenuDatabase extends Dexie {
  menuConfigs!: Table<MenuConfig>;

  constructor() {
    super('MenuDatabase');
    this.version(1).stores({
      menuConfigs: '++id, version, name, createdAt, updatedAt',
    });
  }
}

export const db = new MenuDatabase();
