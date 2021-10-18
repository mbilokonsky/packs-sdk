import type { Arguments } from 'yargs';
import type { TimerShimStrategy } from '../testing/compile';
interface UploadArgs {
    manifestFile: string;
    codaApiEndpoint: string;
    notes?: string;
    intermediateOutputDirectory: string;
    timerStrategy: TimerShimStrategy;
}
export declare function handleUpload({ intermediateOutputDirectory, manifestFile, codaApiEndpoint, notes, timerStrategy, }: Arguments<UploadArgs>): Promise<undefined>;
export {};
