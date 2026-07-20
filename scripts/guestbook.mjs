#!/usr/bin/env node
/**
 * Moderate guestbook entries via D1 (remote).
 *
 *   npm run guestbook -- list
 *   npm run guestbook -- list approved
 *   npm run guestbook -- show <id>
 *   npm run guestbook -- approve <id>
 *   npm run guestbook -- reject <id>
 */

import { spawnSync } from 'node:child_process'

const DB = 'michaelstone-guestbook'
const [command = 'list', arg] = process.argv.slice(2)

function sql(statement) {
  const result = spawnSync(
    'npx',
    ['wrangler', 'd1', 'execute', DB, '--remote', '--json', '--command', statement],
    { encoding: 'utf8' },
  )
  if (result.status !== 0) {
    console.error(result.stderr || result.stdout || 'wrangler failed')
    process.exit(result.status || 1)
  }
  const parsed = JSON.parse(result.stdout)
  const rows = parsed?.[0]?.results ?? parsed?.results ?? []
  return rows
}

function printRows(rows) {
  if (!rows.length) {
    console.log('(none)')
    return
  }
  for (const row of rows) {
    const preview = String(row.message || '')
      .replace(/\s+/g, ' ')
      .slice(0, 120)
    console.log(`${row.id}`)
    console.log(`  ${row.name} · ${row.status} · ${row.word_count} words · ${row.created_at}`)
    console.log(`  ${preview}${String(row.message || '').length > 120 ? '…' : ''}`)
    console.log('')
  }
}

switch (command) {
  case 'list': {
    const status = ['pending', 'approved', 'rejected'].includes(arg) ? arg : 'pending'
    printRows(
      sql(
        `SELECT id, name, message, word_count, status, created_at
         FROM guestbook_entries
         WHERE status = '${status}'
         ORDER BY created_at DESC
         LIMIT 100`,
      ),
    )
    break
  }
  case 'show': {
    if (!arg) {
      console.error('Usage: npm run guestbook -- show <id>')
      process.exit(1)
    }
    const rows = sql(
      `SELECT id, name, message, word_count, status, created_at, moderated_at
       FROM guestbook_entries
       WHERE id = '${arg.replace(/'/g, "''")}'
       LIMIT 1`,
    )
    if (!rows.length) {
      console.log('(not found)')
      break
    }
    const row = rows[0]
    console.log(JSON.stringify(row, null, 2))
    break
  }
  case 'approve':
  case 'reject': {
    if (!arg) {
      console.error(`Usage: npm run guestbook -- ${command} <id>`)
      process.exit(1)
    }
    const status = command === 'approve' ? 'approved' : 'rejected'
    const id = arg.replace(/'/g, "''")
    const now = new Date().toISOString()
    sql(
      `UPDATE guestbook_entries
       SET status = '${status}', moderated_at = '${now}'
       WHERE id = '${id}'`,
    )
    console.log(`${status}: ${arg}`)
    break
  }
  default:
    console.error(`Unknown command: ${command}`)
    console.error('Commands: list [pending|approved|rejected], show <id>, approve <id>, reject <id>')
    process.exit(1)
}
