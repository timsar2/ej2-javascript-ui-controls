import { Animation, Browser, ChildProperty, Collection, Complex, Component, Event, EventHandler, NotifyPropertyChanges, Property, createElement, remove } from '@syncfusion/ej2-base';
import { PathOption, SvgRenderer, getElement, measureText } from '@syncfusion/ej2-svg-base';

var __extends$1 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * helper for progress bar
 */
/** @private */
var Rect = /** @__PURE__ @class */ (function () {
    function Rect(x, y, height, width) {
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
    }
    return Rect;
}());
/** @private */
var Size = /** @__PURE__ @class */ (function () {
    function Size(height, width) {
        this.height = height;
        this.width = width;
    }
    return Size;
}());
/** @private */
var Pos = /** @__PURE__ @class */ (function () {
    function Pos(x, y) {
        this.x = x;
        this.y = y;
    }
    return Pos;
}());
/** @private */
var RectOption = /** @__PURE__ @class */ (function (_super) {
    __extends$1(RectOption, _super);
    function RectOption(id, fill, width, color, opacity, rect, rx, ry, transform, dashArray) {
        var _this = _super.call(this, id, fill, width, color, opacity, dashArray) || this;
        _this.y = rect.y;
        _this.x = rect.x;
        _this.height = rect.height;
        _this.width = rect.width;
        _this.rx = rx ? rx : 0;
        _this.ry = ry ? ry : 0;
        _this.transform = transform ? transform : '';
        _this.stroke = (width !== 0 && _this.stroke !== '') ? color : 'transparent';
        return _this;
    }
    return RectOption;
}(PathOption));
/** @private */
var ColorValue = /** @__PURE__ @class */ (function () {
    function ColorValue(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
    }
    return ColorValue;
}());
/** @private */
function convertToHexCode(value) {
    return '#' + componentToHex(value.r) + componentToHex(value.g) + componentToHex(value.b);
}
/** @private */
function componentToHex(value) {
    var hex = value.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
}
/** @private */
function convertHexToColor(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? new ColorValue(parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)) :
        new ColorValue(255, 255, 255);
}
/** @private */
function colorNameToHex(color) {
    var element;
    color = color === 'transparent' ? 'white' : color;
    document.body.appendChild(createElement('text', { id: 'chartmeasuretext' }));
    element = document.getElementById('chartmeasuretext');
    element.style.color = color;
    color = window.getComputedStyle(element).color;
    remove(element);
    var exp = /^(rgb|hsl)(a?)[(]\s*([\d.]+\s*%?)\s*,\s*([\d.]+\s*%?)\s*,\s*([\d.]+\s*%?)\s*(?:,\s*([\d.]+)\s*)?[)]$/;
    var isRGBValue = exp.exec(color);
    return convertToHexCode(new ColorValue(parseInt(isRGBValue[3], 10), parseInt(isRGBValue[4], 10), parseInt(isRGBValue[5], 10)));
}
/** @private */
var TextOption = /** @__PURE__ @class */ (function () {
    function TextOption(id, fontSize, fontStyle, fontFamily, fontWeight, textAnchor, fill, x, y, width, height) {
        this.id = id;
        this['font-size'] = fontSize;
        this['font-style'] = fontStyle;
        this['font-family'] = fontFamily;
        this['font-weight'] = fontWeight;
        this['text-anchor'] = textAnchor;
        this.fill = fill;
        this.x = x;
        this.y = y;
        this.width = width ? width : 0;
        this.height = height ? height : 0;
    }
    return TextOption;
}());
/** calculate the start and end point of circle */
function degreeToLocation(centerX, centerY, radius, angleInDegrees) {
    var angleInRadians = (angleInDegrees - 90) * (Math.PI / 180);
    return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
    };
}
/** calculate the path of the circle */
function getPathArc(x, y, radius, startAngle, endAngle, enableRtl, pieView) {
    var start = degreeToLocation(x, y, radius, startAngle);
    var end = degreeToLocation(x, y, radius, endAngle);
    var largeArcFlag = '0';
    var sweepFlag = (enableRtl) ? '0' : '1';
    if (!enableRtl) {
        largeArcFlag = ((endAngle >= startAngle) ? endAngle : endAngle + 360) - startAngle <= 180 ? '0' : '1';
    }
    else {
        largeArcFlag = ((startAngle >= endAngle) ? startAngle : startAngle + 360) - endAngle <= 180 ? '0' : '1';
    }
    var d;
    if (pieView) {
        d = 'M ' + x + ' ' + y + ' L ' + start.x + ' ' + start.y + ' A ' + radius + ' ' +
            radius + ' ' + ' 0 ' + ' ' + largeArcFlag + ' ' + sweepFlag + ' ' + end.x + ' ' + end.y + ' ' + 'Z';
    }
    else {
        d = 'M' + start.x + ' ' + start.y +
            'A' + radius + ' ' + radius + ' ' + '0' + ' ' + largeArcFlag + ' ' + sweepFlag + ' ' + end.x + ' ' + end.y;
    }
    return d;
}
/** @private */
function stringToNumber(value, containerSize) {
    if (value !== null && value !== undefined) {
        return value.indexOf('%') !== -1 ? (containerSize / 100) * parseInt(value, 10) : parseInt(value, 10);
    }
    return null;
}
/** @private */
// tslint:disable-next-line
function setAttributes(options, element) {
    var keys = Object.keys(options);
    for (var i = 0; i < keys.length; i++) {
        element.setAttribute(keys[i], options[keys[i]]);
    }
    return element;
}
/**
 * Animation Effect Calculation
 * @private
 */
function effect(currentTime, startValue, endValue, duration, enableRtl) {
    var start = (enableRtl) ? endValue : -endValue;
    var end = startValue + ((enableRtl) ? -endValue : endValue);
    return start * Math.cos(currentTime / duration * (Math.PI / 2)) + end;
}
/**
 * @private
 */
var annotationRender = 'annotationRender';
/**
 * @private
 */
function getElement$1(id) {
    return document.getElementById(id);
}
/**
 * @private
 */
function removeElement(id) {
    if (!id) {
        return null;
    }
    var element = typeof id === 'string' ? getElement$1(id) : id;
    if (element) {
        remove(element);
    }
}
/**
 * @private
 */
var ProgressLocation = /** @__PURE__ @class */ (function () {
    function ProgressLocation(x, y) {
        this.x = x;
        this.y = y;
    }
    return ProgressLocation;
}());

var __extends$2 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate$1 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * progress bar complex interface
 */
var Margin = /** @__PURE__ @class */ (function (_super) {
    __extends$2(Margin, _super);
    function Margin() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$1([
        Property(10)
    ], Margin.prototype, "top", void 0);
    __decorate$1([
        Property(10)
    ], Margin.prototype, "bottom", void 0);
    __decorate$1([
        Property(10)
    ], Margin.prototype, "left", void 0);
    __decorate$1([
        Property(10)
    ], Margin.prototype, "right", void 0);
    return Margin;
}(ChildProperty));
/**
 * Configures the fonts in progressbar
 */
var Font = /** @__PURE__ @class */ (function (_super) {
    __extends$2(Font, _super);
    function Font() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$1([
        Property('Normal')
    ], Font.prototype, "fontStyle", void 0);
    __decorate$1([
        Property('16px')
    ], Font.prototype, "size", void 0);
    __decorate$1([
        Property('Normal')
    ], Font.prototype, "fontWeight", void 0);
    __decorate$1([
        Property('')
    ], Font.prototype, "color", void 0);
    __decorate$1([
        Property('Segoe UI')
    ], Font.prototype, "fontFamily", void 0);
    __decorate$1([
        Property(1)
    ], Font.prototype, "opacity", void 0);
    __decorate$1([
        Property('Far')
    ], Font.prototype, "textAlignment", void 0);
    __decorate$1([
        Property('')
    ], Font.prototype, "text", void 0);
    return Font;
}(ChildProperty));
/**
 * Animation
 */
var Animation$1 = /** @__PURE__ @class */ (function (_super) {
    __extends$2(Animation$$1, _super);
    function Animation$$1() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$1([
        Property(false)
    ], Animation$$1.prototype, "enable", void 0);
    __decorate$1([
        Property(2000)
    ], Animation$$1.prototype, "duration", void 0);
    __decorate$1([
        Property(0)
    ], Animation$$1.prototype, "delay", void 0);
    __decorate$1([
        Property('Linear')
    ], Animation$$1.prototype, "timing", void 0);
    return Animation$$1;
}(ChildProperty));
/**
 * Annotation
 */
var ProgressAnnotationSettings = /** @__PURE__ @class */ (function (_super) {
    __extends$2(ProgressAnnotationSettings, _super);
    function ProgressAnnotationSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$1([
        Property(null)
    ], ProgressAnnotationSettings.prototype, "content", void 0);
    __decorate$1([
        Property(0)
    ], ProgressAnnotationSettings.prototype, "annotationAngle", void 0);
    __decorate$1([
        Property('0%')
    ], ProgressAnnotationSettings.prototype, "annotationRadius", void 0);
    return ProgressAnnotationSettings;
}(ChildProperty));
/**
 * RangeColor
 */
var RangeColor = /** @__PURE__ @class */ (function (_super) {
    __extends$2(RangeColor, _super);
    function RangeColor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$1([
        Property('')
    ], RangeColor.prototype, "color", void 0);
    __decorate$1([
        Property(null)
    ], RangeColor.prototype, "start", void 0);
    __decorate$1([
        Property(null)
    ], RangeColor.prototype, "end", void 0);
    return RangeColor;
}(ChildProperty));

/** @private */
// tslint:disable-next-line:max-func-body-length
function getProgressThemeColor(theme) {
    var style;
    switch (theme) {
        case 'Material':
            style = {
                linearTrackColor: '#E3165B',
                linearProgressColor: '#E3165B',
                circularTrackColor: '#E3165B',
                circularProgressColor: '#E3165B',
                backgroundColor: 'transparent',
                fontColor: '#000000',
                linearFontFamily: 'Roboto',
                linearFontSize: '12',
                linearFontStyle: 'Regular',
                circularFontFamily: 'Roboto',
                circularFontStyle: 'Normal',
                circularFontSize: '20',
                progressOpacity: 1,
                trackOpacity: 0.26,
                bufferOpacity: 0.4,
                linearGapWidth: 4,
                circularGapWidth: 4,
                linearTrackThickness: 4,
                linearProgressThickness: 4,
                circularTrackThickness: 4,
                circularProgressThickness: 4,
                success: '#4D841E',
                danger: '#D74113',
                warning: '#C25700',
                info: '#0279D6',
            };
            break;
        case 'Bootstrap':
            style = {
                linearTrackColor: '#EEEEEE',
                linearProgressColor: '#317ab9',
                circularTrackColor: '#EEEEEE',
                circularProgressColor: '#317ab9',
                backgroundColor: 'transparent',
                fontColor: '#000000',
                linearFontFamily: 'Helvetica',
                linearFontStyle: 'Regular',
                linearFontSize: '12',
                circularFontFamily: 'Segoe UI',
                circularFontStyle: 'Normal',
                circularFontSize: '20',
                progressOpacity: 1,
                trackOpacity: 1,
                bufferOpacity: 0.44,
                linearGapWidth: 4,
                circularGapWidth: 4,
                linearTrackThickness: 20,
                linearProgressThickness: 20,
                circularTrackThickness: 6,
                circularProgressThickness: 6,
                success: '#4CB051',
                danger: '#DC3244',
                warning: '#AA6709',
                info: '#1A819E',
            };
            break;
        case 'Bootstrap4':
            style = {
                linearTrackColor: '#E9ECEF',
                linearProgressColor: '#007bff',
                circularTrackColor: '#E9ECEF',
                circularProgressColor: '#007bff',
                backgroundColor: 'transparent',
                fontColor: '#000000',
                linearFontFamily: 'Helvetica',
                linearFontStyle: 'Regular',
                linearFontSize: '12',
                circularFontFamily: 'Helvetica',
                circularFontStyle: 'Normal',
                circularFontSize: '20',
                progressOpacity: 1,
                trackOpacity: 1,
                bufferOpacity: 0.44,
                linearGapWidth: 4,
                circularGapWidth: 4,
                linearTrackThickness: 16,
                linearProgressThickness: 16,
                circularTrackThickness: 6,
                circularProgressThickness: 6,
                success: '#29A745',
                danger: '#DC3546',
                warning: '#FFC106',
                info: '#17A2B8',
            };
            break;
        case 'HighContrast':
            style = {
                linearTrackColor: '#BFBFBF',
                linearProgressColor: '#FFD939',
                circularTrackColor: '#BFBFBF',
                circularProgressColor: '#FFD939',
                backgroundColor: 'transparent',
                fontColor: '#FFFFFF',
                linearFontFamily: 'Segoe UI',
                linearFontSize: '12',
                linearFontStyle: 'Regular',
                circularFontFamily: 'Segoe UI',
                circularFontStyle: 'Normal',
                circularFontSize: '20',
                progressOpacity: 1,
                trackOpacity: 1,
                bufferOpacity: 0.35,
                linearGapWidth: 2,
                circularGapWidth: 4,
                linearTrackThickness: 2,
                linearProgressThickness: 2,
                circularTrackThickness: 4,
                circularProgressThickness: 4,
                success: '#176600',
                danger: '#B30A00',
                warning: '#944000',
                info: '#0156B3',
            };
            break;
        default:
            style = {
                linearTrackColor: '#EAEAEA',
                linearProgressColor: '#0078D6',
                circularTrackColor: '#E6E6E6',
                circularProgressColor: '#0078D6',
                backgroundColor: 'transparent',
                fontColor: '#333333',
                linearFontFamily: 'Segoe UI',
                linearFontStyle: 'Regular',
                linearFontSize: '12',
                circularFontFamily: 'Segoe UI',
                circularFontStyle: 'Normal',
                circularFontSize: '20',
                progressOpacity: 1,
                trackOpacity: 1,
                bufferOpacity: 0.3,
                linearGapWidth: 2,
                circularGapWidth: 4,
                linearTrackThickness: 2,
                linearProgressThickness: 2,
                circularTrackThickness: 4,
                circularProgressThickness: 4,
                success: '#127C0F',
                danger: '#C00000',
                warning: '#D83B01',
                info: '#0279D6',
            };
            break;
    }
    return style;
}

