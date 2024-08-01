/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export', // Outputs a Single-Page Application (SPA).
  distDir: './dist', // Changes the build output directory to `./dist/`.
};

export default nextConfig;

// import path from 'path';
//
// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   output: 'export', // Outputs a Single-Page Application (SPA).
//   distDir: './dist', // Changes the build output directory to `./dist/`.
//
//   webpack: (config) => {
//     config.resolve.alias['@'] = path.resolve(__dirname, 'src');
//     return config;
//   },
// };
//
// export default nextConfig;
