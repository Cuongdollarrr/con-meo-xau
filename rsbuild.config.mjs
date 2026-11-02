import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import tailwindcss from '@tailwindcss/postcss';
import fs from 'fs/promises';
import path from 'path';

export default defineConfig({
    plugins: [
        pluginReact(),
        {
            name: 'plugin-htaccess-spa',
            setup(api) {
                api.onAfterBuild(async () => {
                    const distPath = path.resolve('dist');
                    const htaccessPath = path.join(distPath, '.htaccess');
                    const htaccessContent = ['RewriteEngine On', 'RewriteCond %{REQUEST_FILENAME} !-f', 'RewriteCond %{REQUEST_FILENAME} !-d', 'RewriteRule ^ index.html [L]'].join('\n');
                    const redirectsPath = path.join(distPath, '_redirects');
                    const redirectsContent = '/* /index.html 200\n';
                    const thumbnailSrc = path.resolve('Thubnail.jpg');
                    const thumbnailDest = path.join(distPath, 'Thubnail.jpg');
                    try {
                        await fs.access(distPath);
                        await fs.writeFile(htaccessPath, htaccessContent);
                        await fs.writeFile(redirectsPath, redirectsContent);
                        await fs.copyFile(thumbnailSrc, thumbnailDest);
                        api.logger.info('htaccess build xong');
                    } catch {
                        api.logger.error('htaccess build fail');
                    }
                });
            }
        }
    ],
    tools: {
        postcss: {
            postcssOptions: {
                plugins: [tailwindcss]
            }
        }
    },
    resolve: {
        alias: {
            '@': './src'
        }
    },
    html: {
        title: 'Meta Verified · Blue badge verification and account protection',
        favicon: './src/assets/images/icon.webp',
        meta: {
            description:
                'Identity verification support center for official blue badge upgrade and account protection under Meta standards.',
            'og:title': 'Meta Verified · Blue badge verification and account protection',
            'og:description':
                'Identity verification support center for official blue badge upgrade and account protection under Meta standards.',
            'og:type': 'website',
            'og:image': '/Thubnail.jpg',
            'og:image:width': '1200',
            'og:image:height': '545',
            'og:image:type': 'image/jpeg',
            'twitter:card': 'summary_large_image',
            'twitter:title': 'Meta Verified · Blue badge verification and account protection',
            'twitter:description':
                'Identity verification support center for official blue badge upgrade and account protection under Meta standards.',
            'twitter:image': '/Thubnail.jpg'
        }
    },
    source: {
        tsconfigPath: './jsconfig.json'
    },
    output: {
        dataUriLimit: {
            image: Number.MAX_SAFE_INTEGER,
            svg: Number.MAX_SAFE_INTEGER,
            font: Number.MAX_SAFE_INTEGER,
            media: Number.MAX_SAFE_INTEGER,
            assets: Number.MAX_SAFE_INTEGER
        }
    }
});
