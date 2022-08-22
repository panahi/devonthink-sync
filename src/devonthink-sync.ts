/**
 * https://github.com/tj/commander.js/blob/HEAD/examples/nestedCommands.js
 */
import { Command, Option } from 'commander';
import 'dotenv/config';
import { devonthinkTest, raindropTest } from './commands/runExample';
import { archiveRaindrops } from './commands/archiveRaindrops';

const program = new Command();
const runExample = program.command('run_example');

runExample
    .command('devonthink')
    .description('run a test of devonthink interactions and print results')
    .action(devonthinkTest);

runExample
    .command('raindrop')
    .description('query data from raindrop and update tags')
    .action(raindropTest);

const archiveRaindropsCommand = program.command('archive_raindrops');
archiveRaindropsCommand.description('Find unarchived raindrop items and add them to devonthink')
    .addOption(new Option('-l, --limit <number>', 'Max # of results to process').default(1))
    .addOption(new Option('-c, --collection <name>', 'Optional name of a collection to limit processing to'))
    .addOption(new Option('--include-unsorted', 'Include the unsorted collection in results to be processed').conflicts('collection'))
    .action(async (_, options) => {
        console.log(options);
        await archiveRaindrops({
            limit: options.limit || 1,
            collectionName: options.collection,
            includeUnsorted: options.includeUnsorted || false
        });
    })

program.parse(process.argv);



