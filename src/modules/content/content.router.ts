import { Router } from 'express';
import { contentController } from './content.controller';
import { contentUris } from '../../constants/uri.keys';

export const contentRouter: Router = Router();

contentRouter.get(contentUris.boostrap, contentController.getView);