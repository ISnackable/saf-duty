// If we ever plan to support Z3 on the edge runtime / cloudflare workers, we need to use the following code
// https://github.com/cloudflare/worker-emscripten-template/
// This means that we need to compile our own version of wasm for Z3, and also insitiate the Z3 context
// in a different way. For now, this npm packages only supports the browser and node.js runtime

// Setting up the Z3 solver in JavaScript is like shooting yourself in the foot, given the sparse documentation available for it.
// So here are some links that I found useful: (for my future self)
// https://medium.com/@claudefournier/takuzu-puzzle-assistant-with-react-work-in-progress-part-3-56e4db12e238
// https://github.com/microsoft/z3guide
import type { Context, Solver, Z3HighLevel, Z3LowLevel } from 'z3-solver';
import { init } from 'z3-solver';

declare global {
  var initZ3: () => void;
}

let z3: (Z3HighLevel & Z3LowLevel) | null;
let z3Context: Context<'main'> | null;
let solver: Solver<'main'> | null;

// Experimental af, honestly we shouldn't use this at all
// I'm just testing out the Z3 solver
export async function testZ3() {
  try {
    if (!z3 || !global.initZ3) {
      z3 = await init();
    }

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
    console.error('Error in Z3', _error);
    cleanUpZ3();
  }
}

// So basically, Z3 is a pain
// There's a memory leak in the solver, and the only way to fix it is to reset the solver
// and reinitialize the z3 library
export function cleanUpZ3() {
  z3?.em.PThread.terminateAllThreads();
  solver?.release();
  solver = null;
  z3Context = null;
  z3 = null;
  // WebAssembly.instantiate()
}
