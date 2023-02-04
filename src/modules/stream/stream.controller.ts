import { NextFunction, Request, Response } from 'express';
import { streamService } from './stream.service';
import { FileType } from './types/file.type';
import { StreamStateType } from './types/streamState.type';
import { IStreamRequest, StreamParamsReqType } from './types/paramsReq.type';
import { CatchErrors } from '../../decorators/catch-errors.decorator';
import { ApiError } from '../../exceptions/api-error.exception';

class StreamController {
  @CatchErrors()
  getStats(
    req: Request,
    res: Response,
    next: NextFunction
  ): Response<StreamStateType> {
    const result = { ...streamService.getState };
    return res.status(200).send(result);
  }

  @CatchErrors()
  async addToDownload(
    req: IStreamRequest,
    res: Response,
    next: NextFunction
  ): Promise<Response<FileType[]>> {
    const magnet = req.params.magnet;
    const result = await streamService.addToDownload(magnet);
    return res.status(200).send(result);
  }

  @CatchErrors()
  async streamFile(
    req: Request<StreamParamsReqType>,
    res: Response,
    next: NextFunction
  ): Promise<Response<undefined>> {
    const {
      params: { magnet, fileName },
      headers: { range }
    } = req;
    if (!range)
      throw new ApiError(
        416,
        'Range is not defined, please make request from HTML5 Player'
      );

    const { stream, chunkInfo } = await streamService.createStream(
      magnet,
      fileName,
      range
    );

    const headers = {
      'Content-Range': `bytes ${chunkInfo.start}-${chunkInfo.end}/${chunkInfo.fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunkInfo.chunkSize,
      'Content-Type': 'video/mp4'
    };

    res.writeHead(206, headers);

    stream.pipe(res);
    stream.on('error', err => {
      next(new ApiError(500, 'an error was occurred when streaming', [err]));
    });
    return undefined;
  }
}

export const streamController = new StreamController();
