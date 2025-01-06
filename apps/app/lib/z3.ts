// If we ever plan to support Z3 on the edge runtime / cloudflare workers, we need to use the following code
// https://github.com/cloudflare/worker-emscripten-template/
// This means that we need to compile our own version of wasm for Z3, and also insitiate the Z3 context
// in a different way. For now, this npm packages only supports the browser and node.js runtime

// Setting up the Z3 solver in JavaScript is like shooting yourself in the foot, given the sparse documentation available for it.
// So here are some links that I found useful: (for my future self)
// https://medium.com/@claudefournier/takuzu-puzzle-assistant-with-react-work-in-progress-part-3-56e4db12e238
// https://github.com/microsoft/z3guide

import type { Context, Solver, Z3HighLevel, Z3LowLevel } from 'z3-solver';

declare global {
  interface Window {
    z3Promise: Promise<Z3HighLevel & Z3LowLevel>;
  } // use any to escape typechecking
}

export default async function loadZ3() {
  const z3 = await import('z3-solver');

  // init z3
  const z3p: Promise<Z3HighLevel & Z3LowLevel> =
    window.z3Promise ||
    (() => {
      // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
      return (window.z3Promise = z3.init());
    })();

  return z3p;
}

let z3Context: Context<'main'> | null;
let solver: Solver<'main'> | null;

export async function testZ3() {
  try {
    const z3 = await loadZ3();

    if (!z3Context) {
      z3Context = z3.Context('main');
    }

    const { Solver, Int, And } = z3Context;

    const x = Int.const('x');

    if (!solver) {
      solver = new Solver();
    }
    console.log(solver);
    solver.add(And(x.ge(0), x.le(9)));
    await solver.check();

    solver.reset();
    z3.em.PThread.terminateAllThreads();
  } catch (_error) {
    // So basically, Z3 is a pain
    // There's a memory leak in the solver, and the only way to fix it is to reset the solver
    // and reinitialize the z3 library
    // @ts-ignore
    window.z3Promise = null;
    solver?.release();
    solver = null;
    z3Context = null;
  }
}
