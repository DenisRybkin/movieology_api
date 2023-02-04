import dotenv from 'dotenv';

dotenv.config();

export interface IConfig {
  PORT: number;
  API_PREFIX: string;
}

export const config: IConfig = {
  PORT: +process.env.PORT || 8080,
  API_PREFIX: process.env.API_PREFIX || '/api'
};