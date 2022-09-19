import html from '@rollup/plugin-html';
import { babel } from "@rollup/plugin-babel"
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from "@rollup/plugin-commonjs";
import replace from '@rollup/plugin-replace';
import { terser } from "rollup-plugin-terser";



const template = ({  files, publicPath, }) => {
    
const links = (files.css || [])
.map(({ fileName }) => {
  return `<link href="${publicPath}${fileName}" rel="stylesheet">`;
})
.join('\n');

const scripts = (files.js || [])
.map(({ fileName }) => {
  return `<script src="${publicPath}${fileName}" async="true" defer="true"></script>`;
})
.join('\n');


return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>doc</title>
    ${links}
  </head>
  <body>
  <div id="app"></div>
    ${scripts}
  </body>
</html>`
}

export default {
  input: 'src/index.js',
  output: [{
    entryFileNames: "[name].[hash].js",
    dir: 'dist',
    format: 'esm'
  }, 

    {
      entryFileNames: "[name].[hash].cjs.js",
      dir: 'dist',
      format: 'cjs'
    },

    {
      entryFileNames: "[name].[hash].min.js",
      dir: 'dist',
      format: 'cjs',
      plugins: [terser()]
    }
  ],
  plugins: [
    nodeResolve({
      extensions: [".js"],
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify( 'development' )
    }),
    babel({
      presets: ["@babel/preset-react"],
    }),
    commonjs(),
    html({
        publicPath: "",
        template,
    })]
};