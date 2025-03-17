import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import CopyWebpackPlugin from 'copy-webpack-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default {
  entry: {
    contentScript: './src/contentScript.ts',
    background: './src/background.ts',
    popup: './src/popup.ts'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: 'static', to: '.' } // Copia archivos estáticos a dist
      ]
    })
  ]
};
