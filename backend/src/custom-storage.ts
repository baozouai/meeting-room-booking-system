import { diskStorage } from 'multer';
import { mkdirSync, existsSync } from 'fs';

export const storage = diskStorage({
  destination(_, __, cb) {
    if (!existsSync('uploads')) mkdirSync('uploads');

    cb(null, 'uploads');
  },
  filename(_, file, cb) {
    const uniqueFileName = [
      Date.now(),
      Math.round(Math.random() * 1e9),
      file.originalname,
    ].join('-');
    cb(null, uniqueFileName);
  },
});