/**
 * corner Radius
 */
var lineCapRadius = 0.9;
/**
 * complete Angle
 */
var completeAngle = 359.99;
/**
 * valueChanged event
 */
var valueChanged = 'valueChanged';
/**
 * progressCompleted event
 */
var progressCompleted = 'progressCompleted';
/**
 * mouseClick event
 */
var mouseClick = 'mouseClick';
/**
 * mouseDown event
 */
var mouseDown = 'mouseDown';
/**
 * mouseUp event
 */
var mouseUp = 'mouseUp';
/**
 * mouseMove event
 */
var mouseMove = 'mouseMove';
/**
 * mouseLeave event
 */
var mouseLeave = 'mouseLeave';
/**
 * svgLink
 */
var svgLink = 'http://www.w3.org/2000/svg';
/**
 * gradient type
 */
var gradientType = 'linearGradient';
/**
 * stop element
 */
var stopElement = 'stop';

/**
 * Base file for annotation
 */
var AnnotationBase = /** @__PURE__ @class */ (function () {
    /**
     * Constructor for progress annotation
     * @param control
     */
    function AnnotationBase(control) {
        this.control = control;
    }
    AnnotationBase.prototype.render = function (annotation, index) {
        this.annotation = annotation;
        var childElement = createElement('div', {
            id: this.control.element.id + 'Annotation' + index,
            styles: 'position:absolute;z-index:1', innerHTML: annotation.content
        });
        return childElement;
    };
    /**
     * To process the annotation
     * @param annotation
     * @param index
     * @param parentElement
     */
    AnnotationBase.prototype.processAnnotation = function (annotation, index, parentElement) {
        var annotationElement;
        var location;
        location = new ProgressLocation(0, 0);
        annotationElement = this.render(annotation, index);
        if (annotationElement) {
            this.setElementStyle(location, annotationElement, parentElement);
        }
        else if (this.control.redraw) {
            removeElement(annotationElement.id);
        }
    };
    AnnotationBase.prototype.setElementStyle = function (location, element, parentElement) {
        var argsData = {
            cancel: false, name: annotationRender, content: element,
            location: location
        };
        this.control.trigger(annotationRender, argsData);
        if (!argsData.cancel) {
            var result = this.Location(this.annotation.annotationRadius, this.annotation.annotationAngle);
            argsData.content.style.left = result.left + 'px';
            argsData.content.style.top = result.top + 'px';
            argsData.content.style.transform = 'translate(-50%, -50%)';
            argsData.content.setAttribute('aria-label', 'Annotation');
            parentElement.appendChild(argsData.content);
        }
    };
    AnnotationBase.prototype.Location = function (radius, angle) {
        var top;
        var left;
        var radius1 = parseFloat(radius);
        if (radius1 === 0 && angle === 0) {
            var rect = this.control.progressRect;
            left = rect.x + (rect.width / 2);
            top = rect.y + (rect.height / 2);
        }
        else {
            var degToRadFactor = Math.PI / 180;
            angle = angle - 90;
            angle = angle * degToRadFactor;
            var x = Math.round(this.control.progressSize.width / 2.25);
            var y = Math.round(this.control.progressSize.height / 2.25);
            left = (radius1 * Math.cos(angle)) + x;
            top = (radius1 * Math.sin(angle)) + y;
        }
        return {
            top: top, left: left
        };
    };
    return AnnotationBase;
}());

/**
 * Animation for progress bar
 */
var ProgressAnimation = /** @__PURE__ @class */ (function () {
    function ProgressAnimation() {
    }
    /** Linear Animation */
    ProgressAnimation.prototype.doLinearAnimation = function (element, progress, delay, previousWidth, active) {
        var _this = this;
        var animation = new Animation({});
        var linearPath = element;
        var width = linearPath.getAttribute('width');
        var x = linearPath.getAttribute('x');
        var opacityValue = 0;
        var value = 0;
        var start = (!progress.enableRtl) ? previousWidth : parseInt(x, 10);
        var end = (!progress.enableRtl) ? parseInt(width, 10) - start : parseInt(width, 10) - previousWidth;
        var rtlX = parseInt(x, 10) - end;
        linearPath.style.visibility = 'hidden';
        animation.animate(linearPath, {
            duration: progress.animation.duration,
            delay: delay,
            progress: function (args) {
                if (progress.enableRtl) {
                    if (args.timeStamp >= args.delay) {
                        linearPath.style.visibility = 'visible';
                        value = effect(args.timeStamp, start, end, args.duration, progress.enableRtl);
                        linearPath.setAttribute('x', value.toString());
                        if (progress.isActive) {
                            opacityValue = effect(args.timeStamp, 0.5, 0.5, args.duration, true);
                            active.setAttribute('opacity', opacityValue.toString());
                        }
                    }
                }
                else {
                    if (args.timeStamp >= args.delay) {
                        linearPath.style.visibility = 'visible';
                        value = effect(args.timeStamp, start, end, args.duration, progress.enableRtl);
                        linearPath.setAttribute('width', value.toString());
                        if (progress.isActive) {
                            opacityValue = effect(args.timeStamp, 0.5, 0.5, args.duration, true);
                            active.setAttribute('opacity', opacityValue.toString());
                        }
                    }
                }
            },
            end: function (model) {
                if (progress.enableRtl) {
                    if (progress.isActive) {
                        linearPath.setAttribute('x', x.toString());
                        _this.doLinearAnimation(element, progress, delay, previousWidth, active);
                    }
                    else {
                        linearPath.setAttribute('x', rtlX.toString());
                    }
                }
                else {
                    linearPath.setAttribute('width', width);
                    if (progress.isActive) {
                        _this.doLinearAnimation(element, progress, delay, previousWidth, active);
                    }
                }
                progress.trigger('animationComplete', {
                    value: progress.value, trackColor: progress.trackColor,
                    progressColor: progress.progressColor
                });
            }
        });
    };
    /** Linear Indeterminate */
    ProgressAnimation.prototype.doLinearIndeterminate = function (element, progressWidth, thickness, progress) {
        var _this = this;
        var animation = new Animation({});
        var linearPath = element;
        var x = linearPath.getAttribute('x');
        var width = linearPath.getAttribute('width');
        var value = 0;
        var start = (width) ? -(parseInt(width, 10)) : -progressWidth;
        var end = (progress.progressRect.x + progress.progressRect.width) + ((width) ? (parseInt(width, 10)) : progressWidth);
        var duration = (!progress.trackSegmentDisable) ? 2500 : 3500;
        animation.animate(linearPath, {
            duration: duration,
            delay: 0,
            progress: function (args) {
                if (progress.enableRtl) {
                    value = effect(args.timeStamp, parseInt(x, 10) || progress.progressRect.x + progressWidth, end, args.duration, progress.enableRtl);
                    if (!progress.trackSegmentDisable) {
                        linearPath.setAttribute('x', value.toString());
                    }
                    else {
                        linearPath.setAttribute('d', progress.getPathLine(value, progressWidth, thickness));
                    }
                }
                else {
                    value = effect(args.timeStamp, start, end, args.duration, progress.enableRtl);
                    if (!progress.trackSegmentDisable) {
                        linearPath.setAttribute('x', value.toString());
                    }
                    else {
                        linearPath.setAttribute('d', progress.getPathLine(value, progressWidth, thickness));
                    }
                }
            },
            end: function () {
                if (progress.enableRtl && !progress.trackSegmentDisable) {
                    linearPath.setAttribute('x', x.toString());
                }
                else if (!progress.trackSegmentDisable) {
                    linearPath.setAttribute('x', start.toString());
                }
                _this.doLinearIndeterminate(element, progressWidth, thickness, progress);
            }
        });
    };
    /** Linear striped */
    ProgressAnimation.prototype.doStripedAnimation = function (element, progress, value, delay) {
        var _this = this;
        var animation = new Animation({});
        var point = 1500 / progress.animation.duration;
        animation.animate(element, {
            duration: progress.animation.duration,
            delay: progress.animation.delay,
            progress: function () {
                value += (progress.enableRtl) ? -point : point;
                element.setAttribute('gradientTransform', 'translate(' + value + ') rotate(-45)');
            },
            end: function () {
                _this.doStripedAnimation(element, progress, value, false);
            }
        });
    };
    /** Circular animation */
    ProgressAnimation.prototype.doCircularAnimation = function (x, y, radius, progressEnd, totalEnd, element, progress, thickness, delay, startValue, previousTotal, active) {
        var _this = this;
        var animation = new Animation({});
        var circularPath = element;
        var start = progress.startAngle;
        var pathRadius = radius + (thickness / 2);
        var end = 0;
        var opacityValue = 0;
        var endValue;
        start += (progress.cornerRadius === 'Round' && totalEnd !== completeAngle && totalEnd !== 0) ?
            ((progress.enableRtl) ? (lineCapRadius / 2) * thickness : -(lineCapRadius / 2) * thickness) : 0;
        totalEnd += (progress.cornerRadius === 'Round' && totalEnd !== completeAngle && totalEnd !== 0) ?
            (lineCapRadius / 2) * thickness : 0;
        progressEnd += (progress.cornerRadius === 'Round' && totalEnd !== completeAngle && totalEnd !== 0) ?
            ((progress.enableRtl) ? -(lineCapRadius / 2) * thickness : (lineCapRadius / 2) * thickness) : 0;
        endValue = (startValue) ? totalEnd - previousTotal : 0;
        circularPath.setAttribute('visibility', 'Hidden');
        animation.animate(circularPath, {
            duration: progress.animation.duration,
            delay: delay,
            progress: function (args) {
                if (args.timeStamp >= args.delay) {
                    circularPath.setAttribute('visibility', 'visible');
                    end = effect(args.timeStamp, startValue || start, endValue || totalEnd, args.duration, progress.enableRtl);
                    circularPath.setAttribute('d', getPathArc(x, y, pathRadius, start, end % 360, progress.enableRtl, true));
                    if (progress.isActive) {
                        opacityValue = effect(args.timeStamp, 0.5, 0.5, args.duration, true);
                        active.setAttribute('opacity', opacityValue.toString());
                    }
                }
            },
            end: function (model) {
                circularPath.setAttribute('d', getPathArc(x, y, pathRadius, start, progressEnd, progress.enableRtl, true));
                if (progress.isActive) {
                    _this.doCircularAnimation(x, y, radius, progressEnd, totalEnd, element, progress, thickness, delay, startValue, previousTotal, active);
                }
                progress.trigger('animationComplete', {
                    value: progress.value, trackColor: progress.trackColor,
                    progressColor: progress.progressColor
                });
            }
        });
    };
    /** Circular indeterminate */
    ProgressAnimation.prototype.doCircularIndeterminate = function (circularProgress, progress, start, end, x, y, radius, thickness) {
        var _this = this;
        var animation = new Animation({});
        var pathRadius = radius + ((!progress.trackSegmentDisable) ? (thickness / 2) : 0);
        var value = (!progress.trackSegmentDisable) ? 3 : 2;
        animation.animate(circularProgress, {
            progress: function () {
                start += (progress.enableRtl) ? -value : value;
                end += (progress.enableRtl) ? -value : value;
                circularProgress.setAttribute('d', getPathArc(x, y, pathRadius, start % 360, end % 360, progress.enableRtl, !progress.trackSegmentDisable));
            },
            end: function (model) {
                _this.doCircularIndeterminate(circularProgress, progress, start, end, x, y, radius, thickness);
            }
        });
    };
    /** To do the label animation for progress bar */
    ProgressAnimation.prototype.doLabelAnimation = function (labelPath, start, end, progress, delay, textSize) {
        var animation = new Animation({});
        var label = new Animation({});
        var startPos;
        var endPos;
        var text = labelPath.innerHTML;
        var value = 0;
        var xPos = 0;
        var valueChanged$$1 = 0;
        var percentage = 100;
        var labelText = progress.labelStyle.text;
        var labelPos = progress.labelStyle.textAlignment;
        var posX = parseInt(labelPath.getAttribute('x'), 10);
        labelPath.setAttribute('visibility', 'Hidden');
        if (progress.type === 'Linear') {
            startPos = (progress.enableRtl) ? (progress.progressRect.x + progress.progressRect.width) + (textSize / 2) :
                progress.progressRect.x - (textSize / 2);
            startPos = (startPos <= 0) ? 0 : startPos;
            endPos = (progress.enableRtl) ? startPos - posX : posX - startPos;
        }
        animation.animate(labelPath, {
            duration: progress.animation.duration,
            delay: delay,
            progress: function (args) {
                if (progress.type === 'Linear') {
                    if (args.timeStamp >= args.delay) {
                        if (labelText === '') {
                            labelPath.setAttribute('visibility', 'visible');
                            value = effect(args.timeStamp, start, end, args.duration, false);
                            valueChanged$$1 = parseInt(((value / progress.progressRect.width) * percentage).toString(), 10);
                            labelPath.innerHTML = valueChanged$$1.toString() + '%';
                            if (labelPos === 'Far' || labelPos === 'Center') {
                                xPos = effect(args.timeStamp, startPos, endPos, args.duration, progress.enableRtl);
                                labelPath.setAttribute('x', xPos.toString());
                            }
                        }
                    }
                }
                else if (progress.type === 'Circular') {
                    if (labelText === '') {
                        labelPath.setAttribute('visibility', 'visible');
                        value = effect(args.timeStamp, start, end, args.duration, false);
                        valueChanged$$1 = parseInt((((value - start) / progress.totalAngle) * percentage).toString(), 10);
                        labelPath.innerHTML = valueChanged$$1.toString() + '%';
                    }
                }
            },
            end: function () {
                if (labelText === '') {
                    labelPath.innerHTML = text;
                    labelPath.setAttribute('x', posX.toString());
                }
                else {
                    label.animate(labelPath, {
                        progress: function (args) {
                            labelPath.setAttribute('visibility', 'visible');
                            value = effect(args.timeStamp, 0, 1, args.duration, false);
                            labelPath.setAttribute('opacity', value.toString());
                        },
                        end: function () {
                            labelPath.setAttribute('opacity', '1');
                        }
                    });
                }
            }
        });
    };
    /** To do the annotation animation for circular progress bar */
    ProgressAnimation.prototype.doAnnotationAnimation = function (circularPath, progress, previousEnd, previousTotal) {
        var animation = new Animation({});
        var value = 0;
        var percentage = 100;
        var isAnnotation = progress.annotations.length > 0;
        var annotatElementChanged;
        var firstAnnotatElement;
        var start = progress.startAngle;
        var totalAngle = progress.totalAngle;
        var totalEnd;
        var annotateValueChanged;
        var annotateValue;
        var endValue;
        if (isAnnotation && progress.progressAnnotationModule) {
            firstAnnotatElement = document.getElementById(progress.element.id + 'Annotation0').children[0];
            if (firstAnnotatElement && firstAnnotatElement.children[0]) {
                if (firstAnnotatElement.children[0].tagName === 'SPAN') {
                    annotatElementChanged = firstAnnotatElement.children[0];
                }
            }
        }
        totalEnd = ((progress.value - progress.minimum) / (progress.maximum - progress.minimum)) * progress.totalAngle;
        progress.annotateTotal = totalEnd = (progress.value < progress.minimum || progress.value > progress.maximum) ? 0 : totalEnd;
        progress.annotateEnd = start + totalEnd;
        annotateValue = ((progress.value - progress.minimum) / (progress.maximum - progress.minimum)) * percentage;
        annotateValue = (progress.value < progress.minimum || progress.value > progress.maximum) ? 0 : Math.round(annotateValue);
        endValue = (previousEnd) ? totalEnd - previousTotal : 0;
        if (progress.value <= progress.minimum || progress.value > progress.maximum) {
            annotatElementChanged.innerHTML = annotateValue + '%';
        }
        else {
            animation.animate(circularPath, {
                duration: progress.animation.duration,
                delay: progress.animation.delay,
                progress: function (args) {
                    if (isAnnotation && annotatElementChanged) {
                        value = effect(args.timeStamp, previousEnd || start, endValue || totalEnd, args.duration, false);
                        annotateValueChanged = parseInt((((Math.round(value) - start) / totalAngle) * percentage).toString(), 10);
                        annotatElementChanged.innerHTML = annotateValueChanged ? annotateValueChanged.toString() + '%' : '0%';
                    }
                },
                end: function (model) {
                    annotatElementChanged.innerHTML = annotateValue + '%';
                }
            });
        }
    };
    return ProgressAnimation;
}());

