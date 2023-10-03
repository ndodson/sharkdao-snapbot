export declare const addMissingSchemes: (descriptionText: string | undefined) => string;
export declare const replaceInvalidDropboxImageLinks: (descriptionText: string | undefined) => string;
/**
 * Extract title from a proposal's body/description. Returns null if no title found in the first line.
 * @param body proposal body
 */
export declare const extractTitle: (body: string | undefined) => string | null;
export declare const createSnapshotProposal: (id: number, description: string) => Promise<void>;
