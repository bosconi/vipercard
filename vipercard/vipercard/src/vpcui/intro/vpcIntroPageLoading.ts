
/* auto */ import { O } from '../../ui512/utils/utilsAssert.js';
/* auto */ import { UI512Application } from '../../ui512/elements/ui512ElementApp.js';
/* auto */ import { UI512ElLabel } from '../../ui512/elements/ui512ElementLabel.js';
/* auto */ import { UI512Presenter } from '../../ui512/presentation/ui512Presenter.js';
/* auto */ import { IntroPageBase } from '../../vpcui/intro/vpcIntroPageBase.js';
/* auto */ import { VpcIntroProvider } from '../../vpcui/intro/vpcIntroProvider.js';

/**
 * the loading page, essentially just shows a message on a white background
 */
export class IntroPageLoading extends IntroPageBase {
    isIntroWaitWhileLoadingPage = true;
    compositeType = 'IntroPageLoading';
    protected prompt: O<UI512ElLabel>;
    constructor(
        compId: string,
        bounds: number[],
        x: number,
        y: number,
        public loader: VpcIntroProvider,
        public initialLoadMessage: string
    ) {
        super(compId, bounds, x, y);
    }

    /**
     * initialize layout
     */
    createSpecific(app: UI512Application) {
        let grp = app.getGroup(this.grpId);
        let headerHeight = this.drawCommonFirst(app, grp);

        /* draw the text */
        const margin = 80;
        this.prompt = this.genChild(app, grp, 'prompt', UI512ElLabel);
        this.prompt.set('labeltext', this.initialLoadMessage + '...');
        this.prompt.set('labelwrap', true);
        this.prompt.set('labelhalign', true);
        this.prompt.setDimensionsX1Y1(
            this.x + margin,
            this.y + headerHeight + margin,
            this.x + this.logicalWidth - margin,
            this.y + this.logicalHeight - margin
        );

        this.drawCommonLast(app, grp);
    }

    /**
     * begin loading the document
     * the loader will run the callback to update the label
     */
    go(currentCntrl: UI512Presenter) {
        this.loader.startLoadDocument(currentCntrl, s => {
            if (this.prompt) {
                this.prompt.set('labeltext', s);
            }
        });
    }
}