var __extends$3 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * Class for progress annotation
 */
var ProgressAnnotation = /** @__PURE__ @class */ (function (_super) {
    __extends$3(ProgressAnnotation, _super);
    /**
     * Constructor for ProgressBar annotation
     * @private
     */
    function ProgressAnnotation(control, annotations) {
        var _this = _super.call(this, control) || this;
        _this.animation = new ProgressAnimation();
        _this.progress = control;
        _this.annotations = annotations;
        return _this;
    }
    /**
     * Method to render the annotation for ProgressBar
     * @param element
     * @private
     */
    ProgressAnnotation.prototype.renderAnnotations = function (element) {
        var _this = this;
        this.annotations = this.progress.annotations;
        var parentElement = document.getElementById(this.progress.element.id + 'Annotation_collections');
        var annotationElement;
        this.parentElement = parentElement ? parentElement : createElement('div', {
            id: this.progress.element.id + 'Annotation_collections',
            styles: 'position:absolute'
        });
        this.annotations.map(function (annotation, index) {
            _this.processAnnotation(annotation, index, _this.parentElement);
        });
        if (!parentElement) {
            element.appendChild(this.parentElement);
        }
        if (this.progress.animation.enable && !this.progress.isIndeterminate) {
            annotationElement = document.getElementById(this.progress.element.id + 'Annotation0').children[0];
            this.animation.doAnnotationAnimation(annotationElement, this.progress);
        }
    };
    /**
     * Get module name.
     */
    ProgressAnnotation.prototype.getModuleName = function () {
        return 'ProgressAnnotation';
    };
    /**
     * To destroy the annotation.
     * @return {void}
     * @private
     */
    ProgressAnnotation.prototype.destroy = function (control) {
        // Destroy method performed here
    };
    return ProgressAnnotation;
}(AnnotationBase));

/**
 * Progressbar Segment
 */
