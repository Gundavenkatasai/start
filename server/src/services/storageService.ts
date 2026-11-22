import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export interface UploadResult {
  url: string;
  filename: string;
  size: number;
}

export class StorageService {
  private localDir: string;

  constructor() {
    this.localDir = path.resolve(process.cwd(), process.env.STORAGE_LOCAL_DIR || './uploads');
    if (!fs.existsSync(this.localDir)) {
      fs.mkdirSync(this.localDir, { recursive: true });
    }
  }

  /**
   * Save a base64 encoded or string deliverable file locally
   */
  async saveFile(fileName: string, contentBuffer: Buffer): Promise<UploadResult> {
    const ext = path.extname(fileName) || '.pdf';
    const safeName = `${Date.now()}_${crypto.randomBytes(4).toString('hex')}${ext}`;
    const targetPath = path.join(this.localDir, safeName);

    fs.writeFileSync(targetPath, contentBuffer);

    return {
      url: `/uploads/${safeName}`,
      filename: safeName,
      size: contentBuffer.length,
    };
  }
}

export const storageService = new StorageService();
