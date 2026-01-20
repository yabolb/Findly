declare module 'unzip-stream' {
    import { Transform } from 'stream';
    export function Parse(): Transform;
    export function Extract(options: { path: string }): Transform;
}
