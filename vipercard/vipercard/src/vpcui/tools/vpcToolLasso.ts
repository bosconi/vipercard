
/* auto */ import { cast } from '../../ui512/utils/utils512.js';
/* auto */ import { CanvasWrapper } from '../../ui512/utils/utilsDraw.js';
/* auto */ import { clrBlack } from '../../ui512/draw/ui512DrawPatterns.js';
/* auto */ import { UI512Painter } from '../../ui512/draw/ui512DrawPainterClasses.js';
/* auto */ import { UI512PaintDispatch, UI512PaintDispatchShapes } from '../../ui512/draw/ui512DrawPaintDispatch.js';
/* auto */ import { SelectToolState, VpcAppUIToolSelectBase } from '../../vpcui/tools/vpcToolSelectBase.js';

/**
 * lasso tool, for free-form selection
 * see VpcAppUIToolSelectBase for more information
 */
export class VpcAppUIToolLasso extends VpcAppUIToolSelectBase {
    /**
     * draw the blinking border around the selection
     */
    protected selectingDrawTheBorder(
        st: SelectToolState,
        cv: CanvasWrapper,
        painter: UI512Painter,
        prevTX: number,
        prevTY: number,
        tx: number,
        ty: number
    ) {
        if (this.st) {
            let args = new UI512PaintDispatch(
                UI512PaintDispatchShapes.SmearPencil,
                [prevTX, tx],
                [prevTY, ty],
                clrBlack,
                clrBlack,
                false,
                1
            );

            UI512PaintDispatch.go(args, painter);
            if (
                prevTX !== this.st.recordXpts[this.st.recordXpts.length - 1] ||
                prevTY !== this.st.recordYpts[this.st.recordYpts.length - 1]
            ) {
                this.st.recordXpts.push(prevTX);
                this.st.recordYpts.push(prevTY);
            }

            this.st.recordXpts.push(tx);
            this.st.recordYpts.push(ty);
        }
    }

    /**
     * draw the shape we want to select as a filled-in black shape
     */
    protected makeBlack() {
        if (this.st) {
            let cv = cast(this.st.elStage.getCachedPainterForWrite().getBackingSurface(), CanvasWrapper);
            cv.clear();

            let args = new UI512PaintDispatch(
                UI512PaintDispatchShapes.IrregularPolygon,
                this.st.recordXpts,
                this.st.recordYpts,
                clrBlack,
                clrBlack,
                true
            );

            UI512PaintDispatch.go(args, this.st.elStage.getCachedPainterForWrite());
        }
    }

    /**
     * we'll cancel selection if the region is too small
     */
    protected checkTooSmall() {
        const minSize = 2;
        return (
            !!this.st &&
            (this.st.maxX - this.st.minX <= minSize || this.st.maxY - this.st.minY <= minSize) &&
            this.st.recordXpts.length > minSize &&
            this.st.recordYpts.length > minSize
        );
    }
}
