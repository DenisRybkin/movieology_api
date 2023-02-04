import { Response } from 'express';

class ContentController {
  getView(_, res: Response) {
    res.sendFile('src/views/index.html', {
      root: '.'
    });
  }
}

export const contentController = new ContentController();