var Segment = /** @__PURE__ @class */ (function () {
    function Segment() {
    }
    /** To render the linear segment */
    Segment.prototype.createLinearSegment = function (progress, id, width, opacity, thickness, progressWidth) {
        var locX = (progress.enableRtl) ? ((progress.cornerRadius === 'Round') ?
            (progress.progressRect.x + progress.progressRect.width) - ((lineCapRadius / 2) * thickness) :
            (progress.progressRect.x + progress.progressRect.width)) :
            ((progress.cornerRadius === 'Round') ? (progress.progressRect.x + (lineCapRadius / 2) * thickness) : progress.progressRect.x);
        var locY = (progress.progressRect.y + (progress.progressRect.height / 2));
        var gapWidth = (progress.gapWidth || progress.themeStyle.linearGapWidth);
        var avlWidth = progressWidth / progress.segmentCount;
        var avlSegWidth = (progressWidth - ((progress.segmentCount - 1) * gapWidth));
        avlSegWidth = (avlSegWidth -
            ((progress.cornerRadius === 'Round') ? progress.segmentCount * (lineCapRadius * thickness) : 0)) / progress.segmentCount;
        var gap = (progress.cornerRadius === 'Round') ? (gapWidth + (lineCapRadius * thickness)) : gapWidth;
        var segmentGroup = progress.renderer.createGroup({ 'id': progress.element.id + id });
        var count = Math.ceil(width / avlWidth);
        var segWidth;
        var color;
        var j = 0;
        var option;
        var segmentPath;
        var tolWidth = (progress.cornerRadius === 'Round') ? (width - (lineCapRadius * thickness)) : width;
        var linearThickness = progress.progressThickness || progress.themeStyle.linearProgressThickness;
        for (var i = 0; i < count; i++) {
            segWidth = (tolWidth < avlSegWidth) ? tolWidth : avlSegWidth;
            if (j < progress.segmentColor.length) {
                color = progress.segmentColor[j];
                j++;
            }
            else {
                j = 0;
                color = progress.segmentColor[j];
                j++;
            }
            option = new PathOption(progress.element.id + id + i, 'none', linearThickness, color, opacity, '0', this.getLinearSegmentPath(locX, locY, segWidth, progress.enableRtl));
            segmentPath = progress.renderer.drawPath(option);
            if (progress.cornerRadius === 'Round') {
                segmentPath.setAttribute('stroke-linecap', 'round');
            }
            segmentGroup.appendChild(segmentPath);
            locX += (progress.enableRtl) ? -avlSegWidth - gap : avlSegWidth + gap;
            tolWidth -= avlSegWidth + gap;
            tolWidth = (tolWidth < 0) ? 0 : tolWidth;
        }
        return segmentGroup;
    };
    Segment.prototype.getLinearSegmentPath = function (x, y, width, enableRtl) {
        return 'M' + ' ' + x + ' ' + y + ' ' + 'L' + (x + ((enableRtl) ? -width : width)) + ' ' + y;
    };
    /** To render the circular segment */
    Segment.prototype.createCircularSegment = function (progress, id, x, y, r, value, opacity, thickness, totalAngle, progressWidth) {
        var start = progress.startAngle;
        var end = this.widthToAngle(progress.minimum, progress.maximum, value, progress.totalAngle);
        end -= (progress.cornerRadius === 'Round' && progress.totalAngle === completeAngle) ?
            this.widthToAngle(0, progressWidth, ((lineCapRadius / 2) * thickness), totalAngle) : 0;
        var size = (progressWidth - ((progress.totalAngle === completeAngle) ? progress.segmentCount :
            progress.segmentCount - 1) * (progress.gapWidth || progress.themeStyle.circularGapWidth));
        size = (size -
            ((progress.cornerRadius === 'Round') ?
                (((progress.totalAngle === completeAngle) ?
                    progress.segmentCount : progress.segmentCount - 1) * lineCapRadius * thickness) : 0)) / progress.segmentCount;
        var avlTolEnd = this.widthToAngle(0, progressWidth, (progressWidth / progress.segmentCount), totalAngle);
        avlTolEnd -= (progress.cornerRadius === 'Round' && progress.totalAngle === completeAngle) ?
            this.widthToAngle(0, progressWidth, ((lineCapRadius / 2) * thickness), totalAngle) : 0;
        var avlEnd = this.widthToAngle(0, progressWidth, size, totalAngle);
        var gap = this.widthToAngle(0, progressWidth, (progress.gapWidth || progress.themeStyle.circularGapWidth), totalAngle);
        gap += (progress.cornerRadius === 'Round') ? this.widthToAngle(0, progressWidth, (lineCapRadius * thickness), totalAngle) : 0;
        var segmentGroup = progress.renderer.createGroup({ 'id': progress.element.id + id });
        var gapCount = Math.floor(end / avlTolEnd);
        var count = Math.ceil((end - gap * gapCount) / avlEnd);
        var segmentPath;
        var circularSegment;
        var segmentEnd;
        var avlSegEnd = (start + ((progress.enableRtl) ? -avlEnd : avlEnd)) % 360;
        var color;
        var j = 0;
        var option;
        var circularThickness = progress.progressThickness || progress.themeStyle.circularProgressThickness;
        for (var i = 0; i < count; i++) {
            segmentEnd = (progress.enableRtl) ? ((progress.startAngle - end > avlSegEnd) ? progress.startAngle - end : avlSegEnd) :
                ((progress.startAngle + end < avlSegEnd) ? progress.startAngle + end : avlSegEnd);
            segmentPath = getPathArc(x, y, r, start, segmentEnd, progress.enableRtl);
            if (j < progress.segmentColor.length) {
                color = progress.segmentColor[j];
                j++;
            }
            else {
                j = 0;
                color = progress.segmentColor[j];
                j++;
            }
            option = new PathOption(progress.element.id + id + i, 'none', circularThickness, color, opacity, '0', segmentPath);
            circularSegment = progress.renderer.drawPath(option);
            if (progress.cornerRadius === 'Round') {
                circularSegment.setAttribute('stroke-linecap', 'round');
            }
            segmentGroup.appendChild(circularSegment);
            start = segmentEnd + ((progress.enableRtl) ? -gap : gap);
            avlSegEnd += (progress.enableRtl) ? -avlEnd - gap : avlEnd + gap;
        }
        return segmentGroup;
    };
    Segment.prototype.widthToAngle = function (min, max, value, totalAngle) {
        var angle = ((value - min) / (max - min)) * totalAngle;
        return angle;
    };
    Segment.prototype.createLinearRange = function (totalWidth, progress) {
        var posX = progress.progressRect.x + ((progress.enableRtl) ? progress.progressRect.width : 0);
        var startY = (progress.progressRect.y + (progress.progressRect.height / 2));
        var rangeGroup = progress.renderer.createGroup({ 'id': progress.element.id + '_LinearRangeGroup' });
        var range = progress.rangeColors;
        var thickness = progress.progressThickness || progress.themeStyle.linearProgressThickness;
        var opacity = progress.themeStyle.progressOpacity;
        var rangeMin = progress.minimum;
        var rangeMax = progress.value;
        var gradX = (progress.enableRtl) ? 0.1 : -0.1;
        var gradient;
        var validRange;
        var rangePath;
        var option;
        var startPos;
        var endPos;
        var startX;
        var endX;
        var color;
        var endColor;
        for (var i = 0; i < range.length; i++) {
            validRange = (range[i].start >= rangeMin && range[i].start <= rangeMax &&
                range[i].end >= rangeMin && range[i].end <= rangeMax);
            startPos = totalWidth * progress.calculateProgressRange(range[i].start, rangeMin, rangeMax);
            endPos = totalWidth * progress.calculateProgressRange(range[i].end, rangeMin, rangeMax);
            startX = posX + ((progress.enableRtl) ? -startPos : startPos);
            endX = posX + ((progress.enableRtl) ? -endPos : endPos);
            startX = (validRange) ? ((progress.isGradient && i > 0) ? startX + gradX : startX) : posX;
            endX = (validRange) ? endX : posX;
            color = (progress.isGradient) ? 'url(#lineRangeGrad_' + i + ')' : range[i].color;
            option = new PathOption(progress.element.id + '_LinearRange_' + i, 'none', thickness, color, opacity, '0', 'M' + ' ' + startX + ' ' + startY + ' ' + 'L' + endX + ' ' + startY);
            rangePath = progress.renderer.drawPath(option);
            rangeGroup.appendChild(rangePath);
            if (progress.isGradient) {
                if (range.length - 1 === i) {
                    endColor = range[i].color;
                }
                else {
                    endColor = range[i + 1].color;
                }
                gradient = this.setLinearGradientColor(i, range[i].color, endColor, startX, endX, progress);
                rangeGroup.appendChild(gradient);
            }
        }
        return rangeGroup;
    };
    Segment.prototype.createCircularRange = function (centerX, centerY, radius, progress) {
        var rangeGroup = progress.renderer.createGroup({ 'id': progress.element.id + '_CircularRangeGroup' });
        var range = progress.rangeColors;
        var thickness = progress.progressThickness || progress.themeStyle.linearProgressThickness;
        var opacity = progress.themeStyle.progressOpacity;
        var rangeMin = progress.minimum;
        var rangeMax = progress.value;
        var start = progress.startAngle;
        var tolAngle = this.widthToAngle(progress.minimum, progress.maximum, progress.value, progress.totalAngle);
        var gradient;
        var startAngle;
        var endAngle;
        var rangePath;
        var isValidRange;
        var option;
        var color;
        var endColor;
        for (var i = 0; i < range.length; i++) {
            isValidRange = (range[i].start >= rangeMin && range[i].start <= rangeMax &&
                range[i].end >= rangeMin && range[i].end <= rangeMax);
            startAngle = this.widthToAngle(rangeMin, rangeMax, range[i].start, tolAngle);
            endAngle = this.widthToAngle(rangeMin, rangeMax, range[i].end, tolAngle);
            startAngle = (isValidRange) ? (start + ((progress.enableRtl) ? -startAngle : startAngle)) % 360 : start;
            endAngle = (isValidRange) ? (start + ((progress.enableRtl) ? -endAngle : endAngle)) % 360 : start;
            color = (progress.isGradient) ? 'url(#circleRangeGrad_' + i + ')' : range[i].color;
            option = new PathOption(progress.element.id + '_CircularRange_' + i, 'none', thickness, color, opacity, '0', getPathArc(centerX, centerY, radius, startAngle, endAngle, progress.enableRtl));
            rangePath = progress.renderer.drawPath(option);
            rangeGroup.appendChild(rangePath);
            if (progress.isGradient) {
                if (range.length - 1 === i) {
                    endColor = range[i].color;
                }
                else {
                    endColor = range[i + 1].color;
                }
                gradient = this.setCircularGradientColor(i, range[i].color, endColor, startAngle, endAngle, radius, centerX, centerY, progress);
                rangeGroup.appendChild(gradient);
            }
        }
        return rangeGroup;
    };
    Segment.prototype.setLinearGradientColor = function (id, startColor, endColor, start, end, progress) {
        var linearGradient;
        var option;
        var stopColor = [];
        option = { id: 'lineRangeGrad_' + id + '', x1: start.toString(), x2: end.toString() };
        stopColor[0] = { color: startColor, colorStop: '50%' };
        stopColor[1] = { color: endColor, colorStop: '100%' };
        linearGradient = progress.renderer.drawGradient('linearGradient', option, stopColor);
        linearGradient.firstElementChild.setAttribute('gradientUnits', 'userSpaceOnUse');
        return linearGradient;
    };
    Segment.prototype.setCircularGradientColor = function (id, startColor, endColor, start, end, rad, x, y, progress) {
        var linearGradient;
        var option;
        var stopColor = [];
        var pos1 = degreeToLocation(x, y, rad, start);
        var pos2 = degreeToLocation(x, y, rad, end);
        option = {
            id: 'circleRangeGrad_' + id + '', x1: pos1.x.toString(), x2: pos2.x.toString(),
            y1: pos1.y.toString(), y2: pos2.y.toString()
        };
        stopColor[0] = { color: startColor, colorStop: '50%' };
        stopColor[1] = { color: endColor, colorStop: '100%' };
        linearGradient = progress.renderer.drawGradient('linearGradient', option, stopColor);
        linearGradient.firstElementChild.setAttribute('gradientUnits', 'userSpaceOnUse');
        return linearGradient;
    };
    return Segment;
}());

/**
 * Progress Bar of type Linear
 */
