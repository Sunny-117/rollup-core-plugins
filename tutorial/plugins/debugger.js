import { rollup, watch } from 'rollup';
import inputOptions from './rollup.config.js';

; (async function () {
  //打包阶段 
  const bundle = await rollup(inputOptions);
  //生成阶段
  await bundle.generate(inputOptions.output);
  //写入阶段
  await bundle.write(inputOptions.output);
  /* 
  const watcher = watch(inputOptions);
  watcher.on('event', event => {
    console.log(event);
  });
  setTimeout(() => {
    watcher.close();
  }, 1000); */
  //关闭阶段
  await bundle.close();
})();
