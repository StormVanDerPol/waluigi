import html from '@web/rollup-plugin-html';
import { babel } from '@rollup/plugin-babel';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import { terser } from 'rollup-plugin-terser';
import postcss from 'rollup-plugin-postcss';


const bundleTypes = {
  esm: {
    entryFileNames: '[name].[hash].js',
    dir: 'dist',
    format: 'esm',
  },
  cjs: {
    entryFileNames: '[name].[hash].cjs.js',
    dir: 'dist',
    format: 'cjs',
  },
  min: {
    entryFileNames: '[name].[hash].min.js',
    dir: 'dist',
    format: 'es',
  },
};

export default {
  input: 'src/index.js',
  output: [bundleTypes.min],
  plugins: [
    nodeResolve({
      extensions: ['.js', '.css'],
      browser: true,
    }),
    replace({
      preventAssignment: true,
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
    postcss(),
    commonjs(
      {
        include: [/node_modules/],
      }
    ),
    babel({
      presets: ['@babel/preset-react'],
    }),
    html({
      publicPath: '',
      input: './public/index.html',
    }),
    // terser(),
  ],
};
