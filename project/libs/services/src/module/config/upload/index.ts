import path from 'path';
import { Module, DynamicModule } from '@nestjs/common';
import { ConfigModule as ConfigModuleRoot } from '@nestjs/config';
import { ConfigModuleOptions } from './contracts';
import { dbConfig } from '../shared';
import { commonConfig } from './common.config';
import { uploaderConfig } from './uploader.config';

const envFilePath = `apps/${path.basename(__dirname)}/.env.${
  process.env.NODE_ENV
}`;

@Module({})
export class ConfigUploadModule {
  static forRoot(options?: ConfigModuleOptions): DynamicModule {
    return {
      module: ConfigUploadModule,
      imports: [
        ConfigModuleRoot.forRoot({
          isGlobal: true,
          cache: true,
          load: [
            commonConfig(options),
            uploaderConfig(options),
            dbConfig(options),
          ],
          envFilePath: envFilePath,
        }),
      ],
      exports: [],
    };
  }
}

export { ConfigUploadNamespace } from './constants';
export {
  CommonConfig as CommonUploaderConfig,
  UploaderConfig,
} from './contracts';
export { uploaderConfig };
export { getServeStaticOptions } from './utils';
