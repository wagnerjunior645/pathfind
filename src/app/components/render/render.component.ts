import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-render',
  templateUrl: './render.component.html',
  styleUrls: ['./render.component.scss'],
})
export class RenderComponent implements OnInit {
  map: any[][] = [];
  constructor() {}

  ngOnInit(): void {
    this.generateMap();
  }

  hover(x: number, y: number): void {
    this.map[x][y] = { color: 'red' };
  }

  mark(): void {
    x: number, y: number
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
        temp.push({color: 'white'});
      }
      this.map.push(temp);
    }
    console.log(this.map);
  }
}
