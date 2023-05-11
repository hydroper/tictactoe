class Main {
    constructor() {
        this.grid = new Grid();
        this.gridColHTMLElements = new Map();
        this.htmlElementsToGridColumns = new Map();
        this.turn = Turn.NONE;

        this.initializeGrid();
        this.initializeUI();
        this.gameStart();
    }

    initializeGrid() {
        let colTemplate = document.getElementById('game-grid-column');
        let gameGridHTMLEl = document.getElementById('game-grid');
        for (let row of this.grid.rows) {
            for (let col of row) {
                let [colHTMLElement] = colTemplate.content.cloneNode(true).children;
                colHTMLElement.addEventListener('click', this.onColumnClick.bind(this));
                gameGridHTMLEl.appendChild(colHTMLElement);
                this.gridColHTMLElements.set(col, colHTMLElement);
                this.htmlElementsToGridColumns.set(colHTMLElement, col);
            }
        }
    }

    onColumnClick({target: colHTMLElement}) {
        let col = this.htmlElementsToGridColumns.get(colHTMLElement);
        if (col.drawing == GridColumnDrawing.EMPTY && this.turn != Turn.NONE) {
            col.drawing = this.turn == Turn.X ? GridColumnDrawing.X : GridColumnDrawing.O;
            colHTMLElement.setAttribute('data-drawing', col.drawing.toString());
            this.turn = this.turn == Turn.X ? Turn.O : Turn.X;
            if (this.grid.full || this.grid.drawingWins(GridColumnDrawing.X) || this.grid.drawingWins(GridColumnDrawing.O)) {
                this.gameComplete();
            }
        }
    }

    initializeUI() {
        document.querySelector('#restart-button').addEventListener('click', e => {
            this.gameStart();
        });
    }

    gameStart() {
        document.querySelector('main').setAttribute('data-state', 'playing');
        this.turn = Turn.X;
        for (let row of this.grid.rows) {
            for (let col of row) {
                col.drawing = GridColumnDrawing.EMPTY;
                this.gridColHTMLElements.get(col).setAttribute('data-drawing', 'empty');
            }
        }
    }

    gameComplete() {
        document.querySelector('main').setAttribute('data-state', 'complete');
        this.turn = Turn.NONE;
        let xWins = this.grid.drawingWins(GridColumnDrawing.X);
        let oWins = this.grid.drawingWins(GridColumnDrawing.O);
        if (xWins && !oWins) {
            document.querySelector('#game-result').textContent = 'X wins';
        }
        else if (oWins && !xWins) {
            document.querySelector('#game-result').textContent = 'O wins';
        }
        else {
            document.querySelector('#game-result').textContent = 'Draw';
        }
    }
}

class Grid {
    constructor() {
        this.rows = [
            [new GridColumn(), new GridColumn(), new GridColumn()],
            [new GridColumn(), new GridColumn(), new GridColumn()],
            [new GridColumn(), new GridColumn(), new GridColumn()],
        ];
    }

    get full() {
        return this.rows.every(row => row.every(c => c.drawing != GridColumnDrawing.EMPTY));
    }

    drawingWins(drawing) {
        let [row1, row2, row3] = this.rows;
        return ((row1[0].drawing == drawing && row1[1].drawing == drawing && row1[2].drawing == drawing)
            ||  (row1[0].drawing == drawing && row2[0].drawing == drawing && row3[0].drawing == drawing)
            ||  (row1[2].drawing == drawing && row2[2].drawing == drawing && row3[2].drawing == drawing)
            ||  (row3[0].drawing == drawing && row3[1].drawing == drawing && row3[2].drawing == drawing)
            ||  (row2[0].drawing == drawing && row2[1].drawing == drawing && row2[2].drawing == drawing)
            ||  (row1[1].drawing == drawing && row2[1].drawing == drawing && row3[1].drawing == drawing)
            ||  (row1[0].drawing == drawing && row2[1].drawing == drawing && row3[2].drawing == drawing)
            ||  (row1[2].drawing == drawing && row2[1].drawing == drawing && row3[0].drawing == drawing)
        );
    }
}

class GridColumn {
    constructor() {
        this.drawing = GridColumnDrawing.EMPTY;
    }
}

class GridColumnDrawing {
    static EMPTY = new GridColumnDrawing('empty');
    static X = new GridColumnDrawing('x');
    static O = new GridColumnDrawing('o');

    _s = '';

    constructor(s) {
        this._s = s;
    }

    toString() {
        return this._s;
    }
}

class Turn {
    static NONE = new Turn('empty');
    static X = new Turn('x');
    static O = new Turn('o');

    _s = '';

    constructor(s) {
        this._s = s;
    }

    toString() {
        return this._s;
    }
}

new Main();