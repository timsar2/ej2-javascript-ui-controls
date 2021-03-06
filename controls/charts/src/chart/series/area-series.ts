import { getPoint, withInRange, ChartLocation, TransformToVisible } from '../../common/utils/helper';
import { PathOption } from '@syncfusion/ej2-svg-base';
import { Chart } from '../chart';
import { Series, Points } from './chart-series';
import { AnimationModel } from '../../common/model/base-model';
import { Axis } from '../../chart/axis/axis';
import { MultiColoredSeries } from './multi-colored-base';

/**
 * `AreaSeries` module is used to render the area series.
 */
export class AreaSeries extends MultiColoredSeries {

    /**
     * Render Area series.
     * @return {void}
     * @private
     */
    public render(series: Series, xAxis: Axis, yAxis: Axis, isInverted: boolean): void {
        let startPoint: ChartLocation = null;
        let direction: string = '';
        let isPolar: boolean = (series.chart && series.chart.chartAreaType === 'PolarRadar');
        let origin: number = Math.max(<number>series.yAxis.visibleRange.min, 0);
        if (isPolar) {
            let connectPoints: { first: Points, last: Points } = this.getFirstLastVisiblePoint(series.points);
            origin = connectPoints.first.yValue;
        }
        let currentXValue: number;
        let isDropMode: boolean = (series.emptyPointSettings && series.emptyPointSettings.mode === 'Drop');
        let borderWidth: number = series.border ? series.border.width : 0;
        let borderColor: string = series.border ? series.border.color : 'transparent';
        let getCoordinate: Function = series.chart.chartAreaType === 'PolarRadar' ? TransformToVisible : getPoint;
        let visiblePoints: Points[] = this.enableComplexProperty(series);
        let point: Points;
        for (let i: number = 0; i < visiblePoints.length; i++) {
            point = visiblePoints[i];
            currentXValue = point.xValue;
            point.symbolLocations = [];
            point.regions = [];
            if (point.visible && withInRange(visiblePoints[i - 1], point, visiblePoints[i + 1], series)) {
                direction += this.getAreaPathDirection(
                    currentXValue, origin, series, isInverted, getCoordinate, startPoint,
                    'M'
                );
                startPoint = startPoint || new ChartLocation(currentXValue, origin);
                // First Point to draw the area path
                direction += this.getAreaPathDirection(
                    currentXValue, point.yValue, series, isInverted, getCoordinate, null,
                    'L'
                );
                if (visiblePoints[i + 1] && (!visiblePoints[i + 1].visible &&
                    (!isPolar || (isPolar && this.withinYRange(visiblePoints[i + 1], yAxis)))) && !isDropMode) {
                    direction += this.getAreaEmptyDirection(
                        { 'x': currentXValue, 'y': origin },
                        startPoint, series, isInverted, getCoordinate
                    );
                    startPoint = null;
                }
                this.storePointLocation(point, series, isInverted, getCoordinate);
            }
        }
        if (isPolar && direction !== '') {
            let endPoint: string = '';
            let chart: Chart = this.chart;
            endPoint += this.getAreaPathDirection(0, origin, series, isInverted, getCoordinate, null, 'L');
            if (xAxis.isInversed || yAxis.isInversed) {
                direction += (series.type === 'Polar' ? chart.polarSeriesModule.getPolarIsInversedPath(xAxis, endPoint) :
                    chart.radarSeriesModule.getRadarIsInversedPath(xAxis, endPoint));
            }
            direction = direction.concat(direction + ' ' + 'Z');
        }
        this.appendLinePath(
            new PathOption(
                series.chart.element.id + '_Series_' + series.index, series.interior,
                borderWidth, borderColor, series.opacity, series.dashArray,
                ((series.points.length > 1 && direction !== '') ? (direction + this.getAreaPathDirection(
                    series.points[series.points.length - 1].xValue,
                    series.chart.chartAreaType === 'PolarRadar' ?
                        series.points[series.points.length - 1].yValue : origin,
                    series, isInverted, getCoordinate, null, 'L'
                )) : '')
            ),
            series, ''
        );
        this.renderMarker(series);
    }
    /**
     * To destroy the area series.
     * @return {void}
     * @private
     */

    public destroy(chart: Chart): void {
        /**
         * Destroy method calling here
         */
    }

    /**
     * Get module name
     */

    protected getModuleName(): string {
        /**
         * Returns the module name of the series
         */
        return 'AreaSeries';
    }

    /**
     * Animates the series.
     * @param  {Series} series - Defines the series to animate.
     * @return {void}
     */
    public doAnimation(series: Series): void {
        let option: AnimationModel = series.animation;
        this.doLinearAnimation(series, option);
    }

}