import fg from 'fast-glob';
import path from 'path';

export async function loadInstances<T>(folderPattern: string): Promise<T[]> {
    const pattern = `src/${folderPattern}/**/*.{ts,js}`;

    console.log(`🔎 Scan pattern: ${pattern}`);
    console.log(`📂 CWD: ${process.cwd()}`);

    const files = await fg(pattern, {
        absolute: true,
        cwd: process.cwd(),
        ignore: ['**/*.d.ts', '**/node_modules/**'],
        onlyFiles: true
    });

    console.log(`✅ Fichiers trouvés :`, files);

    const instances: T[] = [];

    for (const file of files) {
        try {
            const module = await import(file);
            let ClassRef = module.default || Object.values(module).find(exp => typeof exp === 'function');
            if (ClassRef) {
                instances.push(new ClassRef());
            }
        } catch (e) {
            console.error(`❌ Erreur chargement ${path.basename(file)}:`, e);
        }
    }

    return instances;
}