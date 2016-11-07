'use strict';
angular.module('multiboxModule', [])
    .directive('multichartIbox', ['$timeout', function($timeout) {
        return {
            restrict: 'AE',
            scope: {
                chartData: '=data'
            },
            templateUrl: 'bower_components/multichart-directive/directive.html',
            link: function (scope) {

                scope.createdMaximizedChart = false;
                scope.maximizedChart = null;

                scope.$watch('chartData', function(newValue) {
                    if (newValue){
                        $timeout(function () {
                            scope.updateDirective();
                        });
                    }
                }, true);

                scope.renderMaximizedChart = function (dateList, data, label) {
                    dateList = dateList.slice(0, data.length);
                    if (!scope.createdMaximizedChart) {
                        scope.createMaximizedChart(dateList, data, label);
                    }
                    else {
                        scope.maximizedChart.data.datasets[0].label = label;
                        scope.maximizedChart.data.datasets[0].data = data;
                        scope.maximizedChart.data.labels = dateList;
                        scope.maximizedChart.update(1000, false);
                    }
                };

                scope.updateDirective = function()
                {
                    scope.chartData.id = scope.chartData.title.replace(/\s+/g, '');
                    scope.rendermicroCharts();
                    scope.toggleMaximizedChart(0);
                };

                scope.parseNumber = function(element){
                    if(element.dataArray.length !== 0) {
                        switch (element.unit) {
                            case '%': return element.dataValue + '%';
                            case '€': return '€' + element.dataValue;
                            case '$': return '$' + element.dataValue;
                            default : return element.dataValue;
                        }
                    }
                    else{
                        return element.unit;
                    }
                };

                scope.createMaximizedChart = function(dateList,data,label){
                    var ctx = document.getElementById(scope.chartData.id+"MaximizedChart");
                    scope.maximizedChart = new Chart(ctx, {
                        type: 'line',
                        data: {
                            labels: dateList,
                            datasets: [{
                                label: label,
                                data: data,
                                backgroundColor: 'rgba(25, 170, 137,0.2)',
                                borderColor: '#19AA89',
                                borderWidth: 1
                            }]
                        },
                        options: {
                            scales: {
                                xAxes: [{
                                    ticks: {
                                        display: false
                                    },
                                    gridLines: {
                                        display:false
                                    }
                                }],
                                yAxes: [{
                                    gridLines: {
                                        display:false
                                    },
                                    ticks: {
                                        beginAtZero: true
                                    }
                                }]
                            },
                            legend: {
                                position: 'bottom'
                            },
                            tooltips: {
                                mode: 'x-axis',
                                titleFontSize: 17,
                                bodyFontSize: 13,
                                titleFontStyle: 'bold'
                            }
                        }
                    });
                    scope.createdMaximizedChart = true;
                };

                scope.rendermicroCharts = function() {
                    for(var i = 0;i<scope.chartData.dataList.length;i++)
                    {
                        $('#sparkLine'+scope.chartData.id+i).sparkline( scope.chartData.dataList[i].dataArray,{type:'line' ,spotColor:'#F7A24F',lineColor:'#19AA89',
                            fillColor:'#19AA89',minSpotColor:'#F7A24F',maxSpotColor:'#F7A24F',defaultPixelsPerValue:'10px',width:'50px',height:'27px',highlightSpotColor:'#F7A24F',highlightLineColor:'#F7A24F'});
                    }
                };

                scope.resetUnderline = function(){
                    var smalls = document.getElementsByClassName('underliningfx'+scope.chartData.id);
                    for(var i = 0;i<smalls.length;i++)
                    {
                        smalls[i].className='stats-label underliningfx'+scope.chartData.id;
                    }
                };

                scope.toggleMaximizedChart = function(index){
                    if(scope.chartData.dataList.length !== 0){
                        var dataI = scope.chartData.dataList[index];
                        scope.renderMaximizedChart(scope.getDates(scope.chartData.date_range.start_date,scope.chartData.date_range.end_date),dataI.dataArray, dataI.label);
                        scope.resetUnderline();
                        document.getElementById('label'+scope.chartData.id+index).className='stats-label underliningfx' + scope.chartData.id + ' underlined';
                    }
                };

                scope.getDates = function(start_date, stopDate) {
                    var dateArray = [];
                    var currentDate = start_date;
                    while (currentDate <= stopDate) {
                        dateArray.push( new Date (currentDate).toISOString().slice(0,10));
                        currentDate = scope.addDays(currentDate,1);
                    }
                    return dateArray;
                };

                scope.addDays = function(x,days) {
                    var dat = new Date(x.valueOf());
                    dat.setDate(dat.getDate() + days);
                    return dat;
                };
            }
        };
    }]);
