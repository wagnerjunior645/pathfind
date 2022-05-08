import { Component, OnInit } from '@angular/core';
import { interval, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Node } from 'src/app/class/node.class';
import { Label } from 'src/app/types/label.type';

@Component({
  selector: 'app-render',
  templateUrl: './render.component.html',
  styleUrls: ['./render.component.scss'],
})
export class RenderComponent implements OnInit {
  map: Node[][] = [];
  isRuning = false;
  isPaused = false;
  isResume = false;

  private initClick = false;
  private label: Label | null = null;
  private openList: Node[] = [];
  private stop = new Subject<void>();
  private food: Node | undefined;
  private player: Node | undefined;

  constructor() {}

  ngOnInit(): void {
    this.init();
  }

  init(): void {
    this.clearDataBelforeRun();
    this.generateMap();
    this.setDefaultPlayerAndFoodLocation();
  }

  hover(x: number, y: number): void {
    this.map[x][y].label = 'wall';
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

  private clearDataBelforeRun(): void {
    this.map = [];
    this.openList = [];
    this.isPaused = false;
    this.isRuning = false;
    this.isResume = false;
  }

  private generateMap(): void {
    const { width, height } = this.calculeScreen();
    const x = Math.round(width / 35);
    const y = Math.round(height / 25);
    for (let i = 0; i < x; i++) {
      const temp = [];
      for (let j = 0; j < y; j++) {
        temp.push(new Node('ground', i, j));
      }
      this.map.push(temp);
    }
  }

  reload(): void {
    this.init();
  }

  resume(): void {
    this.isResume = true;
    this.run();
  }

  pause(): void {
    this.isPaused = true;
    this.endOrPauseRun();
  }

  run(): void {
    this.isRuning = true;

    if (!this.isPaused) {
      this.generateAdjacents();
      this.findPlayerAndFoodAndSet();
      this.generateHCost();

      this.player!.state = 'visited';
      this.openList.push(this.player!);
      this.player!.g = 0;
    }

    this.initOrResumeFind();
  }

  private initOrResumeFind(): void {
    interval(10)
      .pipe(takeUntil(this.stop))
      .subscribe(() => {
        const food = this.openList.find((node) => node.label === 'food');
        if (food) {
          let node = food;
          while (node.parent !== null) {
            node = node.parent;
            node.state = 'finalPath';
          }
          this.endOrPauseRun();
        }
        const topNode = this.openList.pop();
        if (!topNode) {
          this.endOrPauseRun();
          alert('Não tem como achar xD');
          return;
        }
        topNode.state = 'visited';
        topNode.adjacents.forEach((node) => {
          if (node.g === null || topNode.g! + 10 < node.g) {
            node.g = topNode.g! + 10;
            node.parent = topNode;
            if (node.state === 'notVisited') {
              node.state = 'open';
              this.openList.push(node);
            } else {
              node.state = 'open';
            }
          }
        });
        this.openList = this.openList
          .sort((nodeA, nodeB) => nodeA.totalCost - nodeB.totalCost)
          .reverse();
      });
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

  private generateHCost(): void {
    const food = this.food!;
    for (let x = 0; x < this.map.length; x++) {
      for (let y = 0; y < this.map[0].length; y++) {
        const currentNode = this.map[x][y];
        const hCost =
          (Math.abs(currentNode.x - food.x) +
            Math.abs(currentNode.y - food.y)) *
          10;
        currentNode.h = hCost;
      }
    }
  }

  private generateAdjacents(isDiagonal?: boolean): void {
    if (!isDiagonal) {
      for (let x = 0; x < this.map.length; x++) {
        for (let y = 0; y < this.map[0].length; y++) {
          const node = this.map[x][y];
          if (node.label !== 'wall') {
            const filteredNodes = [
              this.map[x]?.[y + 1],
              this.map[x]?.[y - 1],
              this.map[x + 1]?.[y],
              this.map[x - 1]?.[y],
            ]
              .filter((node) => node !== undefined)
              .filter((node) => node.label !== 'wall');
            node.adjacents = filteredNodes;
          }
        }
      }
    }
  }

  private placeFoodAndPlayer(node: Node): void {
    if (this.label === 'food' || this.label === 'player') {
      for (let x = 0; x < this.map.length; x++) {
        for (let y = 0; y < this.map[0].length; y++) {
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

  private findPlayerAndFoodAndSet(): void {
    for (let x = 0; x < this.map.length; x++) {
      for (let y = 0; y < this.map[0].length; y++) {
        if (this.map[x][y].label === 'food') {
          this.setFood(this.map[x][y]);
        } else if (this.map[x][y].label === 'player') {
          this.setPlayer(this.map[x][y]);
        }
      }
    }
  }

  private setPlayer(player: Node): void {
    this.player = player;
  }

  private setFood(food: Node): void {
    this.food = food;
  }

  private endOrPauseRun(): void {
    this.stop.next();
  }
}

function calculateDistanceBetweenNeighborAndFood(input: {
  nX: number;
  nY: number;
  fX: number;
  fY: number;
}): number {
  return Math.abs(input.nX - input.fX) + Math.abs(input.nY - input.fY) * 10;
}
