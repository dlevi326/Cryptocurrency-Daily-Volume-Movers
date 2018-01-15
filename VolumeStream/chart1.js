/*var setChart = function(){

  var chart = new Chartist.Line('.ct-chart', {
    labels: exchangeList,
    // Naming the series with the series object array notation
    series: [{
      name: 'series-1',
      data: [5, 2, -4, 2, 0, -2, 5, -3]
    }]
  }, {
    fullWidth: false,
    // Within the series options you can use the series names
    // to specify configuration that will only be used for the
    // specific series.
    series: {
      'series-1': {
        lineSmooth: Chartist.Interpolation.step()
      }
    }
  }, [
    // You can even use responsive configuration overrides to
    // customize your series configuration even further!
    ['screen and (max-width: 320px)', {
      series: {
        'series-1': {
          lineSmooth: Chartist.Interpolation.none(),
          showArea: false,
          showPoint: true
        }
      },
      width: 100,
      height: 100
    }]
  ]);
};*/





var chart1;

var setChart = function(){
  var data = {
    labels: exchangeList,
    series: [exchangeVolList]
  };

  var options = {

    width: 100*exchangeList.length,
    height: 500,
    seriesBarDistance: 100*exchangeList.length
  };

  chart1 = new Chartist.Line(".ct-chart", data, options);
  //console.log(options.seriesBarDistance);
};









