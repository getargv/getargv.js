await Bun.build({
  entrypoints: ['./lib/binding.ts'],
  outdir: './dist',
  minify: true,
  target: 'bun',
})
