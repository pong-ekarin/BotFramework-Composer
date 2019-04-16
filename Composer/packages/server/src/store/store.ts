import fs from 'fs';
import path from 'path';

import initData from './data.template.json';

const dataStorePath = path.join(__dirname, 'data.json');

// create data.json if not exits
if (!fs.existsSync(dataStorePath)) {
  fs.writeFileSync(dataStorePath, JSON.stringify(initData, null, 2) + '\n');
}

interface KVStore {
  get(key: string): any;
  set(key: string, value: any): void;
}

class JsonStore implements KVStore {
  private data: any;
  private filePath: string;

  get = (key: string): any => {
    if (key in this.data) {
      return this.data[key];
    } else {
      throw Error(`no such key ${key} in store`);
    }
  };

  set = (key: string, value: any): void => {
    this.data[key] = value;
    this.flush();
  };

  flush = () => {
    fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2) + '\n');
  };

  constructor(jsonFilePath: string) {
    this.filePath = path.resolve(jsonFilePath);
    this.data = JSON.parse(fs.readFileSync(this.filePath).toString());
  }
}

export const Store = new JsonStore(dataStorePath);
