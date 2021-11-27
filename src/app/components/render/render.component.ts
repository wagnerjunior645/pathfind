import { Component, OnInit } from '@angular/core';
import { Node } from 'src/app/class/node.class';
import { Label } from 'src/app/types/label.type';

@Component({
  selector: 'app-render',
  templateUrl: './render.component.html',
  styleUrls: ['./render.component.scss'],
})
export class RenderComponent implements OnInit {
  private initClick = false;
  private label: Label | null = null;
  private openList: Node[] = [];

  map: Node[][] = [];
  constructor() { }

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
    const x = Math.round(width / 35);
    const y = Math.round(height / 25);
    for (let i = 0; i < x; i++) {
      const temp = [];
      for (let j = 0; j < y; j++) {
        temp.push(new Node('ground', x, y));
      }
      this.map.push(temp);
    }
    console.log(this.map);
  }

  private generateAdjacents(): void {
    
  }

  run(): void {

  }

  handleNodeItem(node: Node): void {
    this.placeGroundAndWall(node);
  }

  handleInitClick(node: Node): void {
    this.initClick = true;
    this.label = node.label;
    this.placeGroundAndWall(node);
  }

  handleFinishClick(): void {
    this.initClick = false;
    this.label = null;
  }

  handleMouseIterate(node: Node): void {
    if (this.initClick) {
      this.handleNodeItem(node);
      this.placeFoodAndPlayer(node);
    }
  }

  private placeFoodAndPlayer(node: Node): void {
    if (this.label === 'food' || this.label === 'player') {
      for(let x = 0; x < this.map.length; x++){
        for(let y = 0; y < this.map[0].length; y++){
          console.log(this.map[x][y])
          if (this.map[x][y].label === this.label) {
            this.map[x][y].label = 'ground';
          }
        }
      }
      node.label = this.label;
    }
  }

  private placeGroundAndWall(node: Node): void {
    if (this.label && this.label !== 'player' && this.label !== 'food') {
      node.label = this.label === 'ground' ? 'wall' : 'ground';
    }
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
  return (Math.abs(input.nX - input.fX) + Math.abs(input.nY - input.fY) * 10);
}
