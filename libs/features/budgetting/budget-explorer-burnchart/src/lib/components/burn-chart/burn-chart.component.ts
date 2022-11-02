import { Component, ViewChild, ElementRef, AfterViewInit, Input, OnChanges } from '@angular/core';

import { Chart } from 'chart.js';

@Component({
  selector: 'app-burn-chart',
  templateUrl: './burn-chart.component.html',
  styleUrls: ['./burn-chart.component.scss']
})
export class BurnChartComponent implements AfterViewInit, OnChanges
{
  @ViewChild('chart', { static: true }) chartEl!: ElementRef;

  @Input() labels!    : string[];
  @Input() groupData! : { label: string, data: number[] }[];
  @Input() lineData!  : number[];

  private _viewHasInit = false;

  private _chart!: Chart;

  ngAfterViewInit() { 
    this._initChart(); 
    this._viewHasInit = true; 
  }

  ngOnChanges() { 
    if (this._viewHasInit) 
      this._initChart(); 
  }

  private _initChart() 
  {
    const ctx = this.chartEl.nativeElement.getContext('2d');

    if (!this._chart)
      this._chart = new Chart(ctx, {
        type: 'bar',
        data: {
          datasets: [<any>{
            label: 'Balance',
            data: this.lineData,
            backgroundColor: 'rgba(0,0,0,0)',
            borderColor: '#ffce32',
            type: 'line'
          }]
            .concat(this.groupData)
          ,
          labels: this.labels
        },
        options: {
          aspectRatio: 34 / 9,
          hover: {
            mode: 'nearest',
            intersect: false
          },
          tooltips: {
            mode: "index",
            intersect: false,
            callbacks: {
              label: function (t:any, d:any) {
                const val = Math.round(parseInt(t.yLabel.toString()));
                const xLabel = d.datasets[t.datasetIndex].label;
                const yLabel = Math.abs(val) > 1000 ? val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : val.toString();
                return xLabel + ': ' + yLabel;
              }
            } 
          },
          scales: {
            yAxes: [
              {
                ticks: {
                  callback: function (label: number) {
                    const val = Math.round(label);
                    return Math.abs(val) > 1000 ? val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : val.toString();
                  }
                },
              }
            ]
          }

        }
      } as any);
    else {
      this._chart.data = {
        datasets: [<any>{ label: 'Balance', data: this.lineData, backgroundColor: 'rgba(0,0,0,0)', borderColor: '#ffce32', type: 'line' }]
          .concat(this.groupData),
        labels: this.labels
      };

      this._chart.update();
    }
  }

}
