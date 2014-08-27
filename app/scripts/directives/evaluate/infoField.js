'use strict';
angular.module('wcagReporter')
.directive('infoButton', function(directivePlugin) {
    return directivePlugin({
        restrict: 'E',
        scope: {
            label: '@',
            target: '@'
        },
        link: function (scope, elm) {
            var tgt;
            elm.on('click', function () {
                if (!tgt) {
                    if (typeof scope.target === 'undefined') {
                        tgt = elm.next();
                    } else {
                        tgt = angular.element('#' + scope.target);
                    }
                }
                tgt.toggle(200, function () {
                    tgt.focus();
                });
            });
        },
        replace: true,
        template: '<a class="info-icon" href="">' +
            '<span class="glyphicon glyphicon-info-sign"></span>' +
            '<span class="sr-only">{{label}}</span></a> '
    });


}).directive('infoField', function(directivePlugin, $document) {
    /**
     * Get the next visible element that can receive focus outside the .alert-info
     */
    function getNextFocusElement(elm) {
        var selector = ':input:visible, a[href]:visible',
            focusable = $document.find(selector);

        elm = angular.element(elm)
        .closest('.alert-info')
        .find(selector).last();

        return focusable[focusable.index(elm)+1];
    }

    return directivePlugin({
        restrict: 'E',
        scope: {
            'ref': '@',
            'button': '@',
            'exitto': '@'
        },
        link: function (scope, elm) {
            elm.hide(0);

            scope.close = function ($event) {
                if ($event.type === 'keyup' &&
                ($event.keyCode !== 13 && $event.keyCode !== 27)) {
                    return;
                }
                getNextFocusElement($event.target).focus();
                elm.hide(200);
            };
            // function hide (e) {
            //     // The div doesn't get a 'click' so 
            //     // we check for a return keyup
            //     if (e.type === 'keyup' &&
            //     (e.keyCode !== 13 && e.keyCode !== 27)) {
            //         return;
            //     }
            //     elm.hide(200, function () {
            //         angular.element('#' + scope.exitto).focus();
            //     });
            // }
            // elm.on('keyup', hide)
            // .find('button').on('click', hide);
        },
        replace: true,
        transclude: true,
        templateUrl: 'views/directives/evaluate/infoField.html'
    });
});