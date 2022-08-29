import { Raindrop } from '../raindrop/raindrops/types';
import { ARCHIVED_TAG, DESCRIPTION_PLACEHOLDER, DEVONTHINK_LINK_PLACEHOLDER, OBSIDIAN_LINK_PLACEHOLDER, RaindropCommandBase, REVIEWED_TAG } from './raindropCommandBase';

const DEVONTHINK_LINK_FIELD = "devonthink_link";

const EXCERPT_FORMAT = `
devonthink_link: ${DEVONTHINK_LINK_PLACEHOLDER}
obsidian_link: ${OBSIDIAN_LINK_PLACEHOLDER}
context: Unknown
description: ${DESCRIPTION_PLACEHOLDER}
`;

export class PrepareRaindropsCommand extends RaindropCommandBase {
    public async execute(): Promise<void> {
        this.setOptions({
            ...this.options,
            ...{ includeUnreviewed: true }
        });
        let itemsToPrepare = await this.getRaindropsToProcess(this.isRaindropPrepared);
        if (itemsToPrepare.length == 0) {
            this.logger.warn("No raindrops found to prepare - exiting");
            return;
        }

        // https://stackoverflow.com/a/63754611 ??
        await itemsToPrepare.reduce(async (memo: any, item: Raindrop) => {
            await memo;
            await this.prepareRaindrop(item);
        }, Promise.resolve())
    }

    private isRaindropPrepared(raindrop: Raindrop): boolean {
        return raindrop.tags.indexOf(REVIEWED_TAG) < 0 &&
            raindrop.tags.indexOf(ARCHIVED_TAG) < 0 &&
            raindrop.excerpt.indexOf(DEVONTHINK_LINK_FIELD) < 0
    }

    private async prepareRaindrop(raindrop: Raindrop): Promise<void> {
        this.logger.info(`Preparing raindrop for ${raindrop.link}`);
        let newExcerpt = EXCERPT_FORMAT.replace(DESCRIPTION_PLACEHOLDER, raindrop.excerpt);
        this.logger.info(newExcerpt, 'updating raindrop with new excerpt');
        await this.api.updateRaindrop(raindrop._id, {
            excerpt: newExcerpt
        });

        return await this.api.sleep(5000);
    }

    public getName(): string {
        return "prepare_raindrops";
    }

    public getDescription(): string {
        return 'Find raindrops that are not formatted and format them to make processing easier';
    }
}