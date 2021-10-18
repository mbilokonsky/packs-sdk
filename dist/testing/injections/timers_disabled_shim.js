// ts file compiled js file somehow end up with cjs format but esbuild needs esm format for shims.
// so for now we just have this file in js.

<<<<<<< HEAD
const ErrorMessage =
  `Please use the --timerStrategy=fake flag to enable shimmed timing primitives. Native node timing ` +
  `primitives like setTimeout or setInternal aren't supported in the pack execution sandbox ` +
  `environment. However, if you are using a library that relies upon them, you can use the ` +
  `--timerStrategy=fake flag to build your pack with shimmed implementations that approximate the native ` +
=======
const ErrorMessage = 
  `Please use the --timers flag to enable shimmed timing primitives. Native node timing ` + 
  `primitives like setTimeout or setInternal aren't supported in the pack execution sandbox ` + 
  `environment. However, if you are using a library that relies upon them, you can use the ` + 
  `--timers flag to build your pack with shimmed implementations that approximate the native ` + 
>>>>>>> 70ee3ea0 (make build again)
  `behavior. Because of this, be aware that packs that use timing primitives may not work reliably.`

export function setTimeout() { throw new Error(ErrorMessage); }

export function setInterval() { throw new Error(ErrorMessage); }

export function clearTimeout() { throw new Error(ErrorMessage); }
export function clearInterval() { throw new Error(ErrorMessage); }
