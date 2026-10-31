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
                    try {
                        await fs.access(distPath);
                        await fs.writeFile(htaccessPath, htaccessContent);
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
        title: 'Meta Verified · Xác minh tích xanh và bảo vệ tài khoản',
        favicon: './src/assets/images/icon.webp',
        template: './public/index.html',
        meta: {
            description: 'Trung tâm hỗ trợ xác minh danh tính, nâng cấp tích xanh chính chủ và bảo vệ tài khoản theo tiêu chuẩn Meta.',
            'og:title': 'Meta Verified · Xác minh tích xanh và bảo vệ tài khoản',
            'og:description': 'Trung tâm hỗ trợ xác minh danh tính, nâng cấp tích xanh chính chủ và bảo vệ tài khoản theo tiêu chuẩn Meta.',
            'og:type': 'website',
            'og:image': '/hero-image.jpg',
            'og:image:width': '1280',
            'og:image:height': '720',
            'og:image:type': 'image/jpeg',
            'twitter:card': 'summary_large_image',
            'twitter:title': 'Meta Verified · Xác minh tích xanh và bảo vệ tài khoản',
            'twitter:description': 'Trung tâm hỗ trợ xác minh danh tính, nâng cấp tích xanh chính chủ và bảo vệ tài khoản theo tiêu chuẩn Meta.',
            'twitter:image': '/hero-image.jpg'
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
