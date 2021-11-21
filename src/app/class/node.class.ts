export class Node {
    x: number;
    y: number;
    label: Label;
    parent: Node | null;
    adjacent: Node[];
    state: State;
    // Valor do parent até esse nó custo é sempre 10
    g: number | undefined;
    // Valor de calculo para o vizinho ate a comida
    h: number | undefined;
    constructor(label: Label, x: number, y: number) {
        this.x = x;
        this.y = y;
        this.parent = null;
        this.adjacent = [];
        this.label = label;
        this.state = 'notVisited';
    }

    getAdjacent(): Node[] {
        return this.adjacent;
    }

    isVisited(): boolean {
        return this.state === 'visited';
    }

    isOpen(): boolean {
        return this.state === 'open';
    }

    totalCost(): number {
        return this.g! + this.h!;
    }
}

type Label = 'wall' | 'player' | 'food' | 'ground' | 'visited' | 'open';
type State = 'visited' | 'open' | 'notVisited';