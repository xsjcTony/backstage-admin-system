// This file is created by egg-ts-helper@1.30.2
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportOauth from '../../../app/model/Oauth';
import ExportUser from '../../../app/model/User';

declare module 'egg' {
  interface IModel {
    Oauth: ReturnType<typeof ExportOauth>;
    User: ReturnType<typeof ExportUser>;
  }
}