var Linear = /** @__PURE__ @class */ (function () {
    function Linear(progress) {
        this.segment = new Segment();
        this.animation = new ProgressAnimation();
        this.progress = progress;
    }
    /** To render the linear track  */
    Linear.prototype.renderLinearTrack = function () {
        var progress = this.progress;
        var linearTrackGroup = progress.renderer.createGroup({ 'id': progress.element.id + '_LinearTrackGroup' });
        var linearTrack;
        var option;
        var thickness;
        var stroke;
        this.isRange = (this.progress.rangeColors[0].color !== '' || this.progress.rangeColors[0].start !== null ||
            this.progress.rangeColors[0].end !== null);
        thickness = (progress.trackThickness || progress.themeStyle.linearTrackThickness);
        stroke = (progress.argsData.trackColor || progress.themeStyle.linearTrackColor);
        option = new PathOption(progress.element.id + '_Lineartrack', 'none', thickness, stroke, progress.themeStyle.trackOpacity, '0', progress.getPathLine(progress.progressRect.x, progress.progressRect.width, thickness));
        linearTrack = progress.renderer.drawPath(option);
        progress.trackWidth = linearTrack.getTotalLength();
        if (progress.segmentCount > 1 && !this.isRange && !progress.trackSegmentDisable) {
            progress.segmentSize = progress.calculateSegmentSize(progress.trackWidth, thickness);
            linearTrack.setAttribute('stroke-dasharray', progress.segmentSize);
        }
        if (progress.cornerRadius === 'Round' && !this.isRange) {
            linearTrack.setAttribute('stroke-linecap', 'round');
        }
        linearTrackGroup.appendChild(linearTrack);
        progress.svgObject.appendChild(linearTrackGroup);
    };
    /** To render the linear progress  */
    Linear.prototype.renderLinearProgress = function (refresh, previousWidth) {
        if (previousWidth === void 0) { previousWidth = 0; }
        var progress = this.progress;
        var option;
        var linearProgress;
        var progressWidth;
        var linearProgressWidth;
        var clipPathLinear;
        var clipPathIndeterminate;
        var linearProgressGroup;
        var animationdelay;
        var thickness;
        var stroke;
        var segmentWidth;
        var strippedStroke;
        progressWidth = progress.calculateProgressRange(progress.argsData.value);
        progress.previousWidth = linearProgressWidth = progress.progressRect.width *
            ((progress.isIndeterminate && !progress.trackSegmentDisable) ? 1 : progressWidth);
        if (!refresh) {
            linearProgressGroup = progress.renderer.createGroup({ 'id': progress.element.id + '_LinearProgressGroup' });
        }
        else {
            linearProgressGroup = getElement(progress.element.id + '_LinearProgressGroup');
        }
        thickness = (progress.progressThickness || progress.themeStyle.linearProgressThickness);
        stroke = (!progress.isStriped) ? this.checkingLinearProgressColor() : 'url(#' + progress.element.id + '_LinearStriped)';
        option = new PathOption(progress.element.id + '_Linearprogress', 'none', thickness, stroke, progress.themeStyle.progressOpacity, '0', progress.getPathLine(progress.progressRect.x, linearProgressWidth, thickness));
        progress.progressWidth = progress.renderer.drawPath(option).getTotalLength();
        progress.segmentSize = (!progress.trackSegmentDisable) ? progress.segmentSize :
            progress.calculateSegmentSize(progress.progressWidth, thickness);
        if (progress.secondaryProgress !== null && !progress.isIndeterminate) {
            this.renderLinearBuffer(progress);
        }
        if (progress.argsData.value !== null) {
            if (progress.segmentColor.length !== 0 && !progress.isIndeterminate && !this.isRange) {
                segmentWidth = (!progress.trackSegmentDisable) ? progress.trackWidth : progress.progressWidth;
                linearProgress = this.segment.createLinearSegment(progress, '_LinearProgressSegment', linearProgressWidth, progress.themeStyle.progressOpacity, thickness, segmentWidth);
            }
            else if (this.isRange && !progress.isIndeterminate) {
                linearProgress = this.segment.createLinearRange(linearProgressWidth, progress);
            }
            else {
                if (!refresh) {
                    linearProgress = progress.renderer.drawPath(option);
                }
                else {
                    linearProgress = getElement(progress.element.id + '_Linearprogress');
                    linearProgress.setAttribute('d', progress.getPathLine(progress.progressRect.x, linearProgressWidth, thickness));
                    linearProgress.setAttribute('stroke', stroke);
                }
                if (progress.segmentCount > 1) {
                    linearProgress.setAttribute('stroke-dasharray', progress.segmentSize);
                }
                if (progress.cornerRadius === 'Round' && progressWidth) {
                    linearProgress.setAttribute('stroke-linecap', 'round');
                }
            }
            linearProgressGroup.appendChild(linearProgress);
            if (progress.isStriped && !progress.isIndeterminate) {
                strippedStroke = this.checkingLinearProgressColor();
                this.renderLinearStriped(strippedStroke, linearProgressGroup, progress);
            }
            if (progress.isActive && !progress.isIndeterminate && !progress.isStriped) {
                this.renderActiveState(linearProgressGroup, progressWidth, linearProgressWidth, thickness, refresh);
            }
            if (progress.animation.enable && !progress.isIndeterminate && !progress.isActive && !progress.isStriped) {
                if ((progress.secondaryProgress !== null)) {
                    animationdelay = progress.animation.delay + (this.bufferWidth - linearProgressWidth);
                }
                else {
                    animationdelay = progress.animation.delay;
                }
                /** used for label animation delay */
                this.delay = animationdelay;
                clipPathLinear = progress.createClipPath(progress.clipPath, progressWidth, null, refresh, thickness, false);
                linearProgressGroup.appendChild(progress.clipPath);
                linearProgress.setAttribute('style', 'clip-path:url(#' + progress.element.id + '_clippath)');
                this.animation.doLinearAnimation(clipPathLinear, progress, animationdelay, refresh ? previousWidth : 0);
            }
            if (progress.isIndeterminate) {
                clipPathIndeterminate = progress.createClipPath(progress.clipPath, (progress.trackSegmentDisable) ? 1 : progressWidth, null, refresh, thickness, progress.trackSegmentDisable);
                linearProgressGroup.appendChild(progress.clipPath);
                linearProgress.setAttribute('style', 'clip-path:url(#' + progress.element.id + '_clippath)');
                this.animation.doLinearIndeterminate(((!progress.trackSegmentDisable) ? clipPathIndeterminate : linearProgress), linearProgressWidth, thickness, progress);
            }
            progress.svgObject.appendChild(linearProgressGroup);
        }
    };
    /** To render the linear buffer */
    Linear.prototype.renderLinearBuffer = function (progress) {
        var linearBuffer;
        var secondaryProgressWidth;
        var clipPathBuffer;
        var linearBufferGroup;
        var linearBufferWidth;
        var option;
        var thickness;
        var stroke;
        var segmentWidth;
        secondaryProgressWidth = progress.calculateProgressRange(progress.secondaryProgress);
        this.bufferWidth = linearBufferWidth = progress.progressRect.width * secondaryProgressWidth;
        linearBufferGroup = progress.renderer.createGroup({ 'id': progress.element.id + '_LinearBufferGroup' });
        thickness = (progress.progressThickness || progress.themeStyle.linearProgressThickness);
        stroke = this.checkingLinearProgressColor();
        option = new PathOption(progress.element.id + '_Linearbuffer', 'none', thickness, stroke, progress.themeStyle.bufferOpacity, '0', progress.getPathLine(progress.progressRect.x, linearBufferWidth, thickness));
        if (progress.segmentColor.length !== 0 && !progress.isIndeterminate && !this.isRange) {
            segmentWidth = (!progress.trackSegmentDisable) ? progress.trackWidth : progress.progressWidth;
            linearBuffer = this.segment.createLinearSegment(progress, '_LinearBufferSegment', linearBufferWidth, progress.themeStyle.bufferOpacity, (progress.progressThickness || progress.themeStyle.linearProgressThickness), segmentWidth);
        }
        else {
            linearBuffer = progress.renderer.drawPath(option);
            if (progress.segmentCount > 1 && !this.isRange) {
                linearBuffer.setAttribute('stroke-dasharray', progress.segmentSize);
            }
            if (progress.cornerRadius === 'Round' && !this.isRange) {
                linearBuffer.setAttribute('stroke-linecap', 'round');
            }
        }
        linearBufferGroup.appendChild(linearBuffer);
        if (progress.animation.enable) {
            clipPathBuffer = progress.createClipPath(progress.bufferClipPath, secondaryProgressWidth, null, false, thickness, false);
            linearBufferGroup.appendChild(progress.bufferClipPath);
            linearBuffer.setAttribute('style', 'clip-path:url(#' + progress.element.id + '_clippathBuffer)');
            this.animation.doLinearAnimation(clipPathBuffer, progress, progress.animation.delay, 0);
        }
        progress.svgObject.appendChild(linearBufferGroup);
    };
    /** Render the Linear Label */
    Linear.prototype.renderLinearLabel = function () {
        var linearlabel;
        var linearValue;
        var posX;
        var posY;
        var argsData;
        var textSize;
        var labelValue;
        var percentage = 100;
        var option;
        var defaultPos;
        var far;
        var center;
        var pos;
        var rgbValue;
        var contrast;
        var clipPath;
        var linearLabelGroup;
        var padding = 5;
        var progress = this.progress;
        var textAlignment = progress.labelStyle.textAlignment;
        var labelText = progress.labelStyle.text;
        var fontBackground = this.checkingLinearProgressColor();
        var progressWidth = progress.progressRect.width * progress.calculateProgressRange(progress.value);
        linearLabelGroup = progress.renderer.createGroup({ 'id': progress.element.id + '_LinearLabelGroup' });
        labelValue = ((progress.value - progress.minimum) / (progress.maximum - progress.minimum)) * percentage;
        linearValue = (progress.value < progress.minimum || progress.value > progress.maximum) ? 0 : Math.round(labelValue);
        // Checking the font color
        rgbValue = convertHexToColor(colorNameToHex(fontBackground));
        contrast = Math.round((rgbValue.r * 299 + rgbValue.g * 587 + rgbValue.b * 114) / 1000);
        argsData = {
            cancel: false, text: labelText ? labelText : String(linearValue) + '%', color: progress.labelStyle.color
        };
        progress.trigger('textRender', argsData);
        if (!argsData.cancel) {
            textSize = measureText(argsData.text, progress.labelStyle);
            defaultPos = (progress.enableRtl) ? (progress.progressRect.x + progress.progressRect.width - textSize.width / 2) :
                (progress.progressRect.x + textSize.width / 2);
            if (textAlignment === 'Near') {
                posX = defaultPos + ((progress.enableRtl) ? -padding : padding);
            }
            else if (textAlignment === 'Center') {
                center = (progress.enableRtl) ? (progress.progressRect.x + progress.progressRect.width - progressWidth / 2) :
                    (progress.progressRect.x + progressWidth / 2);
                pos = (progress.enableRtl) ? (center <= defaultPos) : (center >= defaultPos);
                if (pos) {
                    posX = center;
                }
                else {
                    posX = defaultPos;
                }
            }
            else {
                far = (progress.enableRtl) ?
                    ((progress.progressRect.x + progress.progressRect.width - progressWidth) + textSize.width / 2) :
                    (progress.progressRect.x + progressWidth - textSize.width / 2);
                far += (progress.enableRtl) ? padding : -padding;
                pos = (progress.enableRtl) ? (far <= defaultPos) : (far >= defaultPos);
                if (pos) {
                    posX = far;
                }
                else {
                    posX = defaultPos;
                }
            }
            posY = progress.progressRect.y + (progress.progressRect.height / 2) + (textSize.height / 4);
            option = new TextOption(progress.element.id + '_linearLabel', progress.labelStyle.size || progress.themeStyle.linearFontSize, progress.labelStyle.fontStyle || progress.themeStyle.linearFontStyle, progress.labelStyle.fontFamily || progress.themeStyle.linearFontFamily, progress.labelStyle.fontWeight, 'middle', argsData.color || ((contrast >= 128) ? 'black' : 'white'), posX, posY);
            linearlabel = progress.renderer.createText(option, argsData.text);
            linearLabelGroup.appendChild(linearlabel);
            if (progress.animation.enable && !progress.isIndeterminate) {
                clipPath = progress.renderer.createClipPath({ 'id': progress.element.id + '_clippathLabel' });
                progress.createClipPath(clipPath, 1, null, false, (progress.progressThickness || progress.themeStyle.linearProgressThickness), true);
                linearLabelGroup.appendChild(clipPath);
                linearlabel.setAttribute('style', 'clip-path:url(#' + progress.element.id + '_clippathLabel)');
                this.animation.doLabelAnimation(linearlabel, 0, progressWidth, progress, this.delay, textSize.width);
            }
            progress.svgObject.appendChild(linearLabelGroup);
        }
    };
    /** To render a progressbar active state */
    Linear.prototype.renderActiveState = function (progressGroup, progressWidth, linearProgressWidth, thickness, refresh) {
        var linearActive;
        var activeClip;
        var progress = this.progress;
        var option;
        if (!refresh) {
            option = new PathOption(progress.element.id + '_LinearActiveProgress', 'none', thickness, '#ffffff', 0.5, '', progress.getPathLine(progress.progressRect.x, linearProgressWidth, thickness));
            linearActive = progress.renderer.drawPath(option);
        }
        else {
            linearActive = getElement(progress.element.id + '_LinearActiveProgress');
            linearActive.setAttribute('d', progress.getPathLine(progress.progressRect.x, linearProgressWidth, thickness));
        }
        if (progress.segmentCount > 1 && !this.isRange) {
            linearActive.setAttribute('stroke-dasharray', progress.segmentSize);
        }
        if (progress.cornerRadius === 'Round' && progressWidth && !this.isRange) {
            linearActive.setAttribute('stroke-linecap', 'round');
        }
        activeClip = progress.createClipPath(progress.clipPath, progressWidth, null, refresh, thickness, false);
        linearActive.setAttribute('style', 'clip-path:url(#' + progress.element.id + '_clippath)');
        progressGroup.appendChild(linearActive);
        progressGroup.appendChild(progress.clipPath);
        this.animation.doLinearAnimation(activeClip, progress, 0, 0, linearActive);
    };
    /** To render a striped stroke */
    Linear.prototype.renderLinearStriped = function (color, group, progress) {
        var defs = progress.renderer.createDefs();
        var linearGradient = document.createElementNS(svgLink, gradientType);
        var stripWidth = 30;
        var stop;
        var gradOption;
        var stopOption = [];
        gradOption = {
            id: progress.element.id + '_LinearStriped', x1: (progress.progressRect.x).toString(),
            x2: (progress.progressRect.x + stripWidth).toString(),
            spreadMethod: 'repeat', gradientUnits: 'userSpaceOnUse', gradientTransform: 'rotate(-45)'
        };
        stopOption = [{ offset: '50%', 'stop-color': color, 'stop-opacity': '1' },
            { offset: '50%', 'stop-color': color, 'stop-opacity': '0.6' }];
        linearGradient = setAttributes(gradOption, linearGradient);
        for (var i = 0; i < stopOption.length; i++) {
            stop = document.createElementNS(svgLink, stopElement);
            stop = setAttributes(stopOption[i], stop);
            linearGradient.appendChild(stop);
        }
        defs.appendChild(linearGradient);
        group.appendChild(defs);
        if (progress.animation.enable) {
            this.animation.doStripedAnimation(linearGradient, progress, 0);
        }
    };
    /** checking progress color */
    Linear.prototype.checkingLinearProgressColor = function () {
        var linearColor;
        var progress = this.progress;
        var role = progress.role;
        switch (role) {
            case 'Success':
                linearColor = progress.themeStyle.success;
                break;
            case 'Info':
                linearColor = progress.themeStyle.info;
                break;
            case 'Warning':
                linearColor = progress.themeStyle.warning;
                break;
            case 'Danger':
                linearColor = progress.themeStyle.danger;
                break;
            default:
                linearColor = (progress.argsData.progressColor || progress.themeStyle.linearProgressColor);
        }
        return linearColor;
    };
    return Linear;
}());

/**
 * Progressbar of type circular
 */
