import { Router } from 'express';
import { streamController } from './stream.controller';
import { streamUris } from '../../constants/uri.keys';

export const streamRouter: Router = Router();

streamRouter.get(
  streamUris.stats,
  streamController.getStats.bind(streamController)
);
streamRouter.get(
  streamUris.add_magnet,
  streamController.addToDownload.bind(streamController)
);
streamRouter.get(
  streamUris.stream_magnet_fileName,
  streamController.streamFile.bind(streamController)
);