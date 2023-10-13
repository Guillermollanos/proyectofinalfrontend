import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
	resolve: {
		alias: {
			'@': path.resolve(__dirname, 'src'), // Alias para la carpeta src
		},
	},
	build: {
		rollupOptions: {
			external: ['@fortawesome/fontawesome-svg-core'], // Añade @fortawesome/fontawesome-svg-core como externo
			plugins: [
				{
					name: 'replace-public-path',
					resolveId(id) {
						// Agrega todas las imágenes que necesitas manejar aquí
						const imagePaths = [
							'../../../public/loading.gif',
							'../../../public/error.png',
						];
						if (imagePaths.includes(id)) {
							return id; // Deja que Rollup resuelva estas importaciones
						}
						return null; // Deja que Rollup maneje otras importaciones
					},
					load(id) {
						// Agrega las rutas de las imágenes aquí
						const imageMappings = {
							'../../../public/loading.gif': 'public/loading.gif',
							'../../../public/error.png': 'public/error.png',
						};
						if (imageMappings[id]) {
							const imagePath = path.resolve(__dirname, imageMappings[id]);
							const imageContent = `export default "data:image/${path
								.extname(imagePath)
								.slice(1)};base64,${Buffer.from(
								require('fs').readFileSync(imagePath)
							).toString('base64')}";`;
							return imageContent;
						}
						return null; // Deja que Rollup maneje otras importaciones
					},
				},
			],
		},
	},
	plugins: [react()],
	server: {
		port: 3000,
	},
});
