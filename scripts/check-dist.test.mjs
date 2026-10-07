import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { checkDist, findMarkers } from './check-dist.mjs'

let dir
const log = { log: vi.fn(), warn: vi.fn(), error: vi.fn() }

beforeEach(async () => {
  dir = await mkdtemp(join(tmpdir(), 'check-dist-'))
  await mkdir(join(dir, 'assets'))
  vi.clearAllMocks()
})

afterEach(async () => {
  await rm(dir, { recursive: true, force: true })
})

describe('check-dist', () => {
  it('passes a clean build on main', async () => {
    await writeFile(join(dir, 'index.html'), '<h1>Ready</h1>')
    expect(await checkDist({ dir, branch: 'main', log })).toBe(0)
  })

  it('fails on main when a placeholder remains', async () => {
    await writeFile(join(dir, 'assets', 'app.js'), 'const q = "TODO_CONFIRM Charlotte Simpson review text"')
    expect(await checkDist({ dir, branch: 'main', log })).toBe(1)
    expect(log.error).toHaveBeenCalledOnce()
    expect(String(log.error.mock.calls[0][0])).toContain('assets/app.js')
  })

  it('only warns on preview branches and local builds', async () => {
    await writeFile(join(dir, 'index.html'), '<link href="https://TODO_CONFIRM_DOMAIN/">')
    expect(await checkDist({ dir, branch: 'develop', log })).toBe(0)
    expect(await checkDist({ dir, branch: undefined, log })).toBe(0)
    expect(log.warn).toHaveBeenCalledTimes(2)
    expect(log.error).not.toHaveBeenCalled()
  })

  it('ignores binary assets', async () => {
    await writeFile(join(dir, 'assets', 'photo.webp'), 'TODO_CONFIRM')
    expect(await findMarkers(dir)).toEqual([])
  })
})
