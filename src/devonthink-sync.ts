/**
 * https://github.com/tj/commander.js/blob/HEAD/examples/nestedCommands.js
 */
import { Command, Option } from 'commander';
import 'dotenv/config';
import { createLogger } from 'bunyan';
import { devonthinkTest, raindropTest } from './commands/runExample';
import { ArchiveRaindropsCommand } from './commands/archiveRaindrops';
import { PrepareRaindropsCommand } from './commands/prepareRaindrops';

const log = createLogger({
    name: 'APP'
});

const program = new Command();
const runExample = program.command('run_example');

const LIMIT_OPTION = new Option('-l, --limit <number>', 'Max # of results to process').default(1);
const COLLECTION_OPTION = new Option('-c, --collection <name>', 'Optional name of a collection to limit processing to');
const INCLUDE_UNSORTED_OPTION = new Option('--include-unsorted', 'Include the unsorted collection in results to be processed').conflicts('collection')

runExample
    .command('devonthink')
    .description('run a test of devonthink interactions and print results')
    .action(devonthinkTest);

runExample
    .command('raindrop')
    .description('query data from raindrop and update tags')
    .action(raindropTest);

const raindropCommands = [
    new PrepareRaindropsCommand(),
    new ArchiveRaindropsCommand()
];

raindropCommands.forEach(command => {
    program.command(command.getName())
        .description(command.getDescription())
        .addOption(LIMIT_OPTION)
        .addOption(COLLECTION_OPTION)
        .addOption(INCLUDE_UNSORTED_OPTION)
        .action(async (options) => {
            log.debug(options, `task ${command.getName()} invoked with options`);
            command.setOptions({
                limit: options.limit || 1,
                collectionName: options.collection,
                includeUnsorted: options.includeUnsorted || false
            });
            await command.execute();
        })
})

program.parse(process.argv);