var Circular = /** @__PURE__ @class */ (function () {
    function Circular(progress) {
        this.segment = new Segment();
        this.animation = new ProgressAnimation();
        this.progress = progress;
    }
    /** To render the circular track */
    Circular.prototype.renderCircularTrack = function () {
        var progress = this.progress;
        var circularTrackGroup = progress.renderer.createGroup({ 'id': progress.element.id + '_CircularTrackGroup' });
        var radius;
        var startAngle;
        var endAngle;
        var circularTrack;
        var circularPath;
        var option;
        var fill;
        var strokeWidth;
        var stroke;
        startAngle = progress.startAngle;
        progress.totalAngle = (progress.endAngle - progress.startAngle) % 360;
        progress.totalAngle = (progress.totalAngle <= 0 ? (360 + progress.totalAngle) : progress.totalAngle);
        progress.totalAngle -= (progress.totalAngle === 360) ? 0.01 : 0;
        this.trackEndAngle = endAngle = (progress.startAngle + ((progress.enableRtl) ? -progress.totalAngle : +progress.totalAngle)) % 360;
        this.centerX = progress.progressRect.x + (progress.progressRect.width / 2);
        this.centerY = progress.progressRect.y + (progress.progressRect.height / 2);
        this.maxThickness = Math.max(progress.trackThickness, progress.progressThickness) ||
            Math.max(progress.themeStyle.circularProgressThickness, progress.themeStyle.circularTrackThickness);
        this.availableSize = (Math.min(progress.progressRect.height, progress.progressRect.width) / 2) - this.maxThickness / 2;
        radius = stringToNumber(progress.radius, this.availableSize);
        radius = (radius === null) ? 0 : radius;
        stroke = (progress.argsData.trackColor || progress.themeStyle.circularTrackColor);
        fill = (progress.enablePieProgress) ? (progress.argsData.trackColor || progress.themeStyle.circularTrackColor) : 'none';
        strokeWidth = (progress.enablePieProgress) ? 0 : (progress.trackThickness || progress.themeStyle.circularTrackThickness);
        circularPath = getPathArc(this.centerX, this.centerY, radius, startAngle, endAngle, progress.enableRtl, progress.enablePieProgress);
        this.isRange = (this.progress.rangeColors[0].color !== '' || this.progress.rangeColors[0].start !== null ||
            this.progress.rangeColors[0].end !== null);
        option = new PathOption(progress.element.id + '_Circulartrack', fill, strokeWidth, stroke, progress.themeStyle.trackOpacity, '0', circularPath);
        circularTrack = progress.renderer.drawPath(option);
        progress.trackWidth = circularTrack.getTotalLength();
        if (progress.segmentCount > 1 && !progress.trackSegmentDisable && !progress.enablePieProgress && !this.isRange) {
            progress.segmentSize = progress.calculateSegmentSize(progress.trackWidth, strokeWidth);
            circularTrack.setAttribute('stroke-dasharray', progress.segmentSize);
        }
        if (progress.cornerRadius === 'Round' && !progress.enablePieProgress && !this.isRange) {
            circularTrack.setAttribute('stroke-linecap', 'round');
        }
        circularTrackGroup.appendChild(circularTrack);
        progress.svgObject.appendChild(circularTrackGroup);
    };
    /** To render the circular progress */
    Circular.prototype.renderCircularProgress = function (previousEnd, previousTotalEnd, refresh) {
        var progress = this.progress;
        var startAngle = progress.startAngle;
        var endAngle;
        var totalAngle;
        var radius;
        var previousPath;
        var progressTotalAngle;
        var circularPath;
        var progressEnd;
        var circularProgress;
        var option;
        var linearClipPath;
        var stroke;
        var circularProgressGroup;
        var fill;
        var strokeWidth;
        var segmentWidth;
        var progressEndAngle;
        var thickness;
        if (!refresh) {
            circularProgressGroup = progress.renderer.createGroup({ 'id': progress.element.id + '_CircularProgressGroup' });
        }
        else {
            circularProgressGroup = getElement(progress.element.id + '_CircularProgressGroup');
        }
        radius = stringToNumber(progress.innerRadius, this.availableSize);
        radius = (radius === null) ? 0 : radius;
        progress.previousTotalEnd = progressEnd = progress.calculateProgressRange(progress.argsData.value);
        progressEndAngle = (progress.startAngle + ((progress.enableRtl) ? -progressEnd : progressEnd)) % 360;
        progress.previousEndAngle = endAngle = ((progress.isIndeterminate && !progress.trackSegmentDisable) ? (progress.startAngle + ((progress.enableRtl) ? -progress.totalAngle : progress.totalAngle)) % 360 : progressEndAngle);
        progressTotalAngle = (progressEnd - progress.startAngle) % 360;
        progressTotalAngle = (progressTotalAngle <= 0 ? (360 + progressTotalAngle) : progressTotalAngle);
        progressTotalAngle -= (progressTotalAngle === 360) ? 0.01 : 0;
        circularPath = getPathArc(this.centerX, this.centerY, radius, startAngle, endAngle, progress.enableRtl, progress.enablePieProgress);
        stroke = this.checkingCircularProgressColor();
        fill = (progress.enablePieProgress) ? stroke : 'none';
        thickness = (progress.progressThickness || progress.themeStyle.circularProgressThickness);
        strokeWidth = (progress.enablePieProgress) ? 0 : thickness;
        option = new PathOption(progress.element.id + '_Circularprogress', fill, strokeWidth, stroke, progress.themeStyle.progressOpacity, '0', circularPath);
        progress.progressWidth = progress.renderer.drawPath(option).getTotalLength();
        progress.segmentSize = this.validateSegmentSize(progress, thickness);
        if (progress.secondaryProgress !== null && !progress.isIndeterminate) {
            this.renderCircularBuffer(progress, radius, progressTotalAngle);
        }
        if (progress.argsData.value !== null) {
            if (progress.segmentColor.length !== 0 && !progress.isIndeterminate && !progress.enablePieProgress) {
                totalAngle = (!progress.trackSegmentDisable) ? progress.totalAngle : progressTotalAngle;
                segmentWidth = (!progress.trackSegmentDisable) ? progress.trackWidth : progress.progressWidth;
                circularProgress = this.segment.createCircularSegment(progress, '_CircularProgressSegment', this.centerX, this.centerY, radius, progress.argsData.value, progress.themeStyle.progressOpacity, thickness, totalAngle, segmentWidth);
            }
            else if (this.isRange && !progress.isIndeterminate) {
                circularProgress = this.segment.createCircularRange(this.centerX, this.centerY, radius, progress);
            }
            else {
                if (!refresh) {
                    circularProgress = progress.renderer.drawPath(option);
                }
                else {
                    circularProgress = getElement(progress.element.id + '_Circularprogress');
                    previousPath = circularProgress.getAttribute('d');
                    circularProgress.setAttribute('stroke', stroke);
                    circularProgress.setAttribute('d', circularPath);
                }
                if (progress.segmentCount > 1 && !progress.enablePieProgress) {
                    circularProgress.setAttribute('stroke-dasharray', progress.segmentSize);
                }
                if (progress.cornerRadius === 'Round' && startAngle !== endAngle) {
                    circularProgress.setAttribute('stroke-linecap', 'round');
                }
            }
            circularProgressGroup.appendChild(circularProgress);
            if (progress.isActive && !progress.isIndeterminate && !progress.enablePieProgress) {
                this.renderActiveState(circularProgressGroup, radius, strokeWidth, circularPath, progressEndAngle, progressEnd, refresh);
            }
            if (progress.animation.enable || progress.isIndeterminate) {
                this.delay = (progress.secondaryProgress !== null) ? 300 : progress.animation.delay;
                linearClipPath = progress.createClipPath(progress.clipPath, null, refresh ? previousPath : '', refresh);
                circularProgressGroup.appendChild(progress.clipPath);
                if (progress.animation.enable && !progress.isIndeterminate && !progress.isActive) {
                    circularProgress.setAttribute('style', 'clip-path:url(#' + progress.element.id + '_clippath)');
                    this.animation.doCircularAnimation(this.centerX, this.centerY, radius, progressEndAngle, progressEnd, linearClipPath, progress, thickness, this.delay, refresh ? previousEnd : null, refresh ? previousTotalEnd : null);
                }
                if (progress.isIndeterminate) {
                    if (progress.trackSegmentDisable) {
                        linearClipPath.setAttribute('d', getPathArc(this.centerX, this.centerY, radius + (thickness / 2), progress.startAngle, this.trackEndAngle, progress.enableRtl, true));
                    }
                    circularProgress.setAttribute('style', 'clip-path:url(#' + progress.element.id + '_clippath)');
                    this.animation.doCircularIndeterminate((!progress.trackSegmentDisable) ? linearClipPath : circularProgress, progress, startAngle, progressEndAngle, this.centerX, this.centerY, radius, thickness);
                }
            }
            progress.svgObject.appendChild(circularProgressGroup);
        }
    };
    /** To render the circular buffer */
    Circular.prototype.renderCircularBuffer = function (progress, radius, progressTotalAngle) {
        var bufferClipPath;
        var bufferEnd;
        var circularBuffer;
        var circularBufferGroup;
        var circularPath;
        var option;
        var fill;
        var strokeWidth;
        var segmentWidth;
        var totalAngle;
        var endAngle;
        var stroke;
        circularBufferGroup = progress.renderer.createGroup({ 'id': progress.element.id + '_ CircularBufferGroup' });
        bufferEnd = progress.calculateProgressRange(progress.secondaryProgress);
        endAngle = (progress.startAngle + ((progress.enableRtl) ? -bufferEnd : bufferEnd)) % 360;
        circularPath = getPathArc(this.centerX, this.centerY, radius, progress.startAngle, endAngle, progress.enableRtl, progress.enablePieProgress);
        stroke = this.checkingCircularProgressColor();
        fill = (progress.enablePieProgress) ? stroke : 'none';
        strokeWidth = (progress.enablePieProgress) ? 0 : (progress.progressThickness || progress.themeStyle.circularProgressThickness);
        option = new PathOption(progress.element.id + '_Circularbuffer', fill, strokeWidth, stroke, progress.themeStyle.bufferOpacity, '0', circularPath);
        if (progress.segmentColor.length !== 0 && !progress.isIndeterminate && !progress.enablePieProgress && !this.isRange) {
            totalAngle = (!progress.trackSegmentDisable) ? progress.totalAngle : progressTotalAngle;
            segmentWidth = (!progress.trackSegmentDisable) ? progress.trackWidth : progress.progressWidth;
            circularBuffer = this.segment.createCircularSegment(progress, '_CircularBufferSegment', this.centerX, this.centerY, radius, progress.secondaryProgress, progress.themeStyle.bufferOpacity, strokeWidth, totalAngle, segmentWidth);
        }
        else {
            circularBuffer = progress.renderer.drawPath(option);
            if (progress.segmentCount > 1 && !progress.enablePieProgress && !this.isRange) {
                circularBuffer.setAttribute('stroke-dasharray', progress.segmentSize);
            }
            if (progress.cornerRadius === 'Round' && !this.isRange) {
                circularBuffer.setAttribute('stroke-linecap', 'round');
            }
        }
        circularBufferGroup.appendChild(circularBuffer);
        if (progress.animation.enable && !progress.isActive) {
            bufferClipPath = progress.createClipPath(progress.bufferClipPath, null, '', false);
            circularBufferGroup.appendChild(progress.bufferClipPath);
            circularBuffer.setAttribute('style', 'clip-path:url(#' + progress.element.id + '_clippathBuffer)');
            this.animation.doCircularAnimation(this.centerX, this.centerY, radius, endAngle, bufferEnd, bufferClipPath, progress, (progress.progressThickness || progress.themeStyle.circularProgressThickness), progress.animation.delay);
        }
        progress.svgObject.appendChild(circularBufferGroup);
    };
    /** To render the circular Label */
    Circular.prototype.renderCircularLabel = function () {
        var end;
        var circularLabel;
        var circularValue;
        var centerY;
        var argsData;
        var textSize;
        var labelValue;
        var option;
        var circularLabelGroup;
        var percentage = 100;
        var progress = this.progress;
        var labelText = progress.labelStyle.text;
        circularLabelGroup = progress.renderer.createGroup({ 'id': progress.element.id + '_CircularLabelGroup' });
        labelValue = ((progress.value - progress.minimum) / (progress.maximum - progress.minimum)) * percentage;
        circularValue = (progress.value < progress.minimum || progress.value > progress.maximum) ? 0 : Math.round(labelValue);
        argsData = {
            cancel: false, text: labelText ? labelText : String(circularValue) + '%', color: progress.labelStyle.color
        };
        progress.trigger('textRender', argsData);
        if (!argsData.cancel) {
            textSize = measureText(argsData.text, progress.labelStyle);
            centerY = this.centerY + (textSize.height / 2);
            option = new TextOption(progress.element.id + '_circularLabel', progress.labelStyle.size || progress.themeStyle.circularFontSize, progress.labelStyle.fontStyle || progress.themeStyle.circularFontStyle, progress.labelStyle.fontFamily || progress.themeStyle.circularFontFamily, progress.labelStyle.fontWeight, 'middle', argsData.color || progress.themeStyle.fontColor, this.centerX, centerY, progress.progressRect.width, progress.progressRect.height);
            circularLabel = progress.renderer.createText(option, argsData.text);
            circularLabelGroup.appendChild(circularLabel);
            if (progress.animation.enable && !progress.isIndeterminate) {
                end = ((progress.value - progress.minimum) / (progress.maximum - progress.minimum)) * progress.totalAngle;
                end = (progress.value < progress.minimum || progress.value > progress.maximum) ? 0 : end;
                this.animation.doLabelAnimation(circularLabel, progress.startAngle, end, progress, this.delay);
            }
            progress.svgObject.appendChild(circularLabelGroup);
        }
    };
    /** To render a progressbar active state */
    Circular.prototype.renderActiveState = function (progressGroup, radius, strokeWidth, circularPath, endAngle, totalEnd, refresh) {
        var circularActive;
        var activeClip;
        var option;
        var progress = this.progress;
        if (!refresh) {
            option = new PathOption(progress.element.id + '_CircularActiveProgress', 'none', strokeWidth, '#ffffff', 0.5, '0', circularPath);
            circularActive = progress.renderer.drawPath(option);
        }
        else {
            circularActive = getElement(progress.element.id + '_CircularActiveProgress');
            circularActive.setAttribute('d', circularPath);
        }
        if (progress.segmentCount > 1) {
            circularActive.setAttribute('stroke-dasharray', progress.segmentSize);
        }
        if (progress.cornerRadius === 'Round') {
            circularActive.setAttribute('stroke-linecap', 'round');
        }
        activeClip = progress.createClipPath(progress.clipPath, null, '', refresh);
        circularActive.setAttribute('style', 'clip-path:url(#' + progress.element.id + '_clippath)');
        progressGroup.appendChild(circularActive);
        progressGroup.appendChild(progress.clipPath);
        this.animation.doCircularAnimation(this.centerX, this.centerY, radius, endAngle, totalEnd, activeClip, progress, (progress.progressThickness || progress.themeStyle.circularProgressThickness), 0, null, null, circularActive);
    };
    /** Checking the segment size */
    Circular.prototype.validateSegmentSize = function (progress, thickness) {
        var validSegment;
        var rDiff;
        var progressSegment;
        rDiff = parseInt(progress.radius, 10) - parseInt(progress.innerRadius, 10);
        if (rDiff !== 0 && !progress.trackSegmentDisable) {
            progressSegment = progress.trackWidth + ((rDiff < 0) ? (progress.trackWidth * Math.abs(rDiff)) / parseInt(progress.radius, 10) :
                -(progress.trackWidth * Math.abs(rDiff)) / parseInt(progress.radius, 10));
            validSegment = progress.calculateSegmentSize(progressSegment, thickness);
        }
        else if (progress.trackSegmentDisable) {
            validSegment = progress.calculateSegmentSize(progress.progressWidth, thickness);
        }
        else {
            validSegment = progress.segmentSize;
        }
        return validSegment;
    };
    /** checking progress color */
    Circular.prototype.checkingCircularProgressColor = function () {
        var circularColor;
        var progress = this.progress;
        var role = progress.role;
        switch (role) {
            case 'Success':
                circularColor = progress.themeStyle.success;
                break;
            case 'Info':
                circularColor = progress.themeStyle.info;
                break;
            case 'Warning':
                circularColor = progress.themeStyle.warning;
                break;
            case 'Danger':
                circularColor = progress.themeStyle.danger;
                break;
            default:
                circularColor = (progress.argsData.progressColor || progress.themeStyle.circularProgressColor);
        }
        return circularColor;
    };
    return Circular;
}());

