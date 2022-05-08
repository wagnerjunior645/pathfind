import { Label } from "../types/label.type";
import { State } from "../types/state.type";

export class Node {
    x: number;
    y: number;
    label: Label;
    parent: Node | null;
    adjacents: Node[];
    state: State;
    // Valor do parent até esse nó custo é sempre 10
    g: number | null;
    // Valor de calculo para o vizinho ate a comida
    h: number;
    constructor(label: Label, x: number, y: number) {
        this.x = x;
        this.y = y;
        this.parent = null;
        this.adjacents = [];
        this.label = label;
        this.state = 'notVisited';
        // this.g = Number.MAX_SAFE_INTEGER;
        this.g = null;
        this.h = 0;
    }

    getAdjacent(): Node[] {
        return this.adjacents;
    }

    isVisited(): boolean {
        return this.state === 'visited';
    }

    isOpen(): boolean {
        return this.state === 'open';
    }

    get totalCost(): number {
        return (this.g ? this.g : 0) + this.h;
    }

    get color(): string {
        if (this.label === 'player' || this.label === 'food') {
            return this.label;
        } else if (this.state === 'open' || this.state === 'visited' || this.state === 'finalPath') {
            return this.state;
        }
        return this.label;
    }

    get notVisitedAdjacents (): Node[] {
        return this.adjacents.filter(node => node.state !== 'notVisited');
    }
}
