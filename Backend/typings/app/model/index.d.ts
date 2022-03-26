// This file is created by egg-ts-helper@1.30.2
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportOauth from '../../../app/model/Oauth';
import ExportRole from '../../../app/model/Role';
import ExportUser from '../../../app/model/User';
import ExportUserRole from '../../../app/model/UserRole';

declare module 'egg' {
  interface IModel {
    Oauth: ReturnType<typeof ExportOauth>;
    Role: ReturnType<typeof ExportRole>;
    User: ReturnType<typeof ExportUser>;
    UserRole: ReturnType<typeof ExportUserRole>;
  }
}