var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 *  progress bar control
 */
var ProgressBar = /** @__PURE__ @class */ (function (_super) {
    __extends(ProgressBar, _super);
    function ProgressBar(options, element) {
        var _this = _super.call(this, options, element) || this;
        /** @private */
        _this.linear = new Linear(_this);
        /** @private */
        _this.circular = new Circular(_this);
        /** @private */
        _this.annotateAnimation = new ProgressAnimation();
        return _this;
    }
    ProgressBar.prototype.getModuleName = function () {
        return 'progressbar';
    };
    ProgressBar.prototype.preRender = function () {
        this.unWireEvents();
        this.initPrivateVariable();
        this.wireEvents();
    };
    ProgressBar.prototype.initPrivateVariable = function () {
        this.progressRect = new Rect(0, 0, 0, 0);
        this.progressSize = new Size(0, 0);
    };
    ProgressBar.prototype.render = function () {
        this.trigger('load', { progressBar: this });
        this.element.style.display = 'block';
        this.element.style.position = 'relative';
        this.calculateProgressBarSize();
        this.setTheme();
        this.createSVG();
        this.renderElements();
        this.trigger('loaded', { progressBar: this });
        this.renderComplete();
        this.controlRenderedTimeStamp = new Date().getTime();
    };
    /**
     * calculate size of the progress bar
     */
    ProgressBar.prototype.calculateProgressBarSize = function () {
        var containerWidth = this.element.clientWidth || this.element.offsetWidth;
        var containerHeight = this.element.clientHeight;
        var width = (this.type === 'Linear') ? 200 : 120;
        var height = (this.type === 'Linear') ? 30 : 120;
        var padding = 10;
        var thickness = Math.max(this.progressThickness, this.trackThickness);
        height = (this.type === 'Linear' && thickness > (height - padding)) ? thickness + padding : height;
        this.progressSize.width = stringToNumber(this.width, containerWidth) || containerWidth || width;
        this.progressSize.height = stringToNumber(this.height, containerHeight) || containerHeight || height;
        this.progressRect.x = this.margin.left;
        this.progressRect.y = this.margin.top;
        this.progressRect.width = this.progressSize.width - (this.margin.left + this.margin.right);
        this.progressRect.height = this.progressSize.height - (this.margin.top + this.margin.bottom);
    };
    /**
     * Render Annotation
     */
    ProgressBar.prototype.renderAnnotations = function () {
        this.createSecElement();
        this.renderAnnotation();
        this.setSecondaryElementPosition();
    };
    /**
     * Render SVG Element
     */
    ProgressBar.prototype.renderElements = function () {
        this.renderTrack();
        this.renderProgress();
        this.renderLabel();
        this.renderAnnotations();
    };
    ProgressBar.prototype.createSecElement = function () {
        var secElement = document.getElementById(this.element.id + 'Secondary_Element');
        if (secElement) {
            secElement.innerHTML = '';
            this.secElement = secElement;
            return;
        }
        this.secElement = createElement('div', {
            id: this.element.id + 'Secondary_Element',
            styles: 'position: absolute',
        });
        this.element.appendChild(this.secElement);
    };
    /**
     * To set the left and top position for annotation for center aligned
     */
    ProgressBar.prototype.setSecondaryElementPosition = function () {
        var element = this.secElement;
        var rect = this.element.getBoundingClientRect();
        var svgRect = getElement(this.svgObject.id).getBoundingClientRect();
        element.style.left = Math.max(svgRect.left - rect.left, 0) + 'px';
        element.style.top = Math.max(svgRect.top - rect.top, 0) + 'px';
    };
    ProgressBar.prototype.createSVG = function () {
        this.removeSvg();
        this.renderer = new SvgRenderer(this.element.id);
        this.svgObject = this.renderer.createSvg({
            id: this.element.id + 'SVG',
            width: this.progressSize.width,
            height: this.progressSize.height,
            style: 'background-color:' + this.themeStyle.backgroundColor
        });
    };
    ProgressBar.prototype.clipPathElement = function () {
        this.clipPath = this.renderer.createClipPath({ 'id': this.element.id + '_clippath' });
        this.bufferClipPath = this.renderer.createClipPath({ 'id': this.element.id + '_clippathBuffer' });
    };
    ProgressBar.prototype.renderTrack = function () {
        this.argsData = {
            value: this.value,
            progressColor: this.progressColor,
            trackColor: this.trackColor
        };
        if (this.argsData.value === this.maximum) {
            this.trigger(progressCompleted, this.argsData);
        }
        else {
            this.trigger(valueChanged, this.argsData);
        }
        if (this.type === 'Linear') {
            this.linear.renderLinearTrack();
        }
        else if (this.type === 'Circular') {
            this.circular.renderCircularTrack();
        }
    };
    ProgressBar.prototype.renderProgress = function () {
        this.clipPathElement();
        if (this.type === 'Linear') {
            this.linear.renderLinearProgress();
        }
        else if (this.type === 'Circular') {
            this.circular.renderCircularProgress();
        }
    };
    ProgressBar.prototype.renderLabel = function () {
        if (this.type === 'Linear' && this.showProgressValue && !this.isIndeterminate) {
            this.linear.renderLinearLabel();
        }
        else if (this.type === 'Circular' && this.showProgressValue && !this.isIndeterminate) {
            this.circular.renderCircularLabel();
        }
        this.element.appendChild(this.svgObject);
    };
    ProgressBar.prototype.getPathLine = function (x, width, thickness) {
        var moveTo = (this.enableRtl) ? ((this.cornerRadius === 'Round') ?
            (x + this.progressRect.width) - ((lineCapRadius / 2) * thickness) : (x + this.progressRect.width)) :
            ((this.cornerRadius === 'Round') ? (x + (lineCapRadius / 2) * thickness) : x);
        var lineTo = (this.enableRtl) ? ((this.cornerRadius === 'Round' && width) ?
            (moveTo - width + (lineCapRadius * thickness)) : (moveTo - width)) :
            ((this.cornerRadius === 'Round' && width) ? (moveTo + width - (lineCapRadius * thickness)) : (moveTo + width));
        return 'M' + moveTo + ' ' + (this.progressRect.y + (this.progressRect.height / 2)) +
            'L' + lineTo + ' ' + (this.progressRect.y + (this.progressRect.height / 2));
    };
    ProgressBar.prototype.calculateProgressRange = function (value, minimum, maximum) {
        var result;
        var endValue;
        var min = minimum || this.minimum;
        var max = maximum || this.maximum;
        endValue = (value - min) / (max - min) * ((this.type === 'Linear') ? 1 : this.totalAngle);
        result = (value < min || value > max) ? 0 : endValue;
        return result;
    };
    ProgressBar.prototype.calculateSegmentSize = function (width, thickness) {
        var count = (this.type === 'Circular' && this.totalAngle === completeAngle) ? this.segmentCount : this.segmentCount - 1;
        var cornerCount = (this.totalAngle === completeAngle || this.type === 'Linear') ? this.segmentCount : this.segmentCount - 1;
        var gap = this.gapWidth || ((this.type === 'Linear') ? this.themeStyle.linearGapWidth : this.themeStyle.circularGapWidth);
        var size = (width - count * gap);
        size = (size - ((this.cornerRadius === 'Round') ? (cornerCount * (lineCapRadius * thickness)) : 0)) / this.segmentCount;
        gap += (this.cornerRadius === 'Round') ? lineCapRadius * thickness : 0;
        return ' ' + size + ' ' + gap;
    };
    ProgressBar.prototype.createClipPath = function (clipPath, range, d, refresh, thickness, isLabel) {
        var path;
        var rect;
        var option;
        var posx;
        var posy;
        var pathWidth;
        var x = this.progressRect.x;
        var totalWidth = this.progressRect.width;
        if (this.type === 'Linear') {
            posx = (this.enableRtl && !isLabel) ? (x + totalWidth) : x;
            posx += (this.cornerRadius === 'Round') ?
                ((this.enableRtl && !isLabel) ? (lineCapRadius / 2) * thickness : -(lineCapRadius / 2) * thickness) : 0;
            posy = (this.progressRect.y + (this.progressRect.height / 2)) - (thickness / 2);
            pathWidth = totalWidth * range;
            pathWidth += (this.cornerRadius === 'Round') ? (lineCapRadius * thickness) : 0;
            if (!refresh) {
                rect = new RectOption(this.element.id + '_clippathrect', 'transparent', 1, 'transparent', 1, new Rect(posx, posy, thickness, pathWidth));
                path = this.renderer.drawRectangle(rect);
                clipPath.appendChild(path);
            }
            else {
                path = getElement(this.element.id + '_clippathrect');
                path.setAttribute('width', (pathWidth).toString());
                if (this.isActive) {
                    path.setAttribute('x', (posx).toString());
                }
            }
        }
        else {
            if (!refresh) {
                option = new PathOption(this.element.id + '_clippathcircle', 'transparent', 10, 'transparent', 1, '0', d);
                path = this.renderer.drawPath(option);
                clipPath.appendChild(path);
            }
            else {
                path = getElement(this.element.id + '_clippathcircle');
                path.setAttribute('d', d);
            }
        }
        return path;
    };
    /**
     * Theming for progress bar
     */
    ProgressBar.prototype.setTheme = function () {
        this.themeStyle = getProgressThemeColor(this.theme);
        switch (this.theme) {
            case 'Bootstrap':
            case 'Bootstrap4':
                this.cornerRadius = this.cornerRadius === 'Auto' ? 'Round' : this.cornerRadius;
                break;
            default:
                this.cornerRadius = this.cornerRadius === 'Auto' ? 'Square' : this.cornerRadius;
        }
    };
    /**
     * Annotation for progress bar
     */
    ProgressBar.prototype.renderAnnotation = function () {
        if (this.progressAnnotationModule && this.annotations.length > 0) {
            this.progressAnnotationModule.renderAnnotations(this.secElement);
        }
    };
    /**
     * Handles the progressbar resize.
     * @return {boolean}
     * @private
     */
    ProgressBar.prototype.progressResize = function (e) {
        var _this = this;
        // 800 used as buffer time for resize event preventing from control rendered time
        if (!(new Date().getTime() > this.controlRenderedTimeStamp + 800)) {
            return false;
        }
        var arg = {
            bar: this,
            name: 'resized',
            currentSize: new Size(0, 0),
            previousSize: new Size(this.progressSize.width, this.progressSize.height),
        };
        if (this.resizeTo) {
            clearTimeout(this.resizeTo);
        }
        this.resizeTo = setTimeout(function () {
            if (_this.isDestroyed) {
                clearTimeout(_this.resizeTo);
                return;
            }
            arg.currentSize = _this.progressSize;
            _this.trigger('resized', arg);
            _this.secElement.innerHTML = '';
            _this.calculateProgressBarSize();
            _this.createSVG();
            _this.renderElements();
        }, 500);
        return false;
    };
    ProgressBar.prototype.progressMouseClick = function (e) {
        this.mouseEvent(mouseClick, e);
    };
    ProgressBar.prototype.progressMouseDown = function (e) {
        this.mouseEvent(mouseDown, e);
    };
    ProgressBar.prototype.progressMouseMove = function (e) {
        this.mouseEvent(mouseMove, e);
    };
    ProgressBar.prototype.progressMouseUp = function (e) {
        this.mouseEvent(mouseUp, e);
    };
    ProgressBar.prototype.progressMouseLeave = function (e) {
        this.mouseEvent(mouseLeave, e);
    };
    ProgressBar.prototype.mouseEvent = function (eventName, e) {
        var element = e.target;
        this.trigger(eventName, { target: element.id });
    };
    /**
     * Method to un-bind events for progress bar
     */
    ProgressBar.prototype.unWireEvents = function () {
        var startEvent = Browser.touchStartEvent;
        var moveEvent = Browser.touchMoveEvent;
        var stopEvent = Browser.touchEndEvent;
        /*! Find the Events type */
        var cancelEvent = Browser.isPointer ? 'pointerleave' : 'mouseleave';
        /*! UnBind the Event handler */
        EventHandler.remove(this.element, 'click', this.progressMouseClick);
        EventHandler.remove(this.element, startEvent, this.progressMouseDown);
        EventHandler.remove(this.element, moveEvent, this.progressMouseMove);
        EventHandler.remove(this.element, stopEvent, this.progressMouseUp);
        EventHandler.remove(this.element, cancelEvent, this.progressMouseLeave);
        window.removeEventListener((Browser.isTouch && ('orientation' in window && 'onorientationchange' in window)) ? 'orientationchange' : 'resize', this.resizeBounds);
    };
    /**
     * Method to bind events for bullet chart
     */
    ProgressBar.prototype.wireEvents = function () {
        var startEvent = Browser.touchStartEvent;
        var moveEvent = Browser.touchMoveEvent;
        var stopEvent = Browser.touchEndEvent;
        /*! Find the Events type */
        var cancelEvent = Browser.isPointer ? 'pointerleave' : 'mouseleave';
        /*! Bind the Event handler */
        EventHandler.add(this.element, 'click', this.progressMouseClick, this);
        EventHandler.add(this.element, startEvent, this.progressMouseDown, this);
        EventHandler.add(this.element, moveEvent, this.progressMouseMove, this);
        EventHandler.add(this.element, stopEvent, this.progressMouseUp, this);
        EventHandler.add(this.element, cancelEvent, this.progressMouseLeave, this);
        this.resizeBounds = this.progressResize.bind(this);
        window.addEventListener((Browser.isTouch && ('orientation' in window && 'onorientationchange' in window)) ? 'orientationchange' : 'resize', this.resizeBounds);
    };
    ProgressBar.prototype.removeSvg = function () {
        var svgElement = document.getElementById(this.element.id + 'SVG');
        if (svgElement) {
            remove(svgElement);
        }
    };
    ProgressBar.prototype.onPropertyChanged = function (newProp, oldProp) {
        var annotationElement;
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'annotations':
                    this.secElement.innerHTML = '';
                    this.renderAnnotation();
                    break;
                case 'value':
                    this.argsData = {
                        value: this.value,
                        progressColor: this.progressColor,
                        trackColor: this.trackColor
                    };
                    if (this.argsData.value === this.maximum) {
                        this.trigger(progressCompleted, this.argsData);
                    }
                    else {
                        this.trigger(valueChanged, this.argsData);
                    }
                    if (this.type === 'Circular') {
                        this.circular.renderCircularProgress(this.previousEndAngle, this.previousTotalEnd, true);
                        if (this.progressAnnotationModule && this.animation.enable && !this.isIndeterminate) {
                            annotationElement = document.getElementById(this.element.id + 'Annotation0').children[0];
                            this.annotateAnimation.doAnnotationAnimation(annotationElement, this, this.annotateEnd, this.annotateTotal);
                        }
                    }
                    else {
                        this.linear.renderLinearProgress(true, this.previousWidth);
                    }
                    break;
            }
        }
    };
    ProgressBar.prototype.requiredModules = function () {
        var modules = [];
        var enableAnnotation = false;
        enableAnnotation = this.annotations.some(function (value) {
            return (value.content !== null);
        });
        if (enableAnnotation) {
            modules.push({
                member: 'ProgressAnnotation',
                args: [this]
            });
        }
        return modules;
    };
    ProgressBar.prototype.getPersistData = function () {
        return ' ';
    };
    /**
     * To destroy the widget
     * @method destroy
     * @return {void}.
     * @member of ProgressBar
     */
    ProgressBar.prototype.destroy = function () {
        this.unWireEvents();
        _super.prototype.destroy.call(this);
        this.removeSvg();
        this.svgObject = null;
        this.element.classList.remove('e-progressbar');
    };
    __decorate([
        Property('Linear')
    ], ProgressBar.prototype, "type", void 0);
    __decorate([
        Property(null)
    ], ProgressBar.prototype, "value", void 0);
    __decorate([
        Property(null)
    ], ProgressBar.prototype, "secondaryProgress", void 0);
    __decorate([
        Property(0)
    ], ProgressBar.prototype, "minimum", void 0);
    __decorate([
        Property(100)
    ], ProgressBar.prototype, "maximum", void 0);
    __decorate([
        Property(0)
    ], ProgressBar.prototype, "startAngle", void 0);
    __decorate([
        Property(0)
    ], ProgressBar.prototype, "endAngle", void 0);
    __decorate([
        Property('100%')
    ], ProgressBar.prototype, "radius", void 0);
    __decorate([
        Property('100%')
    ], ProgressBar.prototype, "innerRadius", void 0);
    __decorate([
        Property(1)
    ], ProgressBar.prototype, "segmentCount", void 0);
    __decorate([
        Property(null)
    ], ProgressBar.prototype, "gapWidth", void 0);
    __decorate([
        Property('')
    ], ProgressBar.prototype, "segmentColor", void 0);
    __decorate([
        Property('Auto')
    ], ProgressBar.prototype, "cornerRadius", void 0);
    __decorate([
        Property(null)
    ], ProgressBar.prototype, "height", void 0);
    __decorate([
        Property(null)
    ], ProgressBar.prototype, "width", void 0);
    __decorate([
        Property(false)
    ], ProgressBar.prototype, "isIndeterminate", void 0);
    __decorate([
        Property(false)
    ], ProgressBar.prototype, "isActive", void 0);
    __decorate([
        Property(false)
    ], ProgressBar.prototype, "isGradient", void 0);
    __decorate([
        Property(false)
    ], ProgressBar.prototype, "isStriped", void 0);
    __decorate([
        Property('Auto')
    ], ProgressBar.prototype, "role", void 0);
    __decorate([
        Property(false)
    ], ProgressBar.prototype, "enableRtl", void 0);
    __decorate([
        Property(null)
    ], ProgressBar.prototype, "trackColor", void 0);
    __decorate([
        Property(null)
    ], ProgressBar.prototype, "progressColor", void 0);
    __decorate([
        Property(0)
    ], ProgressBar.prototype, "trackThickness", void 0);
    __decorate([
        Property(0)
    ], ProgressBar.prototype, "progressThickness", void 0);
    __decorate([
        Property(false)
    ], ProgressBar.prototype, "enablePieProgress", void 0);
    __decorate([
        Property('Fabric')
    ], ProgressBar.prototype, "theme", void 0);
    __decorate([
        Property(false)
    ], ProgressBar.prototype, "showProgressValue", void 0);
    __decorate([
        Property(false)
    ], ProgressBar.prototype, "trackSegmentDisable", void 0);
    __decorate([
        Complex({ size: null, color: null, fontStyle: null, fontWeight: 'Normal', fontFamily: null }, Font)
    ], ProgressBar.prototype, "labelStyle", void 0);
    __decorate([
        Complex({}, Margin)
    ], ProgressBar.prototype, "margin", void 0);
    __decorate([
        Complex({}, Animation$1)
    ], ProgressBar.prototype, "animation", void 0);
    __decorate([
        Event()
    ], ProgressBar.prototype, "load", void 0);
    __decorate([
        Event()
    ], ProgressBar.prototype, "textRender", void 0);
    __decorate([
        Event()
    ], ProgressBar.prototype, "loaded", void 0);
    __decorate([
        Event()
    ], ProgressBar.prototype, "valueChanged", void 0);
    __decorate([
        Event()
    ], ProgressBar.prototype, "progressCompleted", void 0);
    __decorate([
        Event()
    ], ProgressBar.prototype, "animationComplete", void 0);
    __decorate([
        Event()
    ], ProgressBar.prototype, "mouseClick", void 0);
    __decorate([
        Event()
    ], ProgressBar.prototype, "mouseMove", void 0);
    __decorate([
        Event()
    ], ProgressBar.prototype, "mouseUp", void 0);
    __decorate([
        Event()
    ], ProgressBar.prototype, "mouseDown", void 0);
    __decorate([
        Event()
    ], ProgressBar.prototype, "mouseLeave", void 0);
    __decorate([
        Collection([{}], ProgressAnnotationSettings)
    ], ProgressBar.prototype, "annotations", void 0);
    __decorate([
        Collection([{}], RangeColor)
    ], ProgressBar.prototype, "rangeColors", void 0);
    ProgressBar = __decorate([
        NotifyPropertyChanges
    ], ProgressBar);
    return ProgressBar;
}(Component));

/**
 * Progress Bar component export methods
 */

/**
 * Progress Bar component export methods
 */

export { ProgressBar, Margin, Font, Animation$1 as Animation, ProgressAnnotationSettings, RangeColor, ProgressAnnotation, Rect, Size, Pos, RectOption, ColorValue, convertToHexCode, componentToHex, convertHexToColor, colorNameToHex, TextOption, degreeToLocation, getPathArc, stringToNumber, setAttributes, effect, annotationRender, getElement$1 as getElement, removeElement, ProgressLocation, ProgressAnimation };
//# sourceMappingURL=ej2-progressbar.es5.js.map
