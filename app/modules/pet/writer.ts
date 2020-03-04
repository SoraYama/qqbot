import path from 'path';
import fs from 'fs-extra';

interface PetData {
  pet: {
    name: string;
    weight: number;
  };
  user: {
    [key: number]: {
      feedTotal: number;
      feedRecord: {
        [key: string]: number[];
      };
    };
  };
}

const initData: PetData = {
  pet: {
    name: '兔子',
    weight: 0,
  },
  user: {},
};

class Writer {
  private fileRoot = path.join(global.APP_PATH, 'app', 'modules', 'assets', 'pet');

  private petFeedFile = 'feed.json';

  public data = initData;

  async readFile(fileName: string = this.petFeedFile) {
    try {
      const filePath = path.join(this.fileRoot, fileName);
      const isExist = await fs.pathExists(filePath);
      if (!isExist) {
        await fs.outputJSON(filePath, initData);
        return initData;
      } else {
        this.data = await fs.readJSON(filePath);
        return this.data;
      }
    } catch (e) {
      console.error(e);
      return initData;
    }
  }

  async syncFile(data: PetData, fileName: string = this.petFeedFile) {
    try {
      const filePath = path.join(this.fileRoot, fileName);
      this.data = data;
      await fs.writeJSON(filePath, data);
    } catch (e) {
      console.error(e);
    }
  }
}

export default new Writer();
