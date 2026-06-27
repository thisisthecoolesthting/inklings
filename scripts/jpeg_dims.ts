import sharp from "sharp";

async function main() {
  const base = "/var/www/inklings/public/images/showcase/milo-moonbeam/";
  for (const name of process.argv.slice(2)) {
    const m = await sharp(base + name).metadata();
    console.log(name, m.width, m.height);
  }
}
main();
