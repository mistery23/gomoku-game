import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {animate, style, transition, trigger} from '@angular/animations';


class Cell {
  id: string;
  class: any = { selected: false };
  name: string;
  constructor(id) {
    this.id = id;
  }
  select(player: boolean, name: string) {
    this.class = { selected: true, player1: player };
    this.name = name;
  }
}

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  animations: [
    trigger('expandField', [
      transition(':enter', [
        style({ opacity: '0', background: '#fff' }),
        animate('.5s ease-out', style({ opacity: '1', background: 'transparent' })),
      ]),
    ]),
  ],
})
export class GameComponent implements OnInit {

  count = 10;
  matrix: Array<any> = this.createMatrix(this.count);
  player1: string;
  player2: string;
  player: string;
  win = false;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
        if (params.player1 && params.player2 && params.player1 !== params.player2) {
          this.player1 = params.player1;
          this.player2 = params.player2;
          this.player = this.player1;
        } else {
          this.router.navigateByUrl('/');
        }
      });
  }

  createMatrix(count): Array<any> {
    const matrix = [];
    for (let i = 0; i < count; i++) {
      const row = [];
      for (let y = 0; y < count; y++) {
        row.push(new Cell(`${i}-${y}`));
      }
      matrix.push(row);
    }
    return matrix;
  }

  switchPlayer() {
    if (this.player === this.player1) {
      this.player = this.player2;
    } else {
      this.player = this.player1;
    }
  }

  restartGame() {
    this.matrix = this.createMatrix(10);
    this.player = this.player1;
    this.count = 10;
    this.win = false;
  }

  expandField(step) {
    for (let i = 0; i < step; i++) {
      const row = [];
      for (let y = 0; y < this.count; y++) {
        row.push(new Cell(`${i + this.count}-${y}`));
      }
      this.matrix.push(row);
    }
    for (let i = 0; i < this.matrix.length; i++) {
      const col = [];
      for (let y = 0; y < step; y++) {
        col.push(new Cell(`${i}-${y + this.count}`));
      }
      this.matrix[i].push(...col);
    }
    this.count += step;
  }

  onClick(event) {
    const [rowId, cellId] = event.target.id.split('-');
    if ( !this.matrix[rowId][cellId].class.selected && (rowId || cellId)) {
      if ( +rowId === (this.count - 1) || +cellId === (this.count - 1) ) {
        this.expandField(1);
      }
      if (this.player === this.player1) {
        this.matrix[rowId][cellId].select(true, this.player);
      } else {
        this.matrix[rowId][cellId].select(false, this.player);
      }
      if (
        this.checkHorizontalLine(+rowId, +cellId) ||
        this.checkVerticalLine(+rowId, +cellId) ||
        this.checkDiagonalRight(+rowId, +cellId, -1) ||
        this.checkDiagonalLeft(+rowId, +cellId, -1)) {
        this.win = true;
      } else {
        this.switchPlayer();
      }
    }
  }

  checkHorizontalLine(rowId: number, cellId: number, way = 1, count = 1) {
    let i = cellId + way;
    for (; i <= this.matrix[rowId].length;) {
      if (this.matrix[rowId][i] && this.matrix[rowId][i].name === this.player) {
        count++;
        i = i + way;
      } else {
        return (way === -1) ? null : this.checkHorizontalLine(+rowId, +cellId, -1, count);
      }
      if (count === 5) {
        return count;
      }
    }
    return false;
  }

  checkVerticalLine(rowId: number, cellId: number, way = 1, count = 1) {
    let i = rowId + way;
    for (; i <= this.matrix.length;) {
      if (this.matrix[i] && this.matrix[i][cellId].name === this.player) {
        count++;
        i = i + way;
      } else {
        return (way === -1) ? null : this.checkVerticalLine(+rowId, +cellId, -1, count);
      }
      if (count === 5) {
        return count;
      }
    }
    return false;
  }

  checkDiagonalLeft(rowId: number, cellId: number, way = 1, count = 1) {
    let i = rowId + way;
    let cellI = cellId + (way === 1 ? 1 : -1);
    for (; i <= this.matrix.length;) {
      if (this.matrix[i] && this.matrix[i][cellI] && this.matrix[i][cellI].name === this.player) {
        if (way === -1) {
          i--;
          cellI--;
        } else {
          i++;
          cellI++;
        }
        count++;
      } else {
        return way === 1 ? null : this.checkDiagonalLeft(+rowId, +cellId, 1, count);
      }
      if (count === 5) {
        return count;
      }
    }
    return false;
  }

  checkDiagonalRight(rowId: number, cellId: number, way = 1, count = 1) {
    let i = rowId + way;
    let cellI = cellId + (way === 1 ? -1 : 1);
    for (; i <= this.matrix.length;) {
      if (this.matrix[i] && this.matrix[i][cellI] && this.matrix[i][cellI].name === this.player) {
        if (way === -1) {
          i--;
          cellI++;
        } else {
          i++;
          cellI--;
        }
        count++;
      } else {
        return (way === 1) ? null : this.checkDiagonalRight(+rowId, +cellId, 1, count);
      }
      if (count === 5) {
        return count;
      }
    }
    return false;
  }

}
