import path from 'path'
import babel from '@rollup/plugin-babel'
import resolve from '@rollup/plugin-babel'
import typescript from 'rollup-plugin-typescript2'

import reactPkg from '../../packages/react/package.json'

const tsConfig = { tsConfig: 'tsconfig.json' }
const distPath = path.resolve(__dirname, '../../dist')
const pkgPath = path.resolve(__dirname, '../../packages')

export default [
  {
    input: `${pkgPath}/react/${reactPkg.module}`,
    output: {
      file: `${distPath}/react.js`,
      format: 'es'
    },
    plugins: [
      typescript(tsConfig),
      resolve(),
      babel({ babelHelpers: 'bundled' })
    ]
  }
]
