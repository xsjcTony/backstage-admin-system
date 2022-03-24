/* eslint '@typescript-eslint/no-unsafe-assignment': 'off' */

import { Service } from 'egg'
import { Op } from 'sequelize'
import type { Role } from '../model/Role'
import type {
  RoleQueryData,
  ModifyRoleData
} from '../types'
import type { IFindOptions } from 'sequelize-typescript'


export default class RolesService extends Service {

  /**
   * Get roles by query info (REST API - GET)
   * @param {RoleQueryData} query
   * @return {Promise<{rows: Role[], count: number}>}
   */
  public async getRolesByQuery(query: RoleQueryData): Promise<{
    rows: Role[]
    count: number
  }> {
    let options: IFindOptions<Role> = {
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      }
    }

    if (query.currentPageNumber && query.pageSize) {
      const currentPageNumber = parseInt(query.currentPageNumber) || 1
      const pageSize = parseInt(query.pageSize) || 5

      options = {
        ...options,
        limit: pageSize,
        offset: (currentPageNumber - 1) * pageSize
      }
    }

    return this.ctx.model.Role.findAndCountAll({
      ...options,
      where: {
        roleName: { [Op.substring]: query.keyword }
      }
    })
  }


  /**
   * Add role to database (REST API - POST)
   * @param {AddRoleData} data
   * @return {Promise<Role>}
   */
  public async createRole(data: ModifyRoleData): Promise<Role> {
    const { roleName, roleDescription } = data

    const r1 = await this._findRole({ roleName })
    if (r1) {
      throw new Error(`Role "${ roleName }" already exists`)
    }

    const r2 = await this._findRole({ roleDescription })
    if (r2) {
      throw new Error(`Role description must be unique`)
    }

    return this.ctx.model.Role.create(data)
  }


  /**
   * Delete role in database (REST API - DELETE)
   * @param {string} id
   * @return {Promise<Role>}
   */
  public async deleteRole(id: string): Promise<Role> {
    const role = await this._getRoleById(id)

    await role.destroy()
    return role
  }


  /**
   * Update user in database (REST API - PUT)
   */
  public async updateRole(id: string, data: ModifyRoleData): Promise<Role> {
    const role = await this._getRoleById(id)

    await role.update(data)

    const res = role.toJSON() as Role
    delete res.updatedAt
    return res
  }


  /**
   * Helper functions
   */

  /**
   * Look for **ONE** role from database based on given `WHERE` options
   * @param {IFindOptions<Role>["where"]} options
   * @return {Promise<Role|null>}
   * @private
   */
  private async _findRole(options: IFindOptions<Role>['where']): Promise<Role | null> {
    return this.ctx.model.Role.findOne({ where: options })
  }


  /**
   * Look for role based on given `PRIMARY KEY`
   * @param {string} id
   * @return {Promise<Role>}
   * @private
   */
  private async _getRoleById(id: string): Promise<Role> {
    const role = await this.ctx.model.Role.findByPk(id, {
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      }
    })

    if (role) {
      return role
    } else {
      throw new Error('Role doesn\'t exist.')
    }
  }
}
