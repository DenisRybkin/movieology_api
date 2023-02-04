import WebTorrent, { Torrent, TorrentFile } from 'webtorrent';
import { StreamStateType } from './types/streamState.type';
import { bytesToMegabytes, calcProgress } from '../../utils/calc';
import { FileType } from './types/file.type';
import { ChunkInfoType } from './types/chunkInfo.type';

class StreamService {
  private state: StreamStateType = {
    progress: 0,
    downloadSpeed: '0.0',
    ratio: 0
  };
  public error;

  constructor(private readonly wtClient = new WebTorrent()) {
    wtClient.on(
      'error',
      (err: Error | string) =>
        (this.error = typeof err == 'string' ? err : err.message)
    );
    wtClient.on(
      'torrent',
      (torrent: Torrent) =>
        (this.state = {
          progress: calcProgress(torrent.progress),
          downloadSpeed: bytesToMegabytes(torrent.downloadSpeed),
          ratio: torrent.ratio
        })
    );
  }

  public get getState(): StreamStateType {
    return (this.state = {
      progress: calcProgress(this.wtClient.progress),
      downloadSpeed: bytesToMegabytes(this.wtClient.downloadSpeed),
      ratio: this.wtClient.ratio
    });
  }

  public addToDownload(magnet: string): Promise<FileType[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const file = await this.getTorrentFile(magnet);
        if (file) {
          return resolve(
            file.files.map(data => ({
              name: data.name,
              length: data.length
            }))
          );
        }
        this.wtClient.add(magnet, async (torrent: Torrent) => {
          const files: FileType[] = torrent.files.map(data => ({
            name: data.name,
            length: data.length
          }));
          resolve(files);
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  public async createStream(
    magnet: string,
    fileName: string,
    range
  ): Promise<{ chunkInfo: ChunkInfoType; stream: NodeJS.ReadableStream }> {
    let torrentFile = await this.getTorrentFile(magnet);
    const file = this.getFileByName(torrentFile as Torrent, fileName);
    const chunkInfo = this.calcChunkInfo(range, file);
    const stream = file.createReadStream({
      start: chunkInfo.start,
      end: chunkInfo.end
    });
    return {
      chunkInfo,
      stream
    };
  }

  private async getTorrentFile(magnet: string): Promise<Torrent | void> {
    const test = this.wtClient.get(magnet);
    return this.wtClient.get(magnet);
  }

  private getFileByName(
    torrent: Torrent,
    fileName: string
  ): TorrentFile | undefined {
    return torrent.files.find(item => item.name == fileName);
  }

  private calcChunkInfo(range: string, file: TorrentFile): ChunkInfoType {
    const [startParsed, endParsed] = range.replace(/bytes=/, '').split('-');
    const fileSize = file.length;
    const start = parseInt(startParsed, 10);
    const end = endParsed ? +endParsed : fileSize - 1;
    const chunkSize = end - start + 1;
    return {
      start,
      end,
      chunkSize,
      fileSize
    };
  }
}

export const streamService = new StreamService();

