import { PostgresHelper } from '../../db/postgres/helper.js'

export class PostgresDeleteUser {
  async execute(userId) {
    const deletedUser = await PostgresHelper.query(
      'DELETE FROM users WHERE id = $1 RETURN * ',
      [userId],
    )
    return deletedUser[0]
  }
}
