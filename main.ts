import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const LINE_ONE =
  "A traffic jam is a ripple flicked across a rug: each driver brakes a beat after the one ahead, so a tiny tap rolls back down the line and reaches you long after the car that made it is gone.";

const LINE_TWO =
  "The timing matches: the wave reaches you last and nobody sends it, but rug ripples fade and slip off the edge, while cars cannot swerve aside, so a jam can pile up and grow — that part the rug leaves out.";

interface Options {
  outputPath: string;
  help: boolean;
}

function parseArgs(argv: string[], env: NodeJS.ProcessEnv): Options {
  const help = argv.includes("--help") || argv.includes("-h");

  const cliArg = argv.find((arg) => !arg.startsWith("-"));
  const outputDir = env.MAKEFUN_OUTPUT_DIR;

  let outputPath: string;
  if (cliArg) {
    outputPath = cliArg.toLowerCase().endsWith(".txt")
      ? cliArg
      : join(cliArg, "entry.txt");
  } else if (outputDir) {
    outputPath = join(outputDir, "entry.txt");
  } else {
    outputPath = "/output/entry.txt";
  }

  return { outputPath, help };
}

function main(argv: string[], env: NodeJS.ProcessEnv): number {
  const { outputPath, help } = parseArgs(argv, env);

  if (help) {
    process.stdout.write(
      "Usage: node main.ts [OUTPUT_PATH]\n" +
        "\n" +
        "Writes two lines (an everyday-thing analogy and an honest note on\n" +
        "what it maps and what it leaves out) as UTF-8 to OUTPUT_PATH.\n" +
        "\n" +
        "OUTPUT_PATH defaults to /output/entry.txt and may also be set with\n" +
        "the MAKEFUN_OUTPUT_DIR environment variable, which appends entry.txt.\n" +
        "A path passed on the command line takes precedence over the environment.\n",
    );
    return 0;
  }

  const text = `${LINE_ONE}\n${LINE_TWO}\n`;
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, text, "utf8");
  process.stdout.write(`${Buffer.byteLength(text, "utf8")}\n`);
  return 0;
}

process.exitCode = main(process.argv.slice(2), process.env);
