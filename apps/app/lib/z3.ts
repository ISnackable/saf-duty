// If we ever plan to support Z3 on the edge runtime / cloudflare workers, we need to use the following code
// https://github.com/cloudflare/worker-emscripten-template/
// This means that we need to compile our own version of wasm for Z3, and also insitiate the Z3 context
// in a different way. For now, this npm packages only supports the browser and node.js runtime
import { type ContextCtor, init } from 'z3-solver';

let Context: ContextCtor;

export async function testZ3() {
  // @ts-ignore
  if (!Context || !global.initZ3) {
    // @ts-ignore
    const { Context: Module } = await init();
    Context = Module;
    return;
  }

  const { Solver, Int, And } = Context('main');

  const x = Int.const('x');

  const solver = new Solver();
  console.log(solver);
  solver.add(And(x.ge(0), x.le(9)));
  console.log(await solver.check());

  solver.release();
}
