import { Component, OnInit } from '@angular/core';
import { Node } from 'src/app/class/node.class';

@Component({
  selector: 'app-render',
  templateUrl: './render.component.html',
  styleUrls: ['./render.component.scss'],
})
export class RenderComponent implements OnInit {
  map: Node[][] = [];
  constructor() {}

  ngOnInit(): void {
    this.generateMap();
    this.setDefaultPlayerAndFoodLocation();
  }

  hover(x: number, y: number): void {
    this.map[x][y].label = 'wall';
  }

  mark(): void {
    // x: number, y: number
  }

  private calculeScreen(): { height: number; width: number } {
    const width =
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth;

    const height =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight;
    return {
      width,
      height,
    };
  }

  private generateMap(): void {
    console.log(this.map);
    const { width, height } = this.calculeScreen();
    console.log("🚀 ~ file: render.component.ts ~ line 35 ~ RenderComponent ~ generateMap ~ height", height)
    console.log("🚀 ~ file: render.component.ts ~ line 35 ~ RenderComponent ~ generateMap ~ width", width)
    const x = width / 35;
    const y = height / 25;
    for (let i = 0; i < x; i++) {
      const temp = [];
      for (let j = 0; j < y; j++) {
        temp.push(new Node('ground', x, y));
      }
      this.map.push(temp);
    }
    console.log(this.map);
  }

  run(): void {

  }

  handleNodeItem(node: Node): void {

  }

  private setDefaultPlayerAndFoodLocation(): void {
    const midle = Math.round(this.map[0].length / 2);
    this.map[0][0].label = 'player';
    this.map[midle][midle].label = 'food';
  }
}

function calculateDistanceBetweenNeighborAndFood(input: {
  nX: number,
  nY: number,
  fX: number,
  fY: number,
}): number {
  return (Math.abs(input.nX - input.fX) + Math.abs(input.nY - input.fY) * 10 );
}
