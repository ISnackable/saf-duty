import { init } from 'z3-solver';

export async function testZ3() {
  // @ts-ignore
  if (!global.initZ3 || !window.crossOriginIsolated) {
    throw new Error('Z3 not initialized');
  }

  const { Context } = await init();
  const { Solver, Int, And } = Context('main');

  const x = Int.const('x');

  const solver = new Solver();
  console.log(solver);
  solver.add(And(x.ge(0), x.le(9)));
  console.log(await solver.check());
}
