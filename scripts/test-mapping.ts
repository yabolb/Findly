
import dotenv from 'dotenv';
import path from 'path';
// Load env before importing AwinService
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { AwinService } from '../src/lib/awin-service';

async function testMapping() {
    const service = new AwinService();

    const tests = [
        { cat: 'Juguetes > Música', name: 'Rachmaninov: Sinfonía n. 2', expected: 'movies-books-music' },
        { cat: 'Música > Clásica', name: 'Beethoven', expected: 'movies-books-music' },
        { cat: 'Juguetes > Construcción', name: 'Lego Star Wars', expected: 'baby-kids' },
        { cat: 'Electrónica > Audio', name: 'Auriculares Sony', expected: 'tech-electronics' },
        { cat: '', name: 'Libro de cocina', expected: 'movies-books-music' },
        { cat: 'Moda > Zapatos', name: 'Nike Air', expected: 'fashion' },
        { cat: 'Hogar > Cocina', name: 'Sarten Tefal', expected: 'home-garden' }
    ];

    console.log('--- Testing Category Mapping ---');
    tests.forEach(t => {
        const result = service.mapCategory(t.cat, t.name);
        const pass = result === t.expected;
        console.log(`${pass ? '✅' : '❌'} [${t.cat}] [${t.name}] -> Got: ${result} (Expected: ${t.expected})`);
    });
}

testMapping();
