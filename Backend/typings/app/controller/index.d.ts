// This file is created by egg-ts-helper@1.30.2
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportGithub from '../../../app/controller/github';
import ExportHome from '../../../app/controller/home';
import ExportUser from '../../../app/controller/user';
import ExportUtil from '../../../app/controller/util';

declare module 'egg' {
  interface IController {
    github: ExportGithub;
    home: ExportHome;
    user: ExportUser;
    util: ExportUtil;
  }
}
