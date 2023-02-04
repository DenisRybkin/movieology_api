import { Request } from 'express';

export type StreamParamsReqType = {
  magnet?: string;
  fileName?: string;
};

export interface IStreamRequest
  extends Omit<Request<StreamParamsReqType>, 'headers'> {
  headers: {};
}