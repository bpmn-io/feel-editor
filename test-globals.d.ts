// Custom test environment globals for FEEL Editor
// karma-sinon-chai provides globals in a way that needs explicit declaration

declare global {
  // Karma/Test environment globals
  interface Window {
    __env__?: {
      SINGLE_START?: string;
    };
  }

  // Test context type (used in autocompletion tests)
  const context: any;

  // Node.js require.context for webpack test bundles
  interface RequireContext {
    (module: string): any;
    keys(): string[];
  }

  interface NodeRequire {
    context(
      directory: string,
      useSubdirectories: boolean,
      regExp: RegExp
    ): RequireContext;
  }

  // karma-sinon-chai globals (not properly exposed by @types)
  const expect: Chai.ExpectStatic;
  const sinon: sinon.SinonStatic;
}
export {};